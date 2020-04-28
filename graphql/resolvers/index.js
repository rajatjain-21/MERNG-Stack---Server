const postsResolvers = require("./post-resolvers");
const userResolvers = require("./user-resolvers");

module.exports = {
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation
  }
};
