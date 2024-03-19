import {
    IModuleController,
    ITaskController,
} from "../interfaces/controller.interface.js";
import buildAddModuleController from "./module/add-module.controller.js";
import buildGetModulesController from "./module/get-modules.controller.js";
import { moduleUseCases, taskUseCases } from "../use-cases/index.js";
import buildGetModuleListController from "./module/get-module-list.controller.js";
import buildGetModuleController from "./module/get-module.controller.js";
import buildAddTaskController from "./task/add-task.controller.js";
import buildGetTasksController from "./task/get-tasks.controller.js";

const addModule = buildAddModuleController({ moduleUseCases });
const getModules = buildGetModulesController({ moduleUseCases });
const getModuleList = buildGetModuleListController({ moduleUseCases });
const getModule = buildGetModuleController({ moduleUseCases });

const addTask = buildAddTaskController({ taskUseCases });

const getTasks = buildGetTasksController({ taskUseCases });

export const moduleController: IModuleController = Object.freeze({
    addModule,
    getModules,
    getModuleList,
    getModule,
});

export const taskController: ITaskController = Object.freeze({
    addTask,
    getTasks,
});
