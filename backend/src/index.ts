import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// CORS must be here at the top, and match your frontend (3000)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Hospital Room Management Backend!");
});

// Working API route
app.get("/api/rooms", (req, res) => {
  res.json([
    { id: 1, roomNumber: "101", capacity: 2 },
    { id: 2, roomNumber: "102", capacity: 1 },
  ]);
});

// Database
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "hospital",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});

// Start server only after DB connects
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected!");
    app.listen(port, () => {
      console.log(`✅ Backend running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed", error);
  });
