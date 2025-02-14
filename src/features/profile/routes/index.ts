import { Router } from 'express';
import { getProfile } from '../controllers';
import { AuthMiddleware } from '../../../middlewares/AuthMiddleware';

export const profileRoutes = Router();

profileRoutes.get("/", AuthMiddleware, getProfile);