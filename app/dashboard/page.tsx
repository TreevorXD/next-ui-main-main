// pages/protected-page.tsx
'use client'
import { useEffect, useState } from 'react';
import { auth } from '../firebase/config'; // Import your Firebase configuration

const allowedUid = 'BAglnIBTEoT1mSC0I397LRllMm73'; // Replace with the UID you want to allow access

const ProtectedPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // Check if the user's UID matches the allowed UID
        if (authUser.uid !== allowedUid) {
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
