// pages/index.tsx
'use client'
import { useEffect, useState } from 'react';
import ContactForm from '../components/contactForm';
import { auth } from '../firebase/config'; // Import your Firebase configuration

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
        // Check if the user's UID matches the specific UID you want to allow.
        if (authUser.uid !== 'your-specific-uid') {
          // Redirect to another page or show an error message.
 
        }
      } else {
        // No user is signed in. Redirect to the login page or show an error message.
       
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
      <ContactForm />
    </div>
  );
};

export default Home;
