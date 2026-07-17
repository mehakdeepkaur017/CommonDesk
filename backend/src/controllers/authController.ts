import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";

const setCookies = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const registerOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, workspace, accessToken, refreshToken } = await authService.registerOrg(req.body);
    setCookies(res, refreshToken);
    res.status(201).json({ user, workspace, accessToken });
  } catch (error) {
    next(error);
  }
};

export const joinOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, joinRequest, accessToken, refreshToken } = await authService.joinOrg(req.body);
    setCookies(res, refreshToken);
    res.status(201).json({ user, joinRequest, accessToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setCookies(res, refreshToken);
    res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
    setCookies(res, newRefreshToken);
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe((req as any).user.userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { name } = req.body;
    const user = await authService.updateProfile(userId, { name });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const user = await authService.updateAvatar(userId, avatarUrl);
    res.status(200).json({ user, avatarUrl });
  } catch (error) {
    next(error);
  }
};

export const getJoinStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await authService.getJoinStatus((req as any).user.userId);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};
