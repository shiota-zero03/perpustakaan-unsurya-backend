import { Router } from 'express';
import { ActionSelected, DeletedMahasiswa, getAllMahasiswa, getDetailMahasiswa, StoreMahasiswa, UpdateMahasiswa, SampleExportMahasiswa, DataExportMahasiswa, DataImportMahasiswa } from '../controllers';
import { AuthMiddleware } from '../../../middlewares/AuthMiddleware';

export const mahasiswaRoutes = Router();


mahasiswaRoutes.get("/", AuthMiddleware, getAllMahasiswa);
mahasiswaRoutes.get("/:userId", AuthMiddleware, getDetailMahasiswa);
mahasiswaRoutes.post("/store", AuthMiddleware, StoreMahasiswa);
mahasiswaRoutes.put("/update/:userId", AuthMiddleware, UpdateMahasiswa);
mahasiswaRoutes.delete("/:userId", AuthMiddleware, DeletedMahasiswa);
mahasiswaRoutes.post("/action-selected", AuthMiddleware, ActionSelected);
mahasiswaRoutes.get("/sample/export", AuthMiddleware, SampleExportMahasiswa);
mahasiswaRoutes.post("/data/import", AuthMiddleware, DataImportMahasiswa);
mahasiswaRoutes.get("/data/export", AuthMiddleware, DataExportMahasiswa);