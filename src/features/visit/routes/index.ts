import { Router } from 'express';
import { createVisitController } from '../controllers';

export const visitRoutes = Router();

visitRoutes.post("/", createVisitController);