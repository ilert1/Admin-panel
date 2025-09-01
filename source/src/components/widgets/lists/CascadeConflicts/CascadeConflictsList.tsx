import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { EmptyTable } from "../../shared/EmptyTable";
import { useGetCascadeConflictsColumns } from "./Columns";

export const CascadeConflictsList = () => {
    const { columns } = useGetCascadeConflictsColumns();

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
            </div>

            <EmptyTable columns={columns} />
        </>
    );
};
