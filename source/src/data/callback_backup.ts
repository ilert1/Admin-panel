import { GetListParams, GetListResult, GetOneParams } from "react-admin";
import { IBaseDataProvider } from "./base";
import {
    callbackHistoryBackupEndpointsDownloadBackupCallbridgeV1HistoryBackupDownloadGet,
    callbackHistoryBackupEndpointsListBackupsCallbridgeV1HistoryBackupGet
} from "@/api/callbridge/callback-backup/callback-backup";

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
        const sortOrder = params.filter?.["sortOrder"];

        // const fieldsForSearch = params.filter
        //     ? Object.keys(params.filter).filter(
        //           item => item === "createdAfter" || item === "createdBefore"
        //           //   item === "description" ||
        //           //   item === "internal_path" ||
        //           //   item === "external_path" ||
        //           //   item === "mapping_id" ||
        //           //   item === "callback_id" ||
        //           //   item === "original_url" ||
        //           //   item === "trigger_type" ||
        //           //   item === "status" ||
        //           //   item === "transaction_id" ||
        //           //   item === "external_order_id"
        //       )
        //     : [];

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
                ...(sortOrder
                    ? {
                          sortOrder: sortOrder
                      }
                    : {})
                // ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                // ...(fieldsForSearch.length > 0 && { searchString: fieldsForSearch.map(item => params.filter?.[item]) }),
                // ...(params.filter?.asc && { sortOrder: params.filter?.asc?.toLowerCase() }),
                // ...(params.filter?.sort && { orderBy: params.filter?.sort?.toLowerCase() })
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
        const res = await callbackHistoryBackupEndpointsDownloadBackupCallbridgeV1HistoryBackupDownloadGet(
            { fileName: params.id },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );
        console.log(res);

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
}
