import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  DB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
});

const env = envSchema.parse(process.env);

const config = {
  port: env.PORT,
  db_uri: env.DB_URI,
  databaseUrl: env.DATABASE_URL,
  jwt_access: env.JWT_ACCESS_SECRET,
  jwt_refresh: env.JWT_REFRESH_SECRET,
};

export default config;
