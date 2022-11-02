// Apollo server handles async tasks implicityle
// But async await can be used in case we need prev results
function feed(parent, args, context) {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {};
  const links = context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });

  const count = context.prisma.link.count({ where });
  return { links, count };
}

function link(parent, args, context) {
  const link = context.prisma.link.findUnique({ where: { id: args.id } });
  return link;
}

module.exports = {
  feed,
  link,
};
