import {
    CreateParams,
    CreateResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    UpdateParams
} from "react-admin";
import { BaseDataProvider } from "./base";
import {
    directionEndpointsCreateDirectionEnigmaV1DirectionPost,
    directionEndpointsDeleteDirectionEnigmaV1DirectionDirectionIdDelete,
    directionEndpointsGetDirectionEnigmaV1DirectionDirectionIdGet,
    directionEndpointsListDirectionsEnigmaV1DirectionGet,
    directionEndpointsUpdateDirectionEnigmaV1DirectionDirectionIdPut
} from "@/api/enigma/direction/direction";
import { DirectionCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export class DirectionsDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const res = await directionEndpointsListDirectionsEnigmaV1DirectionGet(
            {
                currentPage: params?.pagination.page,
                pageSize: params?.pagination.perPage,
                ...(Object.hasOwn(params?.filter, "merchant") && {
                    searchField: "merchant",
                    searchString: params?.filter["merchant"]
                })
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items.map((elem: { name: string }) => {
                    return {
                        id: elem.name,
                        ...elem
                    };
                }),
                total: res.data.data.total
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: [],
            total: 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const res = await directionEndpointsGetDirectionEnigmaV1DirectionDirectionIdGet(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: {}
        };
    }

    async update(resource: string, params: UpdateParams) {
        const res = await directionEndpointsUpdateDirectionEnigmaV1DirectionDirectionIdPut(params.id, params.data, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: {}
        };
    }

    async create(resource: string, params: CreateParams<DirectionCreate>): Promise<CreateResult> {
        const res = await directionEndpointsCreateDirectionEnigmaV1DirectionPost(params.data as DirectionCreate, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: {}
        };
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const res = await directionEndpointsDeleteDirectionEnigmaV1DirectionDirectionIdDelete(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: {}
        };
    }
}
