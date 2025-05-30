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
    TerminalInstrumentConfiguration,
    TerminalInstrumentConfigurationCreate
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    terminalInstrumentConfigurationEndpointsCreateTerminalInstrumentConfigurationEnigmaV1TerminalInstrumentConfigurationsPost,
    terminalInstrumentConfigurationEndpointsDeleteTerminalInstrumentConfigurationEnigmaV1TerminalInstrumentConfigurationsTerminalPaymentInstrumentIdDelete,
    terminalInstrumentConfigurationEndpointsGetTerminalInstrumentConfigurationEnigmaV1TerminalInstrumentConfigurationsTerminalPaymentInstrumentIdGet,
    terminalInstrumentConfigurationEndpointsListTerminalInstrumentConfigurationsEnigmaV1TerminalInstrumentConfigurationsGet,
    terminalInstrumentConfigurationEndpointsPatchTerminalInstrumentConfigurationEnigmaV1TerminalInstrumentConfigurationsTerminalPaymentInstrumentIdPatch
} from "@/api/enigma/terminal-payment-instruments/terminal-payment-instruments";

export class TerminalPaymentInstrumentsProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<TerminalInstrumentConfiguration>> {
        const res =
            await terminalInstrumentConfigurationEndpointsListTerminalInstrumentConfigurationsEnigmaV1TerminalInstrumentConfigurationsGet(
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

    async getListWithoutPagination(): Promise<GetListResult<TerminalInstrumentConfiguration>> {
        const res =
            await terminalInstrumentConfigurationEndpointsListTerminalInstrumentConfigurationsEnigmaV1TerminalInstrumentConfigurationsGet(
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<TerminalInstrumentConfiguration>> {
        const res =
            await terminalInstrumentConfigurationEndpointsGetTerminalInstrumentConfigurationEnigmaV1TerminalInstrumentConfigurationsTerminalPaymentInstrumentIdGet(
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
        params: CreateParams<TerminalInstrumentConfigurationCreate>
    ): Promise<CreateResult<TerminalInstrumentConfiguration>> {
        const res =
            await terminalInstrumentConfigurationEndpointsCreateTerminalInstrumentConfigurationEnigmaV1TerminalInstrumentConfigurationsPost(
                params.data as TerminalInstrumentConfigurationCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<TerminalInstrumentConfiguration>> {
        const res =
            await terminalInstrumentConfigurationEndpointsPatchTerminalInstrumentConfigurationEnigmaV1TerminalInstrumentConfigurationsTerminalPaymentInstrumentIdPatch(
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
            await terminalInstrumentConfigurationEndpointsDeleteTerminalInstrumentConfigurationEnigmaV1TerminalInstrumentConfigurationsTerminalPaymentInstrumentIdDelete(
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
