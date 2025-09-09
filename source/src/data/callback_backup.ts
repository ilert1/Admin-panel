import { GetListParams, GetListResult, GetOneParams } from "react-admin";
import { IBaseDataProvider } from "./base";
import {
    callbackHistoryBackupEndpointsListBackupsCallbridgeV1HistoryBackupGet,
    callbackHistoryBackupEndpointsRestoreBackupCallbridgeV1HistoryBackupRestorePost,
    getCallbackHistoryBackupEndpointsDownloadBackupCallbridgeV1HistoryBackupDownloadGetUrl
} from "@/api/callbridge/callback-backup/callback-backup";
import {
    CallbackHistoryBackupEndpointsListBackupsCallbridgeV1HistoryBackupGetSortOrder,
    RestoreStrategy
} from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

/**
 * Data provider for CallbackBackups resource
 *
 * Contains methods for fetching and manipulating data from the CallbackBackups resource
 * @class CallbackBackupsDataProvider
 * @extends IBaseDataProvider
 * @memberof module:api/callbridge/callback-backup
 */
export class CallbackBackupsDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const createdAfter = params.filter?.["createdAfter"];
        const createdBefore = params.filter?.["createdBefore"];
        const sortOrder = params.sort?.order.toLowerCase() ?? "ASC".toLowerCase();

        const res = await callbackHistoryBackupEndpointsListBackupsCallbridgeV1HistoryBackupGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage,
                ...(createdAfter
                    ? {
                          createdAfter: createdAfter
                      }
                    : {}),
                ...(createdBefore
                    ? {
                          createdBefore: createdBefore
                      }
                    : {}),
                sortOrder:
                    sortOrder.toLowerCase() as CallbackHistoryBackupEndpointsListBackupsCallbridgeV1HistoryBackupGetSortOrder
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
                data: res.data.data.items.map(el => ({ ...el, id: el.file_name })),
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

    async downloadFile(params: GetOneParams) {
        const url = getCallbackHistoryBackupEndpointsDownloadBackupCallbridgeV1HistoryBackupDownloadGetUrl({
            fileName: params.id
        });

        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/octet-stream",
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });
    }

    async uploadReport(file: File, mode: RestoreStrategy = "merge") {
        const res = await callbackHistoryBackupEndpointsRestoreBackupCallbridgeV1HistoryBackupRestorePost(
            {
                file: file
            },
            {
                strategy: mode
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
