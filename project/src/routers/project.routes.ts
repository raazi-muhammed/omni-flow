import { IVerifyUserMiddleware, makeCallback } from "@omniflow/common";
import { Router } from "express";
import { IProjectController } from "../interfaces/controller.interface.js";

export default function buildProjectRoute({
    router,
    verifyUserMiddleware,
    controllers,
}: {
    router: Router;
    verifyUserMiddleware: IVerifyUserMiddleware;
    controllers: IProjectController;
}) {
    router.post(
        "/add-project",
        verifyUserMiddleware,
        makeCallback(controllers.add)
    );
    router.get("/get-projects", makeCallback(controllers.getAll));
    router.get("/get-project/:id", makeCallback(controllers.getProject));
    return router;
}
