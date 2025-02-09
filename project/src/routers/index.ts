import express from "express";
const router = express.Router();
import projectControllers from "../controllers/index.js";
import buildProjectRoute from "./project.routes.js";
import {
    verifyUserMiddleware,
    verifyProjectMiddleware,
} from "@omniflow/common";

const projectRoutes = buildProjectRoute({
    router,
    verifyUserMiddleware: verifyUserMiddleware,
    verifyProjectMiddleware,
    controllers: projectControllers,
});

export default projectRoutes;
