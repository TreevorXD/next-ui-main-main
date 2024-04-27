import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";

const InsertServerForm = ({ onInsert }) => {
    const [formData, setFormData] = useState({
        key: '',
        discord_name: '',
        realm_code: '',
        discord_invite: '',
        realm_id: '',
        discord_server_id: '',
        discord_owner_id: '',
        xbox_tag: '',
        discord_tag: '',
        link: '',
        p2w_id: '',
        dangerous: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onInsert(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Key"
                name="key"
                value={formData.key}
                onChange={handleChange}
            />
            <Input
                label="Discord Name"
                name="discord_name"
                value={formData.discord_name}
                onChange={handleChange}
            />
            {/* Add other input fields for remaining data */}
            <Button color="primary" variant="contained" type="submit">
                Insert Server
            </Button>
        </form>
    );
};

export default InsertServerForm;
