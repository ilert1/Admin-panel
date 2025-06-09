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
import {
    FinancialInstitution,
    FinancialInstitutionCreate,
    FinancialInstitutionCurrenciesLink,
    PaymentTypesLink
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    financialInstitutionEndpointsAddCurrenciesToFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdAddCurrenciesPatch,
    financialInstitutionEndpointsAddPaymentTypesToFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdAddPaymentTypesPatch,
    financialInstitutionEndpointsCreateFinancialInstitutionEnigmaV1FinancialInstitutionPost,
    financialInstitutionEndpointsDeleteFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdDelete,
    financialInstitutionEndpointsGetFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdGet,
    financialInstitutionEndpointsGetFinancialInstitutionTypesEnigmaV1FinancialInstitutionTypesGet,
    financialInstitutionEndpointsListFinancialInstitutionsEnigmaV1FinancialInstitutionGet,
    financialInstitutionEndpointsRemoveCurrencyFromFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdRemoveCurrencyCurrencyCodeDelete,
    financialInstitutionEndpointsRemovePaymentTypeFromFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdRemovePaymentTypePaymentTypeCodeDelete,
    financialInstitutionEndpointsUpdateFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdPut
} from "@/api/enigma/financial-institution/financial-institution";

export class FinancialInstitutionProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<FinancialInstitution>> {
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(
                  item =>
                      item === "name" ||
                      item === "short_name" ||
                      item === "institution_type" ||
                      item === "country_code" ||
                      item === "nspk_member_id"
              )
            : [];

        const res = await financialInstitutionEndpointsListFinancialInstitutionsEnigmaV1FinancialInstitutionGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage,
                ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                ...(fieldsForSearch.length > 0 && { searchString: fieldsForSearch.map(item => params.filter?.[item]) })
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

    async getListWithoutPagination(): Promise<GetListResult<FinancialInstitution>> {
        const res = await financialInstitutionEndpointsListFinancialInstitutionsEnigmaV1FinancialInstitutionGet(
            {
                currentPage: 1,
                pageSize: 1000
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
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
        params: CreateParams<FinancialInstitutionCreate>
    ): Promise<CreateResult<FinancialInstitution>> {
        const res = await financialInstitutionEndpointsCreateFinancialInstitutionEnigmaV1FinancialInstitutionPost(
            params.data as FinancialInstitutionCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<FinancialInstitution>> {
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

    async getFinancialInstitutionTypes(resource: string, params: GetListParams) {
        const res = await financialInstitutionEndpointsGetFinancialInstitutionTypesEnigmaV1FinancialInstitutionTypesGet(
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
        }

        return Promise.reject();
    }

    async addPaymentTypes(
        params: UpdateParams & { data: PaymentTypesLink }
    ): Promise<UpdateResult<FinancialInstitution>> {
        const res =
            await financialInstitutionEndpointsAddPaymentTypesToFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdAddPaymentTypesPatch(
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

    async removePaymentType(
        params: UpdateParams & { data: { code: string } }
    ): Promise<UpdateResult<FinancialInstitution>> {
        const res =
            await financialInstitutionEndpointsRemovePaymentTypeFromFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdRemovePaymentTypePaymentTypeCodeDelete(
                params.id,
                params.data.code,
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

    async addCurrencies(
        params: UpdateParams & { data: FinancialInstitutionCurrenciesLink }
    ): Promise<UpdateResult<FinancialInstitution>> {
        const res =
            await financialInstitutionEndpointsAddCurrenciesToFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdAddCurrenciesPatch(
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

    async removeCurrency(
        params: UpdateParams & { data: { code: string } }
    ): Promise<UpdateResult<FinancialInstitution>> {
        const res =
            await financialInstitutionEndpointsRemoveCurrencyFromFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionIdRemoveCurrencyCurrencyCodeDelete(
                params.id,
                params.data.code,
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

    async delete(resource: string, params: DeleteParams<FinancialInstitution>): Promise<DeleteResult> {
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
