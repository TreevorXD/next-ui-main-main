'use client'
import { useEffect, useState } from 'react';

import ContactForm from '../components/contactForm';
import { auth } from '../firebase/config'; // Import your Firebase configuration
import { useRouter } from 'next/navigation';
import { config } from 'dotenv';
config();
const Home = () => {
  const [user, setUser] = useState(null);
    const router = useRouter()

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);

      if (!authUser) {
        // If user is not signed in, redirect to the sign-in page
        router.push('/sign-up'); // Change '/signin' to your actual sign-in page route
      }
    });

    return () => {
      unsubscribe();
    };
  }); // Add history to the dependency array

  // You can still show a loading spinner or any other loading indicator here.
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ContactForm />
    </div>
  );
};

export default Home;
