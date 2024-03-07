// components/ContactForm.js
import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import ReCAPTCHA from 'react-google-recaptcha';

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
  const [recaptchaValue, setRecaptchaValue] = useState(null);

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

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const isFormValid = () => {
    const requiredFields = ['server_name', 'realm_id', 'discord_server_id', 'discord_owner_id', 'contact'];
    return requiredFields.every((field) => formData[field].trim() !== '') && recaptchaValue !== null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      // Implement your webhook submission logic here
      console.log('Form submitted:', formData);
    } else {
      alert('Please fill in all required fields and complete the reCAPTCHA.');
    }
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
            <ReCAPTCHA
              sitekey="6Le2F5EpAAAAAGdZTGSNBtab10heviiNmKGDFmXW"
              onChange={(value) => handleRecaptchaChange(value)}
            />
          </div>
        )}

        {/* Repeat the above pattern for other pages */}

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
