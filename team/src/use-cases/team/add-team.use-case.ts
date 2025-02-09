import {
    AnErrorOccurredError,
    BadRequestError,
    ConflictError,
} from "@omniflow/common";
import { ITeamEntityConstructor } from "../../interfaces/entity.interface.js";
import {
    IMemberRepository,
    ITeamRepository,
} from "../../interfaces/repository.interface.js";

export default function buildAddTeamUseCase({
    TeamEntity,
    teamRepository,
    memberRepository,
}: {
    TeamEntity: ITeamEntityConstructor;
    teamRepository: ITeamRepository;
    memberRepository: IMemberRepository;
}) {
    return async ({
        teamName,
        leadEmail,
        projectId,
    }: {
        teamName: string;
        leadEmail: string;
        projectId: string;
    }) => {
        const leadUser = await memberRepository.getByEmail(leadEmail);
        if (!leadUser) throw new BadRequestError("Lead not found");

        const foundTeam = await teamRepository.getTeam({
            projectId,
            teamName,
        });

        if (foundTeam) throw new ConflictError("Team name taken");

        const teamEntity = new TeamEntity({
            name: teamName,
            project: projectId,
            lead: leadUser.id,
        });

        const teamAdded = await teamRepository.add(teamEntity);
        if (!teamAdded) throw new AnErrorOccurredError();

        return teamAdded;
    };
}
