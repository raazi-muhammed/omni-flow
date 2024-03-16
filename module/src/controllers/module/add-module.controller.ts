import { IRequest, ResponseCreator, logger } from "@omniflow/common";
import { moduleRepository } from "../../repository/mongo/index.js";

export default function buildAddModuleController() {
    return async (req: IRequest) => {
        const { currentProject } = req;
        logger.debug(JSON.stringify(req.body));
        const data = req.body;

        await moduleRepository.add({ ...data, projectId: currentProject.id });

        const response = new ResponseCreator();
        return response.setMessage("Module created");
    };
}
