// route.ts
import ServerModel from "../../../../models/Servers"; // Import your Server model
import { dbConnect, disconnect } from "@/app/lib/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const con = await dbConnect();
  // Extract the id parameter from the params object
  const { id } = params;

  // Assuming you're using a database, you can perform a delete operation here
  // For example:
  await ServerModel.findByIdAndDelete(id);

  // Respond with a JSON object containing the id parameter
  return Response.json({ id });
}
