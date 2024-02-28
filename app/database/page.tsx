// page.tsx
'use client'
import React from "react";
import Image from 'next/image';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Tooltip,
  Input,
  Modal,
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure,
  User
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { Montserrat } from 'next/font/google'
import { Popover, PopoverTrigger, PopoverContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import connect from "../../db";
import Post from "../../models/Post";

const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin']
});

type Item = {
  key: string;
  dangerous: boolean;
  [key: string]: string | boolean | string[];
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

const LinkDropdown = ({ links }: { links: string[] }) => (
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

const SiteLink = ({ value }: { value: string | string[] }) => (
  <div>
    {Array.isArray(value) ? (
      value.length > 1 ? (
        <LinkDropdown links={value as string[]} />
      ) : (
        <a href={value[0]} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      )
    ) : (
      <a href={value} target="_blank" rel="noopener noreferrer">
        Link
      </a>
    )}
  </div>
);

const ProofLink = ({ value }: { value: string | string[] }) => (
  <div>
    {Array.isArray(value) ? (
      value.length > 1 ? (
        <LinkDropdown links={value as string[]} />
      ) : (
        <a href={value[0]} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      )
    ) : (
      <a href={value} target="_blank" rel="noopener noreferrer">
        Link
      </a>
    )}
  </div>
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
    render: (value: string) => <RealmCodeLink value={value} />,
  },
  {
    key: "discord_server_id",
    label: "Discord Server ID",
  },
  {
    key: "discord_invite",
    label: "Discord Invite",
    render: (value: string) => <DiscordInviteLink value={value} />,
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
    render: (value: string | string[]) => <SiteLink value={value} />,
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const list = useAsyncList<Item>({
    async load({ signal }) {
      try {
        setIsLoading(true);
        await connect();

        const posts = await Post.find();
        setIsLoading(false);

        return {
          items: posts.map((post) => post.toObject()),
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        return { items: [] };
      }
    },
    async sort({ items, sortDescriptor }) {
      if (sortDescriptor && 'column' in sortDescriptor && typeof sortDescriptor.column === 'string') {
        return {
          items: items.slice().sort((a, b) => {
            let first = (a as { [key: string]: string | number })[sortDescriptor.column!];
            let second = (b as { [key: string]: string | number })[sortDescriptor.column!];
            let cmp =
              (parseInt(first as string) || first) < (parseInt(second as string) || second) ? -1 : 1;

            if (sortDescriptor.direction === "descending") {
              cmp *= -1;
            }

            return cmp;
          }),
        };
      } else {
        return { items };
      }
    },
  });

  const filterItems = (items: Item[], searchTerm: string) => {
    const normalizedSearchTerm = searchTerm.toString().toLowerCase();

    return items.filter((item) => {
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
  const filteredItems = filterItems(list.items, searchTerm);

  return (
    <main className={montserrat.className}>
      <div className="w-full flex justify-center items-center flex-col">
        <Image
          className='items-center mb-3'
          src="/../images/rounded.png"
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
        <Button onPress={onOpen}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
        </svg></Button>
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
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
          aria-label="pay to win realm database"
          color="default"
          selectionMode="single"
        >
          <TableHeader columns={columns}>
            {(column) => <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody
            items={filteredItems}
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
                  const value = getKeyValue(item, columnKey) as string | string[] | boolean;
                  return (
                    <TableCell>
                      {column && column.render
                        ? (column.render as (value: string | boolean | string[]) => React.ReactNode)(value as string | boolean | string[])
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
