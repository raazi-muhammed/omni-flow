import projectModel from "./models/project.model.js";
import memberModel from "./models/members.model.js";
import buildProjectRepository from "./project-list.repository.js";
import buildMemberRepository from "./member-list.repository.js";
import {
    IMemberRepository,
    IProjectRepository,
} from "../../interfaces/repository.interface.js";

export const projectRepository: IProjectRepository = buildProjectRepository({
    database: projectModel,
});

export const memberRepository: IMemberRepository = buildMemberRepository({
    database: memberModel,
});
