'use client'
import DatabaseTable from '../components/DatabaseTable';
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import {
  useDisclosure,
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

