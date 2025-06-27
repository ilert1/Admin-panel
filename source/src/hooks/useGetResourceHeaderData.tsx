import { usePermissions, useResourceDefinitions } from "react-admin";
import { useGetResLabel } from "./useGetResLabel";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

enum SplitLocations {
    show = "show",
    edit = "edit",
    new = "new"
}

export const useGetResourceHeaderData = () => {
    const getResLabel = useGetResLabel();
    const resources = useResourceDefinitions();

    const { permissions } = usePermissions();
    const location = useLocation();

    const resourceName = useMemo(() => {
        const urlParts = location.pathname?.split("/")?.filter((s: string) => s?.length > 0);

        Object.values(SplitLocations).forEach(item => {
            if (urlParts.includes(item)) {
                const tempResource = urlParts.splice(urlParts.indexOf(item) - 1, 2);
                urlParts.push(tempResource.join("/"));
            }
        });

        const isWrongResource =
            Object.keys(resources).length !==
            new Set([...Object.keys(resources), urlParts[0] !== "" && urlParts[0]]).size;

        return isWrongResource ? ["error"] : urlParts;
    }, [location, resources]);

    const pageTitle = useMemo(() => {
        if (resourceName.length > 0) {
            if (resourceName[0] === "wallet") {
                if (resourceName[1]) {
                    return getResLabel(`${resourceName[0]}.${resourceName[1]}`, permissions);
                } else {
                    return getResLabel(`${resourceName[0]}.manage`, permissions);
                }
            } else if (resourceName[2] === "backup") {
                return getResLabel(`${resourceName[0]}.history_backup`);
            } else if (resourceName[0] === "callbridge") {
                return getResLabel(`${resourceName[0]}.${resourceName[1]}`);
            } else if (resourceName[0] === "paymentSettings") {
                return getResLabel(`paymentSettings.${resourceName[1]}`);
            }

            return getResLabel(resourceName[0], permissions);
        }
    }, [getResLabel, permissions, resourceName]);
    return { pageTitle, resourceName };
};
