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
    ImportMode,
    PaymentTypesLink
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    financialInstitutionEndpointsAddCurrenciesToFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeAddCurrenciesPatch,
    financialInstitutionEndpointsAddPaymentTypesToFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeAddPaymentTypesPatch,
    financialInstitutionEndpointsCreateFinancialInstitutionEnigmaV1FinancialInstitutionPost,
    financialInstitutionEndpointsDeleteFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeDelete,
    financialInstitutionEndpointsGetFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeGet,
    financialInstitutionEndpointsGetFinancialInstitutionTypesEnigmaV1FinancialInstitutionTypesGet,
    financialInstitutionEndpointsImportFinancialInstitutionsEnigmaV1FinancialInstitutionImportPost,
    financialInstitutionEndpointsListFinancialInstitutionsEnigmaV1FinancialInstitutionGet,
    financialInstitutionEndpointsRemoveCurrencyFromFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeRemoveCurrencyCurrencyCodeDelete,
    financialInstitutionEndpointsRemovePaymentTypeFromFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeRemovePaymentTypePaymentTypeCodeDelete,
    financialInstitutionEndpointsUpdateFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodePut,
    getFinancialInstitutionEndpointsExportFinancialInstitutionsEnigmaV1FinancialInstitutionExportGetUrl
} from "@/api/enigma/financial-institution/financial-institution";

export type FinancialInstitutionWithId = FinancialInstitution & { id: string };

export class FinancialInstitutionProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<FinancialInstitutionWithId>> {
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(
                  item =>
                      item === "name" ||
                      item === "code" ||
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
                data: res.data.data.items.map(item => ({ id: item.code, ...item })),
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

    async getListWithoutPagination(): Promise<GetListResult<FinancialInstitutionWithId>> {
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
                data: res.data.data.items.map(item => ({ id: item.code, ...item })),
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<FinancialInstitutionWithId>> {
        const res =
            await financialInstitutionEndpointsGetFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeGet(
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
                data: {
                    id: res.data.data.code,
                    ...res.data.data
                }
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
    ): Promise<CreateResult<FinancialInstitutionWithId>> {
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
                data: {
                    id: res.data.data.code,
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<FinancialInstitutionWithId>> {
        const res =
            await financialInstitutionEndpointsUpdateFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodePut(
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
                data: {
                    id: res.data.data.code,
                    ...res.data.data
                }
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

    async addPaymentTypes(params: UpdateParams & { data: PaymentTypesLink }): Promise<UpdateResult> {
        const res =
            await financialInstitutionEndpointsAddPaymentTypesToFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeAddPaymentTypesPatch(
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

    async removePaymentType(params: UpdateParams & { data: { code: string } }): Promise<UpdateResult> {
        const res =
            await financialInstitutionEndpointsRemovePaymentTypeFromFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeRemovePaymentTypePaymentTypeCodeDelete(
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

    async addCurrencies(params: UpdateParams & { data: FinancialInstitutionCurrenciesLink }): Promise<UpdateResult> {
        const res =
            await financialInstitutionEndpointsAddCurrenciesToFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeAddCurrenciesPatch(
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

    async removeCurrency(params: UpdateParams & { data: { code: string } }): Promise<UpdateResult> {
        const res =
            await financialInstitutionEndpointsRemoveCurrencyFromFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeRemoveCurrencyCurrencyCodeDelete(
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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const res =
            await financialInstitutionEndpointsDeleteFinancialInstitutionEnigmaV1FinancialInstitutionFinancialInstitutionCodeDelete(
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
    async downloadReport(params: GetListParams) {
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(
                  item =>
                      item === "code" ||
                      item === "name" ||
                      item === "institution_type" ||
                      item === "country_code" ||
                      item === "nspk_member_id"
              )
            : [];

        const url = getFinancialInstitutionEndpointsExportFinancialInstitutionsEnigmaV1FinancialInstitutionExportGetUrl(
            {
                ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                ...(fieldsForSearch.length > 0 && { searchString: fieldsForSearch.map(item => params.filter?.[item]) })
            }
        );

        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/octet-stream",
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });
    }

    async uploadReport(file: File, mode: ImportMode = "strict") {
        const res =
            await financialInstitutionEndpointsImportFinancialInstitutionsEnigmaV1FinancialInstitutionImportPost(
                {
                    csv_file: file
                },
                {
                    mode
                },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );
        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }
    }
}
