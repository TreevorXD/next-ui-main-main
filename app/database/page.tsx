'use client'
import DatabaseTable from '../components/DatabaseTable';
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
    <main className={montserrat.className}>
        <div className="w-full flex justify-center items-center flex-col">
            {/* Add search input */}
            <Image
                className='items-center mb-3'
                src="/../rounded.png"
                width={400}
                height={400}
                alt="antip2w"
                priority={true}
            />
            <div>
                <h1 className="float-left text-center text-4xl mb-5 pr-5">P2W Realms Database</h1>
            </div>
            
            <DatabaseTable />
        </div>
    </main>
);
}

