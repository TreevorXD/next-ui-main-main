import * as Mongoose from "mongoose";

const archiveSchema = new Mongoose.Schema({
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
        type: String,
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
        type: String,
        required: false,
    },
    link: {
        type: String,
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

const ArchiveModel = Mongoose.models.archive || Mongoose.model("archive", archiveSchema);

export default ArchiveModel;
