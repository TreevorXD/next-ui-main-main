// pages/form.tsx
'use client'
import { useState, FormEvent } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value
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
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        {Object.entries(formData).map(([key, value]) => (
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              key={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
      </form>
    </div>
  );
}
