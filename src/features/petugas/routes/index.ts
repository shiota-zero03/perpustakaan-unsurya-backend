import { Router } from 'express';
import { ActionSelected, DeletedPetugas, getAllPetugas, getDetailPetugas, StorePetugas, UpdatePetugas, DataExportPetugas } from '../controllers';
import { AuthMiddleware } from '../../../middlewares/AuthMiddleware';

export const petugasRoutes = Router();


petugasRoutes.get("/", AuthMiddleware, getAllPetugas);
petugasRoutes.get("/:userId", AuthMiddleware, getDetailPetugas);
petugasRoutes.post("/store", AuthMiddleware, StorePetugas);
petugasRoutes.put("/update/:userId", AuthMiddleware, UpdatePetugas);
petugasRoutes.delete("/:userId", AuthMiddleware, DeletedPetugas);
petugasRoutes.post("/action-selected", AuthMiddleware, ActionSelected);
petugasRoutes.get("/data/export", AuthMiddleware, DataExportPetugas);