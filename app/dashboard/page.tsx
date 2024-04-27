// Import necessary modules and components
'use client'
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const allowedUids = ['AohsbxeW2pWIsAfTiCQAtJKga3k2', '4JNPKmw9cjQDKVbMjP5ceJpmxO82'];

const ProtectedPage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState([]);

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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                if (!allowedUids.includes(authUser.uid)) {
                    window.location.href = '/';
                } else {
                    setUser(authUser);
                }
            } else {
                window.location.href = '/sign-in';
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleDelete = async (id) => {
      // Show confirmation dialog
      const isConfirmed = window.confirm("Are you sure you want to delete this item?");
      if (!isConfirmed) {
          return; // If not confirmed, do nothing
      }
  
      try {
          const response = await fetch(`../api/delete/${id}`, {
              method: 'DELETE',
              headers: {
                  Authorization: 'BozRgu8UEY'
                  // Add any other headers as needed
              }
          });
          if (response.ok) {
              setRows(rows.filter(item => item._id !== id));
          } else {
              throw new Error("Failed to delete server");
          }
      } catch (error) {
          console.error("Error deleting server:", error);
          // Handle error
      }
  };

    const handleInsert = async () => {
        try {
            const response = await fetch(`../api/create`, {
                method: 'POST',
                headers: {
                    Authorization: 'BozRgu8UEY',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // Provide the necessary data for inserting the server
                    // Replace with actual data
                    key: 'value',
                    discord_name: 'value',
                    realm_code: 'value',
                    // Add other fields as needed
                })
            });
            if (response.ok) {
                // Refresh the data after insertion
                const updatedResponse = await fetch("../api/realms", {
                    headers: {
                        Authorization: "q5VLqNQBZu"
                    }
                });
                const updatedData = await updatedResponse.json();
                setRows(updatedData);
            } else {
                throw new Error("Failed to insert server");
            }
        } catch (error) {
            console.error("Error inserting server:", error);
            // Handle error
        }
    };

    const columns = [
        {
            key: "discord_name",
            label: "Name",
        },
        {
            key: "realm_id",
            label: "Realm ID",
        },
        {
            key: "_id",
            label: "Database ID",
        },
    ];

    const filterItems = (items, searchTerm) => {
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

    return (
        <main className="montserrat">
            <div className="w-full justify-center items-center flex-col">
                <h1 className='pb-3'>Welcome, {user.uid}!</h1>

                <Button color="primary" variant="bordered" onClick={handleInsert}>
                    Insert Server
                </Button> 
                

                {/* Database Table */}
                <input
                    placeholder="Search Anything"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='ml-10'
                />
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <table className='ml-10'>
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th className='pl-10 text-center' key={column.key}>{column.label}</th>
                                ))}
                                <th className='pl-10 text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterItems(rows, searchTerm).map((item, index) => (
                                <tr key={index}>
                                    {columns.map((column) => (
                                        <td className='pl-10 pt-2 text-center' key={column.key}>{item[column.key]}
                                        </td>
                                    ))}
                                    <td>
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    variant="bordered"
                                                    isIconOnly
                                                    className='ml-2'
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                                    </svg>
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                aria-label="Action event example"
                                                onAction={(key) => {
                                                    if (key === 'delete') {
                                                        handleDelete(item._id);
                                                    }
                                                }}
                                            >
                                                <DropdownItem key="export">Export (SOON)</DropdownItem>
                                                <DropdownItem key="edit" className="text-warning" color="warning">Edit Item</DropdownItem>
                                                <DropdownItem key="delete" className="text-danger" color="danger">Delete Item</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {/* End of Database Table */}
            </div>
        </main>
    );
};

export default ProtectedPage;
