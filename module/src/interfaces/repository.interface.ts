import { IDBMember } from "../repository/mongo/models/member.model.js";
import { IDBModule } from "../repository/mongo/models/module.model.js";
import { IDBTask } from "../repository/mongo/models/task.model.js";
import { IMember, IModule, ITask } from "./entity.interface.js";

export type IModuleRepository = {
    add: (data: IModule) => Promise<IDBModule>;
    edit: (data: { id: string; moduleData: IModule }) => Promise<boolean>;
    delete: (id: string) => Promise<boolean>;
    getAll: (data: {
        projectId: string;
        parentModule?: string;
    }) => Promise<IDBModule[]>;
    getById: (moduleId: string) => Promise<IDBModule>;
    getModuleList: (data: { projectId: string }) => Promise<IDBModule[]>;
};

export type ITaskRepository = {
    add: (data: ITask) => Promise<IDBTask>;
    edit: (data: { taskId: string; taskData: ITask }) => Promise<boolean>;
    changeStatus: (data: {
        taskId: string;
        status: string;
    }) => Promise<boolean>;
    deleteById: (taskId: string) => Promise<boolean>;
    getAll: (data: { projectId: string }) => Promise<IDBTask[]>;
    getById: (id: string) => Promise<IDBTask>;
    changeAssignee: (data: {
        taskId: string;
        assignee: string;
    }) => Promise<boolean>;
};

export type IMemberRepository = {
    add: (data: IMember) => Promise<IDBMember | null>;
    upsert: (data: IMember) => Promise<IDBMember | null>;
    getByUsername: (username: string) => Promise<IDBMember | null>;
    getByEmail: (email: string) => Promise<IDBMember | null>;
    getById: (id: string) => Promise<IDBMember | null>;
    editUser: (data: {
        avatar?: string;
        username: string;
        name: string;
    }) => Promise<boolean>;
};
