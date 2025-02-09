import {
    IAccess,
    IMemberEntityConstructor,
    InviteStatus,
    Role,
} from "../../interfaces/entity.interface.js";
import {
    IMemberRepository,
    IProjectRepository,
} from "../../interfaces/repository.interface.js";

export default function buildAddMemberToProjectUseCase({
    projectRepository,
    memberRepository,
    MemberCreator,
}: {
    projectRepository: IProjectRepository;
    memberRepository: IMemberRepository;
    MemberCreator: IMemberEntityConstructor;
}) {
    return async ({
        userData,
        projectId,
    }: {
        userData: {
            username: string;
            avatar?: string;
            email: string;
            name: string;
            access: IAccess;
        };
        projectId: string;
    }) => {
        const member = new MemberCreator(userData);
        member.validate();
        const user = member.get();

        let userFound = await memberRepository.getByUsername(user.username);
        if (!userFound) userFound = await memberRepository.add(user);

        await projectRepository.addMember({
            projectId,
            member: {
                role: Role.DEFAULT,
                inviteStatus: InviteStatus.ACCEPTED,
                info: userFound.id,
                access: userData.access,
            },
        });
    };
}
