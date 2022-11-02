// function postedBy(parent, args, context) {
//   console.log("parentId: ", parent.postedById);
//   return context.prisma.link
//     .findUnique({ where: { id: parent.id } })
//     .postedBy();
// }

async function postedBy(parent, args, { loaders }) {
  return await loaders.author.load(parent.postedById);
}

module.exports = {
  postedBy,
};
