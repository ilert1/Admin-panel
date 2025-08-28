import {
    CreateParams,
    CreateResult,
    DeleteParams,
    DeleteResult,
    fetchUtils,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    UpdateParams,
    UpdateResult
} from "react-admin";
import { BF_MANAGER_URL, IBaseDataProvider } from "./base";
import {
    merchantEndpointsAddPaymentTypesToMerchantEnigmaV1MerchantMerchantIdAddPaymentTypesPatch,
    merchantEndpointsCreateMerchantEnigmaV1MerchantPost,
    merchantEndpointsDeleteMerchantEnigmaV1MerchantMerchantIdDelete,
    merchantEndpointsGetMerchantEnigmaV1MerchantMerchantIdGet,
    merchantEndpointsListMerchantsEnigmaV1MerchantGet,
    merchantEndpointsRemovePaymentTypeFromMerchantEnigmaV1MerchantMerchantIdRemovePaymentTypePaymentTypeCodeDelete,
    merchantEndpointsUpdateMerchantEnigmaV1MerchantMerchantIdPut
} from "@/api/enigma/merchant/merchant";
import { Merchant, MerchantCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { directionEndpointsListDirectionsByMerchantIdEnigmaV1DirectionMerchantMerchantIdGet } from "@/api/enigma/direction/direction";

const MONEYGATE_URL = import.meta.env.VITE_MONEYGATE_URL;

export class MerchantsDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<Merchant>> {
        const fieldsForSearch = Object.keys(params.filter).filter(item => item === "id");

        const res = await merchantEndpointsListMerchantsEnigmaV1MerchantGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage,
                ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                ...(fieldsForSearch.length > 0 && { searchString: fieldsForSearch.map(item => params.filter?.[item]) }),
                ...(params.filter?.asc && { sortOrder: params.filter?.asc?.toLowerCase() }),
                ...(params.filter?.sort && { orderBy: params.filter?.sort?.toLowerCase() })
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

    async getListWithoutPagination(resource: string, signal?: AbortSignal): Promise<GetListResult<Merchant>> {
        const res = await merchantEndpointsListMerchantsEnigmaV1MerchantGet(
            {
                currentPage: 1,
                pageSize: 10000
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<Merchant>> {
        const res = await merchantEndpointsGetMerchantEnigmaV1MerchantMerchantIdGet(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal: params.signal || params.meta?.signal
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

        return Promise.reject();
    }

    async create(resource: string, params: CreateParams): Promise<CreateResult<Merchant>> {
        const res = await merchantEndpointsCreateMerchantEnigmaV1MerchantPost(params.data as MerchantCreate, {
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

        return Promise.reject();
    }

    async createNewFlow(params: CreateParams) {
        const { json } = await fetchUtils.fetchJson(`${BF_MANAGER_URL}/merchants`, {
            method: "POST",
            body: JSON.stringify(params.data),
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return json;
    }

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<Merchant>> {
        const res = await merchantEndpointsUpdateMerchantEnigmaV1MerchantMerchantIdPut(params.id, params.data, {
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

        return Promise.reject();
    }

    async addPaymentTypes(params: UpdateParams & { data: { codes: string[] } }): Promise<UpdateResult<Merchant>> {
        const res = await merchantEndpointsAddPaymentTypesToMerchantEnigmaV1MerchantMerchantIdAddPaymentTypesPatch(
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

    async removePaymentType(params: UpdateParams & { data: { code: string } }): Promise<UpdateResult<Merchant>> {
        const res =
            await merchantEndpointsRemovePaymentTypeFromMerchantEnigmaV1MerchantMerchantIdRemovePaymentTypePaymentTypeCodeDelete(
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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<Merchant, "id">>> {
        const res = await merchantEndpointsDeleteMerchantEnigmaV1MerchantMerchantIdDelete(params.id, {
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

    async getMerchantDirections(resource: string, id: string, signal?: AbortSignal) {
        const res = await directionEndpointsListDirectionsByMerchantIdEnigmaV1DirectionMerchantMerchantIdGet(
            id,
            {
                currentPage: 1,
                pageSize: 10000,
                orderBy: "weight",
                sortOrder: "desc"
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal
            }
        );

        if ("data" in res.data && res.data.success) {
            return res.data.data.items;
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }
    }

    async getMerchantSettings(id: string, signal?: AbortSignal): Promise<Merchant.SettingsResponse[] | undefined> {
        const res = await fetch(`${MONEYGATE_URL}/clients?id=${id}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal
        });

        const data = await res.json();

        if ("data" in data && data.success) {
            return data.data;
        } else if ("error" in data) {
            throw new Error(
                data.error_description ? data.error_description : data.error ? data.error : "Unexpected error"
            );
        }

        Promise.reject();
    }

    async updateMerchantSettings(
        id: string,
        body: Merchant.SettingsUpdate,
        signal?: AbortSignal
    ): Promise<Merchant.SettingsResponse[] | undefined> {
        const res = await fetch(`${MONEYGATE_URL}/clients?id=${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            body: JSON.stringify({ ...body }),
            signal
        });

        const data = await res.json();

        if ("data" in data && data.success) {
            return data.data;
        } else if ("data" in data && !data.success) {
            throw new Error(data.error?.error_message);
        } else if ("detail" in data) {
            throw new Error(data.detail?.[0].msg);
        }
    }
}
