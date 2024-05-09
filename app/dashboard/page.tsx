
'use client'
import React, { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, Textarea, DropdownItem, Accordion, AccordionItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import ServerForm from '../components/ServerForm';
import { auth } from '../firebase/config';
import DashboardTable from '../components/DashboardTable';

const allowedUids = ['AohsbxeW2pWIsAfTiCQAtJKga3k2', '4JNPKmw9cjQDKVbMjP5ceJpmxO82'];

const ProtectedPage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalSize, setModalSize] = useState("2xl");
    const [editingItem, setEditingItem] = useState(null);
    const [isValidJSON, setIsValidJSON] = useState(true); // State to track JSON validity
    const [editedItem, setEditedItem] = useState(null); // State to track changes made by the user

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
            // Check if editedItem is valid JSON
            if (!isValidJSON) {
                throw new Error("Invalid JSON format");
            }

            // Update the editingItem state only when submit button is clicked
            setEditingItem(JSON.parse(editedItem));

            const response = await fetch(`../api/edit/${editingItem._id}`, {
                method: 'POST',
                headers: {
                    Authorization: 'BozRgu8UEY', // Replace with your actual authorization token
                    'Content-Type': 'application/json',
                },
                body: editedItem // Send the edited JSON data
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
        // Update the editedItem state with the modified JSON content
        const jsonString = e.target.value;
        setEditedItem(jsonString); // Update editedItem state
        // Validate JSON format
        try {
            JSON.parse(jsonString);
            setIsValidJSON(true);
        } catch (error) {
            setIsValidJSON(false);
        }
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
        setEditedItem(null); // Reset editedItem state
        onOpen();
    };

    return (
        <main className="montserrat">
            <div className="w-full justify-center items-center flex-col">
                <h1 className='pb-3'>Welcome{user ? user.email : 'Guest'}</h1>

                <Accordion>
                    <AccordionItem key="1" aria-label="Accordion 1" title="Server List (Expand)">

                            <DashboardTable />

                                    
                        
                        {/* End of Database Table */}
                    </AccordionItem>

                </Accordion>
            </div>

            {/* Modal for editing */}
        </main>
    );
};

export default ProtectedPage;
