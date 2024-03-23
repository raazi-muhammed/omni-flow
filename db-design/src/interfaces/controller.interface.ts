import { IRequest, ResponseCreator } from "@omniflow/common";

export type ITableController = {
    addTable: (req: IRequest) => Promise<ResponseCreator>;
    getTables: (req: IRequest) => Promise<ResponseCreator>;
    getTable: (req: IRequest) => Promise<ResponseCreator>;
    changeTablePosition: (req: IRequest) => Promise<ResponseCreator>;
    addTableField: (req: IRequest) => Promise<ResponseCreator>;
};

export type IRelationController = {
    addRelation: (req: IRequest) => Promise<ResponseCreator>;
};
