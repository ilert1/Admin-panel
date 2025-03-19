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
import { BaseDataProvider } from "./base";
import {
    currencyEndpointsCreateCurrencyEnigmaV1CurrencyPost,
    currencyEndpointsDeleteCurrencyEnigmaV1CurrencyCurrencyCodeDelete,
    currencyEndpointsGetCurrencyEnigmaV1CurrencyCurrencyCodeGet,
    currencyEndpointsListCurrenciesEnigmaV1CurrencyGet,
    currencyEndpointsUpdateCurrencyEnigmaV1CurrencyCurrencyCodePut
} from "@/api/enigma/currency/currency";
import { Currency, CurrencyCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export type CurrencyWithId = Currency & { id: string };

export class CurrenciesDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<CurrencyWithId>> {
        const res = await currencyEndpointsListCurrenciesEnigmaV1CurrencyGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal: params.signal
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items.map(elem => {
                    return {
                        id: elem.code,
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

    async getListWithoutPagination(): Promise<GetListResult<CurrencyWithId>> {
        const res = await currencyEndpointsListCurrenciesEnigmaV1CurrencyGet(
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
                data: res.data.data.items.map(elem => {
                    return {
                        id: elem.code,
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<CurrencyWithId>> {
        const res = await currencyEndpointsGetCurrencyEnigmaV1CurrencyCurrencyCodeGet(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal: params.signal
        });

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

    async create(resource: string, params: CreateParams): Promise<CreateResult<CurrencyWithId>> {
        const res = await currencyEndpointsCreateCurrencyEnigmaV1CurrencyPost(params.data as CurrencyCreate, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<CurrencyWithId>> {
        const res = await currencyEndpointsUpdateCurrencyEnigmaV1CurrencyCurrencyCodePut(params.id, params.data, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<CurrencyWithId, "id">>> {
        const res = await currencyEndpointsDeleteCurrencyEnigmaV1CurrencyCurrencyCodeDelete(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

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
