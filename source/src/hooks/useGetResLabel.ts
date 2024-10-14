import inflection from "inflection";
import { useResourceDefinitions } from "react-admin";
import { useTranslate } from "react-admin";

export const useGetResLabel = (): ((resource: string, role?: string, count?: number) => string) => {
    const translate = useTranslate();
    const definitions = useResourceDefinitions();
    return (resource: string, role = "", count = 2): string => {
        const resourceDefinition = definitions[resource];
        const isPermDependent = translate(`resources.${resource}.name`) === `resources.${resource}.name`;
        const label = translate(
            `resources.${resource}.${isPermDependent ? (role === "admin" ? "admin." : "merchant.") : ""}name`,
            {
                smart_count: count,
                _:
                    resourceDefinition && resourceDefinition.options && resourceDefinition.options.label
                        ? translate(resourceDefinition.options.label, {
                              smart_count: count,
                              _: resourceDefinition.options.label
                          })
                        : inflection.humanize(
                              count > 1 ? inflection.pluralize(resource) : inflection.singularize(resource)
                          )
            }
        );

        return label;
    };
};

export type GetResourceLabel = (resource: string, count?: number) => string;
