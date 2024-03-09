// pages/signout.tsx
'use client'
import { useEffect } from 'react';
import { auth } from '../firebase/config'; // Import your Firebase configuration

const SignOut = () => {
  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await auth.signOut();
        console.log('Signed Out');
        // Redirect to the desired page after successful sign out (e.g., home page).
        window.location.href = '/dashboard'; // Replace with your desired destination.
      } catch (error) {
        console.error('Sign Out Error', error);
        // Handle sign out error, e.g., show an error message.
      }
    };

    // Call the function to sign out when the component mounts.
    handleSignOut();
  }, []);

  return (
    <div>
      {/* You can display a loading spinner or any other indicator here. */}
      Signing out...
    </div>
  );
};

export default SignOut;
