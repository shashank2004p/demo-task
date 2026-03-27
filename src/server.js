require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { connectDb } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { sendResponse } = require("./utils/apiResponse");

async function main() {
  const app = express();


  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  app.use(express.json({ limit: "1mb" }));
  // Some frontends send JSON with Content-Type: text/plain; accept it safely.
  app.use(express.text({ type: ["text/plain", "text/*"], limit: "1mb" }));
  app.use((req, _res, next) => {
    if (typeof req.body === "string") {
      const s = req.body.trim();
      if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"))) {
        try {
          req.body = JSON.parse(s);
        } catch {
          // Keep as string; validation will fail with a clear message.
        }
      }
    }
    next();
  });
  app.use(express.urlencoded({ extended: true })); // In case frontend sends form data
  app.use(morgan("dev"));

  app.get("/", (req, res) => sendResponse(res, { status: 200, message: "OK", data: [] }));

  // Routes match Postman collection paths (no prefix)
  app.use(userRoutes);
  app.use(taskRoutes);

  // Express v5 doesn't accept "*" here; use a plain middleware catch-all instead.
  app.use(notFound);
  app.use(errorHandler);

  const port = Number(process.env.PORT) || 5000;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("Missing MONGODB_URI in .env");
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

  await connectDb(mongoUri);
  app.listen(port, () => console.log(`API listening on :${port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

