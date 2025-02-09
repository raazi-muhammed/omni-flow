import {
    BadRequestError,
    IRequest,
    ResponseCreator,
    validateBody,
} from "@omniflow/common";
import { IMemberUseCases } from "../../interfaces/use-case.interface.js";

export default function buildAddMemberToTeamController({
    memberUseCases,
}: {
    memberUseCases: IMemberUseCases;
}) {
    return async (req: IRequest) => {
        const projectId = req.currentProject.id;
        const teamName = req.params.name;
        if (!teamName || typeof teamName !== "string") {
            throw new BadRequestError("Invalid member id");
        }
        const input = req.body;
        validateBody(input, ["memberId"]);

        await memberUseCases.addMemberToTeam({
            projectId,
            teamName,
            memberId: input.memberId,
        });

        const response = new ResponseCreator();
        return response.setMessage("Member added to team");
    };
}
