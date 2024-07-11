import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SECRET as string,
});

export async function POST(request: Request) {
  const authorization = auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }
  const { room } = await request.json();

  const board = await convex.query(api.boards.getOne, { id: room });

  if (board?.orgId !== authorization.orgId) {
    return new Response("Unauthorized", { status: 403 });
  }
  const userInfo = {
    name: user.firstName || "Anonymous",
    picture: user.imageUrl,
  };
  const session = liveblocks.prepareSession(
    user.id,
    { userInfo } // Optional
  );
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
