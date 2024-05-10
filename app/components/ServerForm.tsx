// ServerForm.tsx
import { useRouter } from 'next/navigation'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import {Input, Button} from "@nextui-org/react";
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

const ServerForm: React.FC<Props> = ({ onSubmit }) => {
  const router = useRouter()
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
    key: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Assuming you have a function to get the authorization token
      const response = await fetch("../api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "BozRgu8UEY"
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle success
        console.log("Server created successfully!");
        router.refresh()
      } else {
        // Handle error
        console.error("Failed to create server");
        router.refresh()
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        isRequired
        type="text"
        name="discord_name"
        label="Server Name"
        value={formData.discord_name}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        isRequired
        type="text"
        name="realm_id"
        label="Realm ID"
        value={formData.realm_id}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="text"
        name="realm_code"
        label="Realm Code"
        value={formData.realm_code}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="text"
        name="discord_server_id"
        label="Discord Server ID"
        value={formData.discord_server_id}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="text"
        name="discord_invite"
        label="Discord Invite"
        value={formData.discord_invite}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="text"
        name="xbox_tag"
        label="Xbox Tag"
        value={formData.xbox_tag}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="text"
        name="discord_owner_id"
        label="Discord Owner ID"
        value={formData.discord_owner_id}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="text"
        name="image_proof"
        label="Image Proof"
        value={formData.image_proof}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="text"
        name="link"
        label="Website"
        value={formData.link}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="checkbox"
        name="dangerous"
        label="Dangerous?"
        checked={formData.dangerous}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        type="text"
        name="p2w_id"
        label="P2W ID"
        value={formData.p2w_id}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Input
        isRequired
        type="text"
        name="key"
        label="Key"
        value={formData.key}
        onChange={handleInputChange}
        className="w-full pb-3"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};


export default ServerForm;
