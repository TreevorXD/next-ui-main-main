import { NextResponse } from "next/server";
import connect from "../../../../../db";
import Post from "../../../../../models/Post";

export const GET = async (request) => {
    try {
        await connect();

        return new NextResponse("hello", {status: 200});
    } catch(error) {
        return new NextResponse("error in fetching posts" + error, {status: 500});
    }
}