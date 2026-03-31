import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// ✅ MUST BE FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Start server
await connectDB();

app.listen(PORT, () => {
  console.log(`💻 Server running on http://localhost:${PORT}`);
});