import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { StringValue } from "ms";

interface UserTokenPayload {
  userId: string | mongoose.Types.ObjectId;
  username: string;
}

function generateAccessToken(user: UserTokenPayload): string {
  const id = user.userId instanceof mongoose.Types.ObjectId ? user.userId.toString() : user.userId;
  return jwt.sign({ userId: id, username: user.username }, process.env.ACCESS_TOKEN_SECRET! as StringValue, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION! as StringValue });
}

function generateRefreshToken(user: UserTokenPayload): string {
  const id = user.userId instanceof mongoose.Types.ObjectId ? user.userId.toString() : user.userId;
  return jwt.sign({ userId: id, username: user.username }, process.env.REFRESH_TOKEN_SECRET! as StringValue, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION! as StringValue });
}

async function refreshToken(refreshToken: string) {
  try {
    const decoded = jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET!) as UserTokenPayload;
    const newAccessToken = generateAccessToken({ userId: decoded.userId, username: decoded.username });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId, username: decoded.username });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.log("Error! May be expired: ", error);
    return false;
  }
}

export { generateAccessToken, generateRefreshToken, refreshToken };