import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisheYear: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Cat", bookSchema);

const signupSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  password: String,
});

export const Signup = mongoose.model("Signup", signupSchema);
