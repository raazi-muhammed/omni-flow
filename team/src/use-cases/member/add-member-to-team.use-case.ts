import { Types } from "mongoose";
import { InviteStatus, Role } from "../../interfaces/entity.interface.js";
import {
    IMemberStatusRepository,
    ITeamRepository,
} from "../../interfaces/repository.interface.js";
import { ConflictError } from "@omniflow/common";

export default function buildAddMemberToTeamUseCase({
    teamRepository,
    memberStatusRepository,
}: {
    teamRepository: ITeamRepository;
    memberStatusRepository: IMemberStatusRepository;
}) {
    return async ({
        memberId,
        teamName,
        projectId,
    }: {
        memberId: string;
        teamName: string;
        projectId: string;
    }) => {
        const team = await teamRepository.getTeam({ projectId, teamName });

        const member = await memberStatusRepository.getMemberFromTeam({
            projectId,
            teamId: team.id,
            memberId,
        });
        if (member) throw new ConflictError("Member already exists on team");

        await memberStatusRepository.addMember({
            role: Role.DEFAULT,
            deletedAt: null,
            team: team.id,
            project: projectId,
            inviteStatus: InviteStatus.ACCEPTED,
            info: new Types.ObjectId(memberId),
        });
    };
}
