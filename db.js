import mongoose from 'mongoose'

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
        useNewURLParser: true,
        useUnifiedToplofy: true 
        });
        console.log("mongo connection successfull")
    } catch (error) {
        throw new Error("error to connect to mongodb")
    }
}

export default connect;