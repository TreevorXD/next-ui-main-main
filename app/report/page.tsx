// pages/form.tsx
'use client'// Corrected to use strict
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

interface FormData {
  key: string;
  discordName: string;
  realmCode: string;
  discordInvite: string;
  realmId: string;
  discordServerId: string;
  discordOwnerId: string;
  xboxTag: string;
  discordTag: string;
  link: string;
  p2wId: string;
  dangerous: string;
}

export default function FormPage() {
  const user = useAuth();
  const [formData, setFormData] = useState<FormData>({
    key: "",
    discordName: "",
    realmCode: "",
    discordInvite: "",
    realmId: "",
    discordServerId: "",
    discordOwnerId: "",
    xboxTag: "",
    discordTag: "",
    link: "",
    p2wId: "",
    dangerous: "false",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
  };

  if (!user) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div>SOON...</div>
    </div>
  );
}
