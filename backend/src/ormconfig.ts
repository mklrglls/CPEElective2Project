import path from "path";
import dotenv from 'dotenv';
import { DataSource } from "typeorm";

dotenv.config();

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "hospital",
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, "entities", "*.{ts,js}")],
});