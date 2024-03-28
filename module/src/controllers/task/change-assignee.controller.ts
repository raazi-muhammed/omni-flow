import {
    BadRequestError,
    IRequest,
    ResponseCreator,
    validateBody,
} from "@omniflow/common";
import { ITaskUseCases } from "../../interfaces/use-case.interface.js";

export default function buildChangeTaskAssigneeController({
    taskUseCases,
}: {
    taskUseCases: ITaskUseCases;
}) {
    return async (req: IRequest) => {
        const taskId = req.params.taskId;
        if (!taskId) throw new BadRequestError("Task id not found");

        const data = req.body;
        validateBody(data, ["assignee"]);

        await taskUseCases.changeTaskAssignee({
            taskId,
            assignee: data.assignee,
        });

        const response = new ResponseCreator();
        return response.setMessage("Task edited").setStatusCode(204);
    };
}
