// components/ContactForm.js
import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { config } from 'dotenv';
config();
const ContactForm = () => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    server_name: '',
    realm_id: '',
    discord_server_id: '',
    discord_owner_id: '',
    xbox_tag: '',
    discord_tag: '',
    proof_links: [''],
    website_link: '',
    contact: '',
    discord_invite: '',
  });


  const handleChange = (name, event) => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProofLinkChange = (index, event) => {
    const newProofLinks = [...formData.proof_links];
    newProofLinks[index] = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      proof_links: newProofLinks,
    }));
  };

  const handleAddProofLink = () => {
    if (formData.proof_links.length < 5) {
      setFormData((prevData) => ({
        ...prevData,
        proof_links: [...prevData.proof_links, ''],
      }));
    }
  };

  const handleRemoveProofLink = (index) => {
    const newProofLinks = [...formData.proof_links];
    newProofLinks.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      proof_links: newProofLinks,
    }));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const isFormValid = () => {
    const requiredFields = ['server_name', 'realm_id', 'discord_server_id', 'discord_owner_id', 'contact'];
    return requiredFields.every((field) => formData[field].trim() !== '');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isFormValid()) {
      const webhookUrl = process.env.WEBHOOK; // Replace with your actual environment variable name
      
      const payload = {
        _id: { $oid: generateRandomString() },
        key: { $numberInt: "1" },
        discord_name: "",
        realm_code: "",
        discord_invite: formData.discord_invite,
        realm_id: formData.realm_id,
        discord_server_id: formData.discord_server_id,
        discord_owner_id: formData.discord_owner_id,
        xbox_tag: formData.xbox_tag,
        discord_tag: formData.discord_tag,
        image_proof: formData.proof_links.map((link) => ({ $oid: link })),
        link: formData.website_link,
        contact: formData.contact,
        p2w_id: "",
        dangerous: false,
      };
  
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          console.log('Form submitted successfully:', formData);
        } else {
          console.error('Failed to submit form:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error while submitting form:', error);
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };
  
  // Function to generate a random string (replace with your actual implementation)
  const generateRandomString = () => {
    return Math.random().toString(36).substring(7);
  };
  

  return (
    
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        {page === 1 && (
          <div className="form-page">
            <Input
              isRequired
              type="text"
              label="Server Name"
              value={formData.server_name}
              onChange={(event) => handleChange('server_name', event)}
            />
            <Input
              type="text"
              label="Realm ID"
              value={formData.realm_id}
              onChange={(event) => handleChange('realm_id', event)}
            />
            
          </div>
          
        )}

        {page === 2 && (
          <div className="form-page">
            <Input
              isRequired
              type="text"
              label="Discord Server ID"
              value={formData.discord_server_id}
              onChange={(event) => handleChange('discord_server_id', event)}
            />
            <Input
              isRequired
              type="text"
              label="Discord Owner ID"
              value={formData.discord_owner_id}
              onChange={(event) => handleChange('discord_owner_id', event)}
            />
          </div>
        )}

        {page === 3 && (
          <div className="form-page">
            <Input
              type="text"
              label="Xbox Tag"
              value={formData.xbox_tag}
              onChange={(event) => handleChange('xbox_tag', event)}
            />
            <Input
              type="text"
              label="Discord Tag"
              value={formData.discord_tag}
              onChange={(event) => handleChange('discord_tag', event)}
            />
          </div>
        )}

        {page === 4 && (
          <div className="form-page">
            {formData.proof_links.map((link, index) => (
              <div key={index} className="proof-link-container">
                <Input
                  type="text"
                  label={`Proof Link ${index + 1}`}
                  value={link}
                  onChange={(event) => handleProofLinkChange(index, event)}
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveProofLink(index)}
                  className="remove-proof-link-button"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddProofLink}>
              Add Proof Link
            </Button>
          </div>
        )}

        {page === 5 && (
          <div className="form-page">
            <Input
              type="text"
              label="Website Link"
              value={formData.website_link}
              onChange={(event) => handleChange('website_link', event)}
            />
            <Input
              type="text"
              label="Contact"
              value={formData.contact}
              onChange={(event) => handleChange('contact', event)}
            />
            <Input
              type="text"
              label="Discord Invite"
              value={formData.discord_invite}
              onChange={(event) => handleChange('discord_invite', event)}
            />
          </div>
        )}

        <div className="form-navigation">
          {page > 1 && (
            <Button type="button" onClick={handlePrevPage}>
              Previous
            </Button>
          )}
          {page < 5 && (
            <Button type="button" onClick={handleNextPage}>
              Next
            </Button>
          )}
          {page === 5 && (
            <Button type="submit">
              Submit
            </Button>
          )}
        </div>
      </form>

      <style jsx>{`
        .form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .form {
          display: flex;
          flex-direction: column;
          width: 300px;
        }

        .form-page {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .proof-link-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .remove-proof-link-button {
          margin-top: 0;
          background-color: #ff5b5b;
          color: white;
        }

        button {
          margin-top: 10px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ContactForm;
