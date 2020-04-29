const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError, UserInputError } = require("apollo-server");

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
    },
    createComment: async (_, { postId, body }, context) => {
      try {
        const user = checkAuth(context);
        if (body.trim == "") {
          throw new UserInputError("Comment body must not be empty", {
            errors: {
              body: "Comment body must not be empty"
            }
          });
        }
        const post = await Post.findById(postId);
        if (post) {
          const newComment = {
            body,
            userName: user.userName,
            createdAt: new Date().toDateString()
          };
          post.comments.unshift(newComment);
          await post.save();
          return post;
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      try {
        const user = checkAuth(context);
        const post = await Post.findById(postId);
        if (post) {
          const commentIndex = post.comments.findIndex(c => c.id === commentId);
          if (
            commentIndex != -1 &&
            post.comments[commentIndex].userName === user.userName
          ) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return post;
          } else {
            new AuthenticationError("Action not allowed");
          }
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    likePost: async (_, { postId }, context) => {
      try {
        const user = checkAuth(context);
        const post = await Post.findById(postId);
        if (post) {
          if (post.likes.find(like => like.userName === user.userName)) {
            // Post has been liked by this user already
            post.likes = post.likes.filter(
              like => like.userName !== user.userName
            );
          } else {
            post.likes.push({
              userName: user.userName,
              createdAt: new Date().toISOString()
            });
          }
          await post.save();
          return post;
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
