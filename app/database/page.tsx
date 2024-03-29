'use client'
import React, { useState, useEffect } from "react";
import { SetStateAction } from 'react';

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

const DiscordInviteLink = ({ value }: { value: string }) => (
  <a href={`https://discord.gg/${value}`} target="_blank" rel="noopener noreferrer">
    {value}
  </a>
);

const LinkDropdown = ({ links }: { links: string[] }) => {
  console.log("Links:", links); // Log the links prop
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
const LinkRenderer = ({ value, renderer }: { value: string | string[]; renderer: (value: string) => React.ReactNode }) => (
  <div>
    {Array.isArray(value) ? (
      value.length > 1 ? (
        <LinkDropdown links={value.map((link) => renderer(link as string) as string)} />
      ) : (
        renderer(value[0] as string)
      )
    ) : (
      renderer(value as string)
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
  },
  {
    key: "discord_owner_id",
    label: "Owner's Discord ID",
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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rows, setRows] = useState<Item[]>([]);
const [sortDescriptor, setSortDescriptor] = useState<SetStateAction<SortDescriptor<Item>>>({ column: '', direction: 'ascending' });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://cors-anywhere.herokuapp.com/https://antip2w.com/api/database/realms/all", {
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
    
    // Sort the items based on sortDescriptor
    // Sort the items based on sortDescriptor
// Sort the items based on sortDescriptor
// Sort the items based on sortDescriptor
const sortedItems = items.slice().sort((a, b) => {
  const columnA = sortDescriptor?.column;
  const columnB = sortDescriptor?.column;

  if (columnA && columnB && a[columnA] === b[columnB]) {
    return 0;
  }

  if (sortDescriptor && sortDescriptor.direction === 'ascending') {
    return columnA && columnB ? (a[columnA] > b[columnB] ? 1 : -1) : 0;
  } else {
    return columnA && columnB ? (a[columnA] < b[columnB] ? 1 : -1) : 0;
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
    <main className={montserrat.className}>
        <div className="w-full flex justify-center items-center flex-col">
            {/* Add search input */}
            <Image
                className='items-center mb-3'
                src="/../rounded.png"
                width={400}
                height={400}
                alt="antip2w"
            />
            <div>
                <h1 className="float-left text-center text-4xl mb-5 pr-5">P2W Realms Database</h1>
            </div>

            <Input
                className="w-5/6 mb-5 md:w-1/2"
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
                                    Servers that are not colored are regular P2W Servers
                                </p>
                                <p className="text-amber-500">
                                    Servers that are colored yellow are marked because the owner has done something questionable
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
    className="w-full md:w-5/6 mt-5"
    aria-label="pay to win realm database"
    color="default"
    selectionMode="single"
    sortDescriptor={sortDescriptor.column ? sortDescriptor : { column: '', direction: 'ascending' }} // Ensure sortDescriptor is always an object
    onSortChange={(descriptor) => setSortDescriptor(descriptor)} // Wrap setSortDescriptor in a function
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
                                            ? (column.render as (value: string | boolean | string[]) => React.ReactNode)(value)
                                            : value}
                                    </TableCell>
                                );
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </main>
);
}


