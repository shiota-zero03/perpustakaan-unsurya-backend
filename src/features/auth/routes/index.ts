import { Router } from 'express';
import { forgotPassword, loginUser, logoutUser, refreshTokenUser, registerUser, resetPassword } from '../controllers';
import { AuthMiddleware } from '../../../middlewares/AuthMiddleware';

export const authRoutes = Router();

authRoutes.post("/sign-up", registerUser);
authRoutes.post("/sign-in", loginUser);
authRoutes.post("/refresh-token", refreshTokenUser);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/sign-out", AuthMiddleware, logoutUser);