import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
const imageUrls = [
  "/placeholders/1.png",
  "/placeholders/2.png",
  "/placeholders/3.png",
  "/placeholders/4.png",
  "/placeholders/5.png",
  "/placeholders/6.png",
  "/placeholders/7.png",
];
export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, arg) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    const board = await ctx.db.insert("boards", {
      ...arg,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });
    return board;
  },
});
export const get = query({
  args: {
    orgId: v.string(),
    query: v.optional(
      v.object({
        search: v.optional(v.string()),
        isFavorite: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    let boards;
    const title = args.query?.search;
    if (title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) => {
          return q.search("title", title).eq("orgId", args.orgId);
        })
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))

        .order("desc")

        .collect();
    }

    const boardWithFavorite = boards.map(async (board) => {
      const favorite = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) => {
          return q.eq("userId", identity.subject).eq("boardId", board._id);
        })
        .unique();
      return {
        ...board,
        isFavorite: !!favorite,
      };
    });
    if (args.query?.isFavorite) {
      const filterBoard = (await Promise.all(boardWithFavorite)).filter(
        (board) => {
          return board.isFavorite === true;
        }
      );
      return filterBoard;
    }
    return Promise.all(boardWithFavorite);
  },
});
export const destroy = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    const existingBoardFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_board", (q) => {
        return q.eq("boardId", args.id);
      })
      .collect();
    existingBoardFavorite.forEach(async (existFavorite) => {
      await ctx.db.delete(existFavorite._id);
    });
  },
});
export const update = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    if (!title) {
      throw new Error("Title is required!");
    }
    if (title.length > 60) {
      throw new Error("Tittle cannot be longer than 60 characters");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });
    return board;
  },
});
export const favorite = mutation({
  args: {
    orgId: v.string(),
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.boardId);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;
    if (board.orgId !== args.orgId) {
      throw new Error("Org Id is invalid");
    }
    const existingBoardFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board_org", (q) => {
        return q
          .eq("userId", userId)
          .eq("boardId", board._id)
          .eq("orgId", args.orgId);
      })
      .unique();
    if (existingBoardFavorite) {
      throw new Error("Board already favorite!");
    }

    await ctx.db.insert("userFavorites", {
      boardId: board._id,
      orgId: args.orgId,
      userId,
    });
    return board;
  },
});
export const unfavorite = mutation({
  args: {
    orgId: v.string(),
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.boardId);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;
    if (board.orgId !== args.orgId) {
      throw new Error("Org Id is invalid");
    }
    const existingBoardFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board_org", (q) => {
        return q
          .eq("userId", userId)
          .eq("boardId", board._id)
          .eq("orgId", args.orgId);
      })
      .unique();
    if (!existingBoardFavorite) {
      throw new Error("Board no favorite!");
    }

    await ctx.db.delete(existingBoardFavorite._id);
    return board;
  },
});
