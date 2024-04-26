'use client'
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/config'; // Import your Firebase configuration

// Array of allowed UIDs
const allowedUids = ['AohsbxeW2pWIsAfTiCQAtJKga3k2', '4JNPKmw9cjQDKVbMjP5ceJpmxO82']; // Add other UIDs as needed

const ProtectedPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://corsproxy.io/?https://antip2w.com/api/database/realms/all", {
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
        // Check if the user's UID is in the allowed UIDs array
        if (!allowedUids.includes(authUser.uid)) {
          // Redirect to a page indicating no permission
          window.location.href = '/'; // Replace with your no-permission page route
        } else {
          // User is signed in and has the correct UID.
          setUser(authUser);
        }
      } else {
        // No user is signed in. Redirect to the login page or show an error message.
        // For simplicity, this example redirects to the login page.
        window.location.href = '/sign-in'; // Replace with your login page route.
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!user) {
    // You can show a loading spinner or any other loading indicator here.
    return <div>Loading...</div>;
  }

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
      key: "_id",
      label: "_id",
    },
    // Add other columns as needed
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
      <div className="w-full flex justify-center items-center flex-col">
        <h1 className='pb-3'>Welcome, {user.uid}!</h1>

        {/* Database Table */}
        <input
          placeholder="Search Anything"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterItems(rows, searchTerm).map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key}>{item[column.key]}</td>
                  ))}
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
