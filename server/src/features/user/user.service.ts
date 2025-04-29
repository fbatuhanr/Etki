import User from "./user.model";
// import FriendRequest from "../friendRequest/friendRequest.model";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../auth/auth.service";

type UserProps = {
  username: string;
  password: string;
  email: string | null;
};

async function login(data: UserProps) {
  const { username, password } = data;

  const user = await User.findOne({ username });
  if (!user) return false;
  if (!user.comparePassword(password)) return false;

  const accessToken = generateAccessToken({
    userId: user._id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id,
    username: user.username,
  });
  return { accessToken, refreshToken };
}
async function logout() {
  return;
}
async function signup(data: UserProps) {
  const newUser = new User(data);
  newUser.hashPassword = bcrypt.hashSync(data.password, 10);

  const savedUser = await newUser.save();

  /* admin automatically adds friends for each new user  */
  /* const adminUser = await User.findOne({ username: "admin" });
  if (adminUser) {
    const newFriendRequest = new FriendRequest({
      sender: savedUser._id,
      receiver: adminUser._id,
      status: "accepted",
    });
    await newFriendRequest.save();

    await User.updateOne(
      { _id: adminUser._id },
      { $addToSet: { friends: savedUser._id } }
    );
    await User.updateOne(
      { _id: savedUser._id },
      { $addToSet: { friends: adminUser._id } }
    );
  }
  */

  return savedUser ? true : false;
}

async function get(id: string) {
  return User.findById(id);
}
function update(id: string, data: UserProps) {
  return User.findOneAndUpdate({ _id: id }, data);
}

export { 
  login, logout, signup,
  get, update
};