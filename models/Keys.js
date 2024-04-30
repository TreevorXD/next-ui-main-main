import * as Mongoose from "mongoose";

const keySchema = new Mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
});

const KeyModel = Mongoose.models.keys || Mongoose.model("keys", keySchema);

export default KeyModel;
