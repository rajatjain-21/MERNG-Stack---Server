const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGODB } = require("./config");

const typeDefs = require("./graphql/Schema");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({ typeDefs, resolvers });
mongoose
  .connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log(`🚀 Server running at port ${res.url}`);
  });
