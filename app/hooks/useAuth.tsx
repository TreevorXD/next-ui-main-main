// useAuth.tsx
import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  return user;
}
