const postsResolvers = require("./post-resolvers");
const userResolvers = require("./user-resolvers");

module.exports = {
  Post: {
    likeCount: parent => parent.likes.length,
    commentCount: parent => parent.comments.length
  },
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation
  }
};
