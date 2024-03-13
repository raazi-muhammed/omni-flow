import { IRequest, ResponseCreator, validateBody } from "@omniflow/common";
import { IEndpointResponse } from "../interfaces/entity.interface.js";
import { IEndpointsRepository } from "../interfaces/repository.interface.js";

export default function buildAddEndpointResponse({
    endPointsRepository,
}: {
    endPointsRepository: IEndpointsRepository;
}) {
    return async (req: IRequest) => {
        const endpointId = req.params.id;
        const inputData = req.body;
        validateBody(inputData, ["statusCode"]);

        const requestToAdd: IEndpointResponse = {
            endpointId,
            statusCode: Number(inputData.statusCode),
            description: inputData?.description,
            body: inputData?.body,
        };

        await endPointsRepository.addEndpointResponse(requestToAdd);

        const response = new ResponseCreator();
        return response;
    };
}
