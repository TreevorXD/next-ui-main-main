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
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { Montserrat } from 'next/font/google'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const rows = require('../db/serverData');

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

interface DropdownMenuProps {
  'aria-label': string;
  placement: string;
}

const LinkDropdown = ({ links }: { links: string[] }) => (
  <Dropdown>
    <DropdownTrigger>
      <Button variant="bordered">Open Links</Button>
    </DropdownTrigger>
    <DropdownMenu aria-label="Links" placement="bottom-start">
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

  const list = useAsyncList<Item>({
    async load({ signal }) {
      setIsLoading(false);
      return {
        items: rows,
      };
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
      <div className="w-full absolute flex justify-center">
        <ul className="">
          <li className="w-full flex justify-center">
            <Image
              className='items-center'
              src="/../images/rounded.png"
              width={200}
              height={200}
              alt="antip2w"
            />
          </li>
          <li className="pb-5">
            <Tooltip content="Yellow Highlighted Servers are Classified as 'suspicious' because the owner has done something sketchy">
              <h1 className="text-center text-4xl">P2W Realms Database (hover for info)</h1>
            </Tooltip>
          </li>
          <li className="w-full flex justify-center text-center pb-5">
            <Input
              className="w-1/5"
              placeholder="Search Anything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </li>
          <li>
            <Table
              className="center w-full"
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
          </li>
        </ul>
      </div>
    </main>
  );
}
