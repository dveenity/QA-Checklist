const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: "Project Manager",
    },
  },
  { timestamps: true }
);

// Static sign up method and hashing password
UsersSchema.statics.signup = async function (
  name,
  email,
  password,
  role,
  approved
) {
  // validation
  if (!name || !email || !password) {
    throw Error("All Fields must be filled");
  } else if (password.length < 3) {
    throw Error("password too short");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hash,
    role,
    approved,
  });

  return user;
};

//static login method
UsersSchema.statics.login = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All Fields must be filled");
  }

  // check is user exists
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("User does not exist");
  }

  // check approved status
  if (!user.approved) {
    throw Error("Account not approved yet, check back later");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

// Create Mongoose model dynamically based on role
const UsersModel = mongoose.model("User", UsersSchema);
module.exports = UsersModel;
