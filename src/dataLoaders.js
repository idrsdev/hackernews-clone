const { PrismaClient } = require("@prisma/client");
const DataLoader = require("dataloader");

const prisma = new PrismaClient();

const findAuthorsBasedOnIds = async (ids) => {
  const authors = await prisma.user.findMany({
    where: {
      id: { in: ids },
    },
  });

  const lookup = authors.reduce((acc, collection) => {
    acc[collection.id.toString()] = collection;
    return acc;
  }, {});

  const response = ids.map((id) => (lookup[id] ? lookup[id] : null));
  return response;
};

const authorLoader = new DataLoader((ids) => findAuthorsBasedOnIds(ids));

const loaders = async () => {
  return {
    author: authorLoader,
  };
};

module.exports = {
  loaders,
};
