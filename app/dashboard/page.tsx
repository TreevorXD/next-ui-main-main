'use client'
import React, { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, Textarea, DropdownItem, Accordion, AccordionItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import ServerForm from '../components/ServerForm';
import { auth } from '../firebase/config';

const allowedUids = ['AohsbxeW2pWIsAfTiCQAtJKga3k2', '4JNPKmw9cjQDKVbMjP5ceJpmxO82'];

const ProtectedPage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalSize, setModalSize] = useState("2xl");
    const [editingItem, setEditingItem] = useState(null);

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
                }
            });
            if (response.ok) {
                setRows(rows.filter(item => item._id !== id));
            } else {
                throw new Error("Failed to delete server");
            }
        } catch (error) {
            console.error("Error deleting server:", error);
        }
    };

    const handleInsert = async (formData) => {
        try {
            console.log(formData)
            const response = await fetch(`../api/create`, {
                method: 'POST',
                headers: {
                    Authorization: 'BozRgu8UEY',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
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

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`../api/edit/${editingItem._id}`, {
                method: 'POST',
                headers: {
                    Authorization: 'BozRgu8UEY', // Replace with your actual authorization token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingItem) // Send the edited JSON data
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
            // Handle error
        }
    };
    
    const handleTextareaChange = (e) => {
        // Update the editingItem state with the modified JSON content
        setEditingItem(JSON.parse(e.target.value));
    };

    const exportServerData = (serverData) => {
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

    // Function to open modal
    const openModal = (item) => {
        setModalSize("2xl"); // Set modal size to 2xl
        setEditingItem(item); // Set the item being edited
        onOpen();
    };

    return (
        <main className="montserrat">
            <div className="w-full justify-center items-center flex-col">
                <h1 className='pb-3'>Welcome{user ? user.email : 'Guest'}
</h1>

                <Accordion>
                    <AccordionItem key="1" aria-label="Accordion 1" title="Server List (Expand)">
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
                            <table className='w-full'>
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
                                            <th className='text-center' key={column.key}>{column.label}</th>
                                        ))}
                                        <th className='text-center'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterItems(rows, searchTerm).map((item, index) => (
                                        <tr key={index}>
                                            {columns.map((column) => (
                                                <td className='pt-2 text-center' key={column.key}>{item[column.key]}
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
                                                            } else if (key === 'export') {
                                                                exportServerData(item);
                                                            } else if (key === 'edit') {
                                                                openModal(item); // Pass the item being edited to openModal
                                                            }
                                                        }}
                                                    >
                                                        <DropdownItem key="export">Export</DropdownItem>
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
                    </AccordionItem>
                    <AccordionItem key="2" aria-label="Accordion 1" title="Add Server (Expand)">
                        <ServerForm onSubmit={handleInsert} />
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Modal for editing */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalContent>
                    <ModalHeader>Edit Item</ModalHeader>
                    <ModalBody>
    {editingItem && ( // Check if editingItem is not null
        <Textarea
            label="Edit JSON"
            placeholder="Start Editing the JSON"
            className="max-w-full"
            value={JSON.stringify(editingItem, null, 2)} // JSONify the item being edited
            onChange={handleTextareaChange} // Add onChange handler
        />
    )}
</ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={() => { handleSaveChanges(); onClose(); }}>Save Changes</Button>
    <Button color="secondary" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </main>
    );
};

export default ProtectedPage;
