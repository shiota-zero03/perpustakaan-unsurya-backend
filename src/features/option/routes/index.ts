import { Router } from 'express';
import { getOptionDepartment, getOptionFaculty } from '../controllers';

export const optionRoutes = Router();


optionRoutes.get("/faculty", getOptionFaculty);
optionRoutes.get("/department", getOptionDepartment);