/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface GridLayoutElement {
    type: "GridLayout";
    elements: any[];
}

export interface GridControlElement {
    type: "Control";
    scope: string;
    options?: {
        colSpan?: number;
    };
}

const GridLayoutRenderer: React.FC<LayoutProps> = ({ uischema, schema, path, renderers, cells }) => {
    const gridLayout = uischema as GridLayoutElement;
    const { elements = [] } = gridLayout;

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:gap-4 lg:grid-cols-3">
            {elements.map((element, index) => {
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
