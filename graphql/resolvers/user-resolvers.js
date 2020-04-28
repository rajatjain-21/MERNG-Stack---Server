const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET_KEY } = require("../../config");
const { validateRegisterInput } = require("../../utils/validators");
const { validateLoginInput } = require("../../utils/validators");

const generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userName: user.userName
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};
module.exports = {
  Mutation: {
    register: async (
      _,
      { registerInput: { userName, email, password, confirmPassword } }
    ) => {
      const { valid, errors } = validateRegisterInput(
        userName,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ userName });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            userName: "This username is taken"
          }
        });
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        userName,
        password,
        email,
        confirmPassword,
        createdAt: new Date().toISOString()
      });
      const result = await newUser.save();
      const token = generateToken(result);
      return {
        ...result._doc,
        id: result._id,
        token
      };
    },
    login: async (_, { userName, password }) => {
      const { valid, errors } = validateLoginInput(userName, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ userName });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("Wrong credentials", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Credentials not correct";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token
      };
    }
  }
};
