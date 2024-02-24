'use client';
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner, Tooltip, Button } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { Montserrat } from 'next/font/google'

const rows = require('../db/serverData'); // Assuming rows is an array of objects

const montserrat = Montserrat({ 
  weight: '600',
  subsets: ['latin'] 
})

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

const SiteLink = ({ value }: { value: string | string[] }) => (
  <div>
    {Array.isArray(value) ? (
      value.map((image, index) => (
        <div key={index}>
          <a href={image} target="_blank" rel="noopener noreferrer">
            Link {index + 1}
          </a>
        </div>
      ))
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
      value.map((image, index) => (
        <div key={index}>
          <a href={image} target="_blank" rel="noopener noreferrer">
            Link {index + 1}
          </a>
        </div>
      ))
    ) : (
      <a href={value} target="_blank" rel="noopener noreferrer">
        Link
      </a>
    )}
  </div>
);

const columns = [
  {
    key: "server_name",
    label: "Name",
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
];

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  let list = useAsyncList<Item>({
    async load({ signal }) {
      setIsLoading(false);
      // Assuming rows is an array of objects
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
        // Handle the case where sortDescriptor.column is not available
        // You can return the items as is or handle it in a different way based on your requirements
        return { items };
      }
    },
  });

  return (
    <main className={montserrat.className}>
      <div className="pb-5">
        <Tooltip content="Yellow Highlighted Servers are Classified as 'suspicious' because the owner has done something sketchy">
          <h1 className="text-center text-4xl">Pay To Win Realm Database (hover for info)</h1>
        </Tooltip>
      </div>
      <Table
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
          items={list.items}
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
    </main>
  );
}