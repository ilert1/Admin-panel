import { API_URL, http } from "@/helpers";
import {
    CreateParams,
    CreateResult,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    UpdateManyResult,
    UpdateParams,
    GetManyReferenceParams
} from "react-admin";

export class BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const paramsStr = new URLSearchParams({
            limit: params.pagination.perPage.toString(),
            offset: ((params.pagination.page - 1) * +params.pagination.perPage).toString()
        }).toString();
        const { json } = await http(`${API_URL}/${resource}?${paramsStr}`);
        return {
            data: json.data || [],
            total: json?.total || 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const { json } = await http(`${API_URL}/${resource}/${params.id}`);
        return { data: json.data };
    }

    async update(resource: string, params: UpdateParams) {
        delete params.data.generatedAt;
        delete params.data.loadedAt;
        const { json } = await http(`${API_URL}/${resource}`, {
            method: "PUT",
            body: JSON.stringify(params.data)
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return { data: json.data };
    }

    async create(resource: string, params: CreateParams): Promise<CreateResult> {
        const { json } = await http(`${API_URL}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data)
        });
        return { data: json };
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const { json } = await http(`${API_URL}/${resource}/${params.id}`, {
            method: "DELETE"
        });

        if (!json.success) {
            throw new Error(json.error);
        }

        return { data: { id: params.id } };
    }

    async getMany(): Promise<GetManyResult> {
        throw new Error("Method not implemented");
    }

    async getManyReference(resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult> {
        const { json } = await http(`${API_URL}/${resource}/${params.id}/history`, {
            method: "GET"
        });
        return { data: json?.data || [], total: json?.data?.length || 0 };
    }

    async updateMany(): Promise<UpdateManyResult> {
        throw new Error("Method not implemented");
    }

    async deleteMany(): Promise<DeleteManyResult> {
        throw new Error("Method not implemented");
    }

    async getDictionaries(): Promise<Dictionary.Data> {
        const { json } = await http(`${API_URL}/dictionaries`, {
            method: "GET"
        });
        return json?.data;
    }
}
