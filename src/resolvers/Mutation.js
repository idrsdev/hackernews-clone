const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function post(parent, args, context, info) {
  const { userId } = context;
  console.log(userId);

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function updateLink(parent, args, context, info) {
  const link = context.prisma.link.update({
    where: { id: Number(args.id) },
    data: {
      description: args.description || undefined,
      url: args.url || undefined,
    },
  });
  return link;
}

async function deleteLink(parent, args, context, info) {
  const link = await context.prisma.link
    .delete({
      where: { id: Number(args.id) },
    })
    .catch((e) => console.log(e.meta.cause));
  return link;
}

module.exports = {
  login,
  signup,
  post,
  updateLink,
  deleteLink,
};
