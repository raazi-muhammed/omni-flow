import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { ErrorHandlingMiddleware, loadEnv } from "@omniflow/common";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

const { SERVER_NAME, CORS_ORIGINS, NODE_ENV, PORT } = loadEnv([
    "PORT",
    "SERVER_NAME",
    "CORS_ORIGINS",
    "NODE_ENV",
    "ACCESS_TOKEN_SECRET",
]);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        origin: CORS_ORIGINS,
        credentials: true,
    })
);

if (NODE_ENV === "production") {
    app.use(morgan("dev"));
}

// app.use("/api/user", authRoutes);

app.all("*", (req, res) => {
    console.log(`@${SERVER_NAME}`, req.method, req.originalUrl);
    res.status(404).json({
        message: `Reached ${SERVER_NAME} service`,
    });
});

app.use(ErrorHandlingMiddleware);

export default app;
