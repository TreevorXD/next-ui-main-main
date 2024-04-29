// ServerForm.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  discord_name: string;
  realm_id: string;
  realm_code: string;
  discord_server_id: string;
  discord_invite: string;
  xbox_tag: string;
  discord_owner_id: string;
  image_proof: string;
  link: string;
  dangerous: boolean;
  p2w_id: string;
  key: string;
}

interface Props {
  onSubmit: (formData: FormData) => void;
}

const ServerForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    discord_name: "",
    realm_id: "",
    realm_code: "",
    discord_server_id: "",
    discord_invite: "",
    xbox_tag: "",
    discord_owner_id: "",
    image_proof: "",
    link: "",
    dangerous: false,
    p2w_id: "",
    key: "",
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} >
      {Object.entries(formData).map(([key, value]) => (
        <div className="mb-4" key={key}>
          <input
            className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name={key}
            value={value}
            onChange={handleChange}
            placeholder={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </form>
  );
};

export default ServerForm;
