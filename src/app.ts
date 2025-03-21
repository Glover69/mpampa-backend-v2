import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import utilsRoutes from "./routes/utils.routes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/utils", utilsRoutes);



const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));