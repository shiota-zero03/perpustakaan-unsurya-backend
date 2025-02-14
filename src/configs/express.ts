// src/config/express.ts

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import path from "path";
import { publicRoutes } from "../routes/public";
import { apiRoutes } from "../routes/api";

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' })); // Ganti '20mb' sesuai kebutuhan
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(express.json({ limit: '20mb' }))

// Define Routes
app.use('/', publicRoutes);
app.use('/api/', apiRoutes);

const uploadDir = path.join(__dirname, "../uploads");
app.use("/assets", express.static(uploadDir));
export default app;
