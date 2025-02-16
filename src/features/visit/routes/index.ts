import { Router } from 'express';
import { createVisitController, getVisitController } from '../controllers';
import { AuthMiddleware } from '../../../middlewares/AuthMiddleware';

export const visitRoutes = Router();

visitRoutes.get("/", AuthMiddleware, getVisitController);
visitRoutes.post("/", createVisitController);