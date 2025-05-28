import {
    CreateParams,
    CreateResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    UpdateParams,
    UpdateResult
} from "react-admin";
import { IBaseDataProvider } from "./base";
import { FinancialInstitution, FinancialInstitutionCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    financialInstitutionEndpointsCreateFinancialInstitutionEnigmaV1FinancialInstitutionPost,
    financialInstitutionEndpointsDeleteFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdDelete,
    financialInstitutionEndpointsGetFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdGet,
    financialInstitutionEndpointsListFinancialInstitutionsEnigmaV1FinancialInstitutionGet,
    financialInstitutionEndpointsUpdateFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdPut
} from "@/api/enigma/financial-institution/financial-institution";

export class FinancialInstitutionProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<FinancialInstitution>> {
        const res = await financialInstitutionEndpointsListFinancialInstitutionsEnigmaV1FinancialInstitutionGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal: params.signal || params.filter?.signal
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items,
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<FinancialInstitution>> {
        const res =
            await financialInstitutionEndpointsGetFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdGet(
                params.id,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    },
                    signal: params.signal || params.meta?.signal
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async create(
        resource: string,
        params: Omit<CreateParams, "data"> & { data: FinancialInstitutionCreate }
    ): Promise<CreateResult<FinancialInstitution>> {
        const res = await financialInstitutionEndpointsCreateFinancialInstitutionEnigmaV1FinancialInstitutionPost(
            params.data,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async update(
        resource: string,
        params: UpdateParams<FinancialInstitution>
    ): Promise<UpdateResult<FinancialInstitution>> {
        const res =
            await financialInstitutionEndpointsUpdateFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdPut(
                params.id,
                params.data,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async delete(
        resource: string,
        params: DeleteParams<FinancialInstitution>
    ): Promise<DeleteResult<Pick<FinancialInstitution, "id">>> {
        const res =
            await financialInstitutionEndpointsDeleteFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdDelete(
                params.id,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: {
                id: params.id
            }
        };
    }
}
