import { NextResponse } from "next/server";
import connect from "../../../../../db";
import Server from "../../../../../models/Servers";

export const GET = async (request) => {
    try {
        await connect();
        const servers = await Server.find();
        return new NextResponse(JSON.stringify(servers), {status: 200});
    } catch(error) {
        return new NextResponse("error in fetching posts" + error, {status: 500});
    }
}