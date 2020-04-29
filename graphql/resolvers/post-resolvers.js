const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      try {
        const user = checkAuth(context);
        console.log(user);
        const newPost = new Post({
          body,
          user: user.id,
          userName: user.userName,
          createdAt: new Date().toDateString()
        });
        const post = await newPost.save();
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
    deletePost: async (_, { postId }, context) => {
      try {
        const user = checkAuth(context);
        console.log(user);
        const post = await Post.findById(postId);
        if (user.userName === post.userName) {
          await post.delete();
          return "Post deleted successfully!";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
