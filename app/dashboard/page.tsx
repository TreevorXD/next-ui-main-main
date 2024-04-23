'use client'
import { useEffect, useState } from 'react';
import { auth } from '../firebase/config'; // Import your Firebase configuration

// Array of allowed UIDs
const allowedUids = ['AohsbxeW2pWIsAfTiCQAtJKga3k2', '4JNPKmw9cjQDKVbMjP5ceJpmxO82']; // Add other UIDs as needed

const ProtectedPage = () => {
  const [user, setUser] = useState(null);

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

  return (
    <div>
      {/* Content of the protected page */}
      <h1>Welcome, {user.uid}!</h1>
      {/* Add your protected page content here */}
    </div>
  );
};

export default ProtectedPage;
