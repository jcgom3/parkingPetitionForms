import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize Redis Client
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

export default redisClient;
