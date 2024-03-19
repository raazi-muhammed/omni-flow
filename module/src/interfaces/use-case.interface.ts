import { IDBModule } from "../repository/mongo/models/module.model.js";
import { IModule } from "./entity.interface.js";

export type IModuleUseCases = {
    addModule: (data: IModule) => Promise<IDBModule>;
    getModules: (data: {
        projectId: string;
        parentModule?: string;
    }) => Promise<IDBModule[]>;
    getModule: (data: { moduleId: string }) => Promise<IDBModule>;
    getModuleList: (data: { projectId: string }) => Promise<IDBModule[]>;
};
