import React from "react";
import {
    LayoutProps,
    RankedTester,
    rankWith,
    and,
    uiTypeIs,
    optionIs,
    JsonFormsRendererRegistryEntry
} from "@jsonforms/core";
import { withJsonFormsLayoutProps } from "@jsonforms/react";
import { JsonFormsDispatch } from "@jsonforms/react";

export interface GridControlElement {
    type: "Control";
    scope: string;
    options?: {
        colSpan?: number;
        showNull?: boolean;
    };
}

export interface GridLayoutElement {
    type: "GridLayout";
    elements: GridControlElement[];
}

const GridLayoutRenderer: React.FC<LayoutProps> = ({ uischema, schema, path, renderers, cells, data, config }) => {
    const gridLayout = uischema as GridLayoutElement;
    const { elements = [] } = gridLayout;

    const getFieldData = (scope: string) => {
        const fieldName = scope.replace("#/properties/", "");
        return data?.[fieldName];
    };

    const shouldHideElement = (element: GridControlElement) => {
        const elementOptions = element.options || {};
        const globalDefaults = config || {};

        const showNull =
            elementOptions.showNull !== undefined ? elementOptions.showNull : globalDefaults.showNull !== false;
        const fieldData = getFieldData(element.scope);

        return !showNull && (!fieldData || fieldData === null || fieldData === "");
    };

    const visibleElements = elements.filter(element => !shouldHideElement(element));

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:gap-4 lg:grid-cols-3">
            {visibleElements.map((element, index) => {
                const elementOptions = element.options || {};
                const colSpan = elementOptions.colSpan || 1;

                return (
                    <div
                        key={index}
                        style={{
                            gridColumn: colSpan > 1 ? "1 / -1" : ""
                        }}>
                        <JsonFormsDispatch
                            uischema={element}
                            schema={schema}
                            path={path}
                            renderers={renderers}
                            cells={cells}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export const gridLayoutTester: RankedTester = rankWith(2, and(uiTypeIs("GridLayout"), optionIs("variant", "grid")));

export const GridLayoutRendererComponent = withJsonFormsLayoutProps(GridLayoutRenderer);

export const gridLayoutRendererRegistryEntry: JsonFormsRendererRegistryEntry = {
    tester: gridLayoutTester,
    renderer: GridLayoutRendererComponent
};
