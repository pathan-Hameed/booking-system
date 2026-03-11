import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import routes from "./routes/index.routes.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { sanitizeRequest } from "./middlewares/sanitize.js";

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: env.CORS_ORIGIN.length ? env.CORS_ORIGIN : true,
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// basic sanitization (blocks $ operators etc.)
app.use(sanitizeRequest);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;