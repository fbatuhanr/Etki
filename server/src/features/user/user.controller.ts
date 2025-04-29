import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import { LoginResponseProps } from "../../types/User.types";
import ms, { StringValue } from "ms";
import { CustomRequest } from "../../middleware/authMiddleware";

async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result: LoginResponseProps | false = await userService.login(req.body);
    if (!result) {
      res.status(404).json({ message: 'Invalid username or password!' })
      return;
    }
    if (!result.refreshToken || !result.accessToken) {
      res.status(500).json({ message: 'Unexpected error occurred.' });
      return;
    }

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // its true when production and its false development mode
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict", // its none when we made production because its based on different domains, but in development its strict because localhost wants that
      maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION! as StringValue)
    });

    res.status(200).json({ message: 'Login successful!', accessToken: result.accessToken });

  } catch (error) {
    next(error)
  }
}
async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.logout();
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}
async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log(req.body);
    const isSignedUp = await userService.signup(req.body);
    if (isSignedUp) {
      res.status(201).json({ message: 'Signup successful!' });
    } else {
      res.status(500).json({ message: 'Signup failed!' });
    }
  } catch (error) {
    next(error)
  }
}

async function get(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user || req.user.userId !== req.params.id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    res.json(await userService.get(req.params.id));
  } catch (error) {
    next(error)
  }
}
async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updatedUser = await userService.update(req.params.id, req.body)
    if (!updatedUser) {
      res.status(404).json({ message: 'An error occurred during profile update!' });
      return;
    }
    res.status(201).json({ message: 'Profile successfully updated!' })
  } catch (error) {
    next(error);
  }
}

export {
  login, logout, signup,
  get, update
};