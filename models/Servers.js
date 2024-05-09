import * as Mongoose from "mongoose";

const serverSchema = new Mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    discord_name: {
        type: String,
        required: true,
    },
    discord_invite: {
        type: String,
        required: false,
    },
    realm_id: {
        type: [String],
        required: false,
    },
    realm_code: {
        type: [String],
        required: false,
    },
    discord_server_id: {
        type: String,
        required: false,
    },
    discord_owner_id: {
        type: String,
        required: false,
    },
    xbox_tag: {
        type: String,
        required: false,
    },
    discord_tag: {
        type: String,
        required: false,
    },
    image_proof: {
        type: [String],
        required: false,
    },
    link: {
        type: [String],
        required: false,
    },
    contact: {
        type: String,
        required: false,
    },
    p2w_id: {
        type: String,
        required: false,
    },
    dangerous: {
        type: String,
        required: false,
    },
});

const ServerModel = Mongoose.models.servers || Mongoose.model("servers", serverSchema);

export default ServerModel;
