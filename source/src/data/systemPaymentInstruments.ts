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
    ImportMode,
    SystemPaymentInstrument,
    SystemPaymentInstrumentCreate
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    getSystemPaymentInstrumentEndpointsExportSystemPaymentInstrumentsEnigmaV1SystemPaymentInstrumentsExportGetUrl,
    systemPaymentInstrumentEndpointsCreateSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsPost,
    systemPaymentInstrumentEndpointsDeleteSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsSystemPaymentInstrumentCodeDelete,
    systemPaymentInstrumentEndpointsGetSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsSystemPaymentInstrumentCodeGet,
    systemPaymentInstrumentEndpointsImportSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsImportPost,
    systemPaymentInstrumentEndpointsListSystemPaymentInstrumentsEnigmaV1SystemPaymentInstrumentsGet,
    systemPaymentInstrumentEndpointsPatchSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsSystemPaymentInstrumentCodePatch
} from "@/api/enigma/system-payment-instruments/system-payment-instruments";

export type SystemPaymentInstrumentWithId = SystemPaymentInstrument & { id: string };

// /system-payment-instruments
export class SystemPaymentInstrumentsProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<SystemPaymentInstrumentWithId>> {
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(
                  item => item === "code" || item === "currency_code" || item === "payment_type_code"
              )
            : [];

        const res =
            await systemPaymentInstrumentEndpointsListSystemPaymentInstrumentsEnigmaV1SystemPaymentInstrumentsGet(
                {
                    currentPage: params?.pagination?.page,
                    pageSize: params?.pagination?.perPage,
                    ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                    ...(fieldsForSearch.length > 0 && {
                        searchString: fieldsForSearch.map(item => params.filter?.[item])
                    })
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
                data: res.data.data.items.map(item => {
                    return {
                        id: item.code,
                        ...item
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

    async getListWithoutPagination(): Promise<GetListResult<SystemPaymentInstrumentWithId>> {
        const res =
            await systemPaymentInstrumentEndpointsListSystemPaymentInstrumentsEnigmaV1SystemPaymentInstrumentsGet(
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
                data: res.data.data.items.map(item => {
                    return {
                        id: item.code,
                        ...item
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<SystemPaymentInstrumentWithId>> {
        const res =
            await systemPaymentInstrumentEndpointsGetSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsSystemPaymentInstrumentCodeGet(
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

    async create(resource: string, params: CreateParams): Promise<CreateResult<SystemPaymentInstrumentWithId>> {
        const res =
            await systemPaymentInstrumentEndpointsCreateSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsPost(
                params.data as SystemPaymentInstrumentCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<SystemPaymentInstrumentWithId>> {
        const res =
            await systemPaymentInstrumentEndpointsPatchSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsSystemPaymentInstrumentCodePatch(
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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const res =
            await systemPaymentInstrumentEndpointsDeleteSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsSystemPaymentInstrumentCodeDelete(
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
                  item => item === "code" || item === "currency_code" || item === "payment_type_code"
              )
            : [];

        const url =
            getSystemPaymentInstrumentEndpointsExportSystemPaymentInstrumentsEnigmaV1SystemPaymentInstrumentsExportGetUrl(
                {
                    ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                    ...(fieldsForSearch.length > 0 && {
                        searchString: fieldsForSearch.map(item => params.filter?.[item])
                    })
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
            await systemPaymentInstrumentEndpointsImportSystemPaymentInstrumentEnigmaV1SystemPaymentInstrumentsImportPost(
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
