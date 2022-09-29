import mongoose from "mongoose";
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: {type: String},
  password: {type: String},
});

export const User = mongoose.model('users', userSchema);

export const connect = async () => {
    await mongoose.connect('mongodb://localhost:27017/eccomerce');
  };