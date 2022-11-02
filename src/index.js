const { PrismaClient, Prisma } = require("@prisma/client");
const { ApolloServer } = require("apollo-server");
const path = require("path");
const fs = require("fs");

const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

const { loaders } = require("./dataLoaders");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: async ({ req }) => {
    return {
      ...req,
      prisma,
      loaders: await loaders(),
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
