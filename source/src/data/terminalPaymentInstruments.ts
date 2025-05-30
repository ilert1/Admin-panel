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
    TerminalPaymentInstrument,
    TerminalPaymentInstrumentCreate
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    terminalPaymentInstrumentEndpointsCreateTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsPost,
    terminalPaymentInstrumentEndpointsDeleteTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdDelete,
    terminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdGet,
    terminalPaymentInstrumentEndpointsListTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsGet,
    terminalPaymentInstrumentEndpointsPatchTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdPatch
} from "@/api/enigma/terminal-payment-instruments/terminal-payment-instruments";

export class TerminalPaymentInstrumentsProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsListTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsGet(
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

    async getListWithoutPagination(): Promise<GetListResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsListTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsGet(
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdGet(
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
        params: CreateParams<TerminalPaymentInstrumentCreate>
    ): Promise<CreateResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsCreateTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsPost(
                params.data as TerminalPaymentInstrumentCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsPatchTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdPatch(
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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const res =
            await terminalPaymentInstrumentEndpointsDeleteTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdDelete(
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
