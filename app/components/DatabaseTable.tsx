import React, { useState, useEffect } from "react";
import Image from 'next/image';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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



const DatabaseTable = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [rows, setRows] = useState<Item[]>([]);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor<Item>>({ column: '', direction: 'ascending' });
  
    

  
  
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
  
    const filterItems = (items: Item[], searchTerm: string) => {
      const normalizedSearchTerm = searchTerm.toString().toLowerCase();
    
      const sortedItems = items.slice().sort((a, b) => {
        if (!sortDescriptor.column) {
          return 0; // No sorting column selected
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
        <div className="flex flex-col items-center overflow-auto"> {/* Add overflow-auto class */}
        
            <Input
                className="w-full md:w-1/2 mb-5" // Adjust width and center horizontally
                placeholder="Search Anything"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onPress={onOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 016 16">
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Database Information</ModalHeader>
                            <ModalBody>
                                <p>
                                    I will put something here soon...
                                </p>
                                <p>
                                <Link href="/report">Report A Server <b>(Click me)</b></Link>

                                </p>
                                
                                <User
                                    name="Treevor"
                                    description="Developer"
                                    avatarProps={{
                                        src: "https://cdn.discordapp.com/avatars/1068316524470874173/0b2dab3d3bee4d9fd92d61b75cbb24c9.png?size=1024"
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Great!
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
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
                                ? (column.render as (value: string | boolean | string[], item: Item) => React.ReactNode)(
                                    value,
                                    item
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

export default DatabaseTable;
