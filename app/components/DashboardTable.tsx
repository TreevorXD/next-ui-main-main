import React, { useState, useEffect } from "react";
import Image from 'next/image';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Textarea,
  Spinner,
  Input,
  Modal,
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure,
  User,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { Montserrat } from 'next/font/google';
import Link from 'next/link'
import ServerForm from './ServerForm';

const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin']
});

type Item = {
  key: string;
  dangerous: boolean;
  [key: string]: string | boolean | string[];
};

// Define SortDescriptor type
type SortDescriptor<T> = {
  column: string;
  direction: 'ascending' | 'descending';
};

const RealmCodeLink = ({ value }: { value: string }) => (
  <a href={`https://realms.gg/${value}`} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);

const DiscordUserLink = ({ value }: { value: string }) => (
  <a href={`https://discordapp.com/users/${value}`} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);

const DiscordInviteLink = ({ value }: { value: string }) => (
  <a href={`https://discord.gg/${value}`} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);

const XboxProfileLink = ({ value }: { value: string }) => (
  <a href={`http://live.xbox.com/Profile?Gamertag=${value}`} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);
const LinkDropdown = ({ links }: { links: string[] }) => {
  console.log("Links received in LinkDropdown:", links); // Log the links prop
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Open Links</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Links">
        {links.map((link, index) => (
          <DropdownItem key={index} as="a" href={link} target="_blank" rel="noopener noreferrer">
            Link {index + 1}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const LinkRenderer = ({ value, renderer, excludeLinks }: { value: string | string[]; renderer: (value: string) => React.ReactNode; excludeLinks?: boolean }) => (
  <div>
    {Array.isArray(value) ? (
      value.map((link, index) => (
        <React.Fragment key={index}>
          {index > 0 && ", "}
          {excludeLinks ? link : renderer(link)} {/* Render only the text content if excludeLinks is true */}
        </React.Fragment>
      ))
    ) : (
      excludeLinks ? value : renderer(value as string)
    )}
  </div>
);

const ProofLink = ({ value }: { value: string | string[] }) => (
  <LinkRenderer
    value={value}
    renderer={(link) => (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Link
      </a>
    )}
  />
);

const columns = [
  {
    key: "actions",
    label: "Actions",
    render: (value: string, item: Item, handleDelete: (id: string) => void, exportServerData: (serverData: Item) => void, openModal: (item: Item) => void) => (
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Actions</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions">
          <DropdownItem onClick={() => handleDelete(item._id)}>Delete</DropdownItem>
          <DropdownItem onClick={() => exportServerData(item)}>Export</DropdownItem>
          <DropdownItem onClick={() => openModal(item)}>Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    ),
  },
  {
    key: "_id",
    label: "Database ID",
  },
  {
    key: "discord_name",
    label: "Name",
  },
  {
    key: "realm_id",
    label: "Realm Id",
    render: (value: string | string[]) => (
      <LinkRenderer
        value={value}
        renderer={(code) => code} // Just render the code without any link
        excludeLinks={true} // Exclude rendering links for "Realm Id" column
      />
    ),
  },
  
  {
    key: "realm_code",
    label: "Realm Code",
    render: (value: string | string[]) => (
      <LinkRenderer
        value={value}
        renderer={(code) => (
          <RealmCodeLink value={code as string} />
        )}
      />
    ),
  },
  {
    key: "discord_server_id",
    label: "Discord Server ID",
  },
  {
    key: "discord_invite",
    label: "Discord Invite",
    render: (value: string) => (
      <LinkRenderer
        value={[value]}
        renderer={(invite) => (
          <DiscordInviteLink value={invite as string} />
        )}
      />
    ),
  },
  {
    key: "xbox_tag",
    label: "Owner's XBL",
    render: (value: string | string[]) => (
      <LinkRenderer
        value={value}
        renderer={(code) => (
          <XboxProfileLink value={code as string} />
        )}
      />
    ),
  },
  {
    key: "discord_owner_id",
    label: "Owner's Discord ID",
    render: (value: string) => (
      <LinkRenderer
        value={[value]}
        renderer={(invite) => (
          <DiscordUserLink value={invite as string} />
        )}
      />
    ),
  },
  {
    key: "image_proof",
    label: "Proof",
    render: (value: string | string[]) => <ProofLink value={value} />,
  },
  {
    key: "link",
    label: "Website",
    render: (value: string | string[]) => (
      <LinkRenderer
        value={value}
        renderer={(link) => (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        )}
      />
    ),
  },
  {
    key: "dangerous",
    label: "Suspicious Owner?",
    render: (value: boolean) => (value ? "Yes" : "No"),
  },
  {
    key: "p2w_id",
    label: "P2W ID",
  },
];

const DashboardTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rows, setRows] = useState<Item[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor<Item>>({ column: '', direction: 'ascending' });
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isValidJSON, setIsValidJSON] = useState(true);
  const [editedItem, setEditedItem] = useState<string | null>(null);
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure(); // New modal state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("../api/realms", {
          headers: {
            Authorization: "q5VLqNQBZu"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRows(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (_id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await fetch(`../api/delete/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'BozRgu8UEY'
        }
      });
      if (response.ok) {
        setRows(rows.filter(item => item._id !== _id));
      } else {
        throw new Error("Failed to delete server");
      }
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  };
  const exportServerData = (serverData: Item) => {
    const jsonServerData = JSON.stringify(serverData);
    const blob = new Blob([jsonServerData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'server_data.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openModal = (item: Item) => {
    setEditingItem(item);
    onOpen();
  };

  const handleSaveChanges = async () => {
    try {
      if (!isValidJSON || !editingItem) {
        throw new Error("Invalid JSON format");
      }

      setEditingItem(JSON.parse(editedItem!));

      const response = await fetch(`../api/edit/${editingItem._id}`, {
        method: 'POST',
        headers: {
          Authorization: 'BozRgu8UEY',
          'Content-Type': 'application/json',
        },
        body: editedItem!
      });
      if (response.ok) {
        const updatedResponse = await fetch("../api/realms", {
          headers: {
            Authorization: "q5VLqNQBZu"
          }
        });
        const updatedData = await updatedResponse.json();
        setRows(updatedData);
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const jsonString = e.target.value;
    setEditedItem(jsonString);
    try {
      JSON.parse(jsonString);
      setIsValidJSON(true);
    } catch (error) {
      setIsValidJSON(false);
    }
  };

  const filterItems = (items: Item[], searchTerm: string) => {
    const normalizedSearchTerm = searchTerm.toString().toLowerCase();

    const sortedItems = items.slice().sort((a, b) => {
      if (!sortDescriptor.column) {
        return 0;
      }

      const columnA = a[sortDescriptor.column];
      const columnB = b[sortDescriptor.column];

      if (columnA === columnB) {
        return 0;
      }

      if (sortDescriptor.direction === 'ascending') {
        return columnA > columnB ? 1 : -1;
      } else {
        return columnA < columnB ? 1 : -1;
      }
    });

    return sortedItems.filter((item) => {
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const value = item[key];
          if (typeof value === 'string' && value.toLowerCase().includes(normalizedSearchTerm)) {
            return true;
          }
        }
      }
      return false;
    });
  };

  return (
    <div className="flex flex-col items-center overflow-auto">
      {/* New button and modal */}
      <Button onClick={onSecondModalOpen} className="mb-5">Add Server</Button>
      <Modal isOpen={isSecondModalOpen} onClose={onSecondModalClose}  scrollBehavior="inside" size="2xl">
        <ModalContent>
          <ModalHeader>Add Server</ModalHeader>
          <ModalBody>
            <ServerForm />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onSecondModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Search input */}
      <Input
        className="w-full md:w-1/2 mb-5"
        placeholder="Search Anything"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* First modal for editing items */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Edit Item</ModalHeader>
          <ModalBody>
            {editingItem && (
              <Textarea
                label="Edit JSON"
                placeholder="Start Editing the JSON"
                className="max-w-full"
                value={editedItem !== null ? editedItem : JSON.stringify(editingItem, null, 2)}
                onChange={handleTextareaChange}
                invalid={!isValidJSON}
              />
            )}
            {!isValidJSON && <p className="text-danger">Invalid JSON format</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => { handleSaveChanges(); onClose(); }}>Save Changes</Button>
            <Button color="secondary" onPress={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Table component */}
      <Table
        className="w-full mt-5"
        aria-label="pay to win realm database"
        color="default"
        selectionMode="single"
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor: SortDescriptor<Item>) => setSortDescriptor(descriptor)}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filterItems(rows, searchTerm)}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item: Item) => (
            <TableRow
              key={item.key}
              className={item.dangerous ? 'danger-row' : ''}
            >
              {(columnKey) => {
                const column = columns.find((col) => col.key === columnKey);
                const value = item[columnKey] as string | string[] | boolean;
                return (
                  <TableCell>
                    {column && column.render
                      ? (column.render as (value: string | boolean | string[]) => React.ReactNode)(
                        value,
                        item,
                        handleDelete,
                        exportServerData,
                        openModal
                      )
                      : Array.isArray(value)
                        ? (
                          <ul>
                            {value.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )
                        : value}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardTable;
