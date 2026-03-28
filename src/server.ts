import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

// import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth", authRoutes);

await connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`💻 Server running on port: http://localhost:${PORT}`);
  });
});

//   app.listen(PORT, () => {
//     console.log(`Server running on port 💻: http://localhost:${PORT}`);
//   });

export default app;