import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import ms, { StringValue } from "ms";

async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.cookies; // get the refresh token from the cookies
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token not provided." });
      return;
    }
    const newTokens = await authService.refreshToken(refreshToken);
    if (newTokens) {
      res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // its true when production and its false development mode
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // its none when we made production because its based on different domains, but in development its strict because localhost wants that
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION! as StringValue),
      });
      res.status(200).json({ message: "Token refreshed successfully!", accessToken: newTokens.accessToken, });
    } else {
      res.status(403).json({ message: "Invalid refresh token." });
    }
  } catch (error) {
    next(error);
  }
}

export { refreshToken };