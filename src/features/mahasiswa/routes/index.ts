import { Router } from 'express';
import { ActionSelected, DeletedDosen, getAllDosen, getDetailDosen, StoreDosen, UpdateDosen, SampleExportDosen, DataExportDosen, DataImportDosen } from '../controllers';
import { AuthMiddleware } from '../../../middlewares/AuthMiddleware';

export const mahasiswaRoutes = Router();


mahasiswaRoutes.get("/", AuthMiddleware, getAllDosen);
mahasiswaRoutes.get("/:userId", AuthMiddleware, getDetailDosen);
mahasiswaRoutes.post("/store", AuthMiddleware, StoreDosen);
mahasiswaRoutes.put("/update/:userId", AuthMiddleware, UpdateDosen);
mahasiswaRoutes.delete("/:userId", AuthMiddleware, DeletedDosen);
mahasiswaRoutes.post("/action-selected", AuthMiddleware, ActionSelected);
mahasiswaRoutes.get("/sample/export", AuthMiddleware, SampleExportDosen);
mahasiswaRoutes.post("/data/import", AuthMiddleware, DataImportDosen);
mahasiswaRoutes.get("/data/export", AuthMiddleware, DataExportDosen);