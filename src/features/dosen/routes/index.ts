import { Router } from 'express';
import { ActionSelected, DeletedDosen, getAllDosen, getDetailDosen, StoreDosen, UpdateDosen, SampleExportDosen, DataExportDosen, DataImportDosen } from '../controllers';
import { AuthMiddleware } from '../../../middlewares/AuthMiddleware';

export const dosenRoutes = Router();


dosenRoutes.get("/", AuthMiddleware, getAllDosen);
dosenRoutes.get("/:userId", AuthMiddleware, getDetailDosen);
dosenRoutes.post("/store", AuthMiddleware, StoreDosen);
dosenRoutes.put("/update/:userId", AuthMiddleware, UpdateDosen);
dosenRoutes.delete("/:userId", AuthMiddleware, DeletedDosen);
dosenRoutes.post("/action-selected", AuthMiddleware, ActionSelected);
dosenRoutes.get("/sample/export", AuthMiddleware, SampleExportDosen);
dosenRoutes.post("/data/import", AuthMiddleware, DataImportDosen);
dosenRoutes.get("/data/export", AuthMiddleware, DataExportDosen);