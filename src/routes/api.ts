import { Router } from 'express';
import { authRoutes } from '../features/auth/routes';
import { visitRoutes } from '../features/visit/routes';
import { profileRoutes } from '../features/profile/routes';
import { dosenRoutes } from '../features/dosen/routes';
import { mahasiswaRoutes } from '../features/mahasiswa/routes';

export const apiRoutes = Router();

apiRoutes.use("/auth/", authRoutes);
apiRoutes.use("/visitor/", visitRoutes);
apiRoutes.use("/profile/", profileRoutes);
apiRoutes.use("/dosen/", dosenRoutes);
apiRoutes.use("/mahasiswa/", mahasiswaRoutes);