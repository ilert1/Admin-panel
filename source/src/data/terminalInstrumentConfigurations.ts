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
import { PaymentTypeCreate, PaymentTypeModel } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    paymentTypeEndpointsCreatePaymentTypeEnigmaV1PaymentTypePost,
    paymentTypeEndpointsDeletePaymentTypeEnigmaV1PaymentTypePaymentTypeCodeDelete,
    paymentTypeEndpointsGetPaymentTypeEnigmaV1PaymentTypePaymentTypeCodeGet,
    paymentTypeEndpointsListPaymentTypesEnigmaV1PaymentTypeGet,
    paymentTypeEndpointsUpdatePaymentTypeEnigmaV1PaymentTypePaymentTypeCodePut
} from "@/api/enigma/payment-type/payment-type";

export type PaymentTypeWithId = PaymentTypeModel & { id: string };

// /terminal_instrument_configurations
export class TerminalInstrumentConfigurationsProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<PaymentTypeWithId>> {
        const res = await paymentTypeEndpointsListPaymentTypesEnigmaV1PaymentTypeGet(
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

    async getListWithoutPagination(): Promise<GetListResult<PaymentTypeWithId>> {
        const res = await paymentTypeEndpointsListPaymentTypesEnigmaV1PaymentTypeGet(
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<PaymentTypeWithId>> {
        const res = await paymentTypeEndpointsGetPaymentTypeEnigmaV1PaymentTypePaymentTypeCodeGet(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal: params.signal || params.meta?.signal
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

    async create(resource: string, params: CreateParams): Promise<CreateResult<PaymentTypeWithId>> {
        const res = await paymentTypeEndpointsCreatePaymentTypeEnigmaV1PaymentTypePost(
            params.data as PaymentTypeCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<PaymentTypeWithId>> {
        const res = await paymentTypeEndpointsUpdatePaymentTypeEnigmaV1PaymentTypePaymentTypeCodePut(
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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<PaymentTypeWithId, "id">>> {
        const res = await paymentTypeEndpointsDeletePaymentTypeEnigmaV1PaymentTypePaymentTypeCodeDelete(params.id, {
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
