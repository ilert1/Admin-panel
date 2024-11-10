import { useEffect, useCallback } from "react";

interface Props {
    dependencies?: any[];
    initialDelay?: number;
    tabIndexResetDelay?: number;
}

export const usePreventFocus = ({ dependencies = [], initialDelay = 0, tabIndexResetDelay = 100 }: Props) => {
    const preventFocus = useCallback(() => {
        setTimeout(() => {
            const focusableElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

            focusableElements.forEach(el => {
                if (el instanceof HTMLElement) {
                    el.setAttribute("tabindex", "-1");
                    setTimeout(() => {
                        el.removeAttribute("tabindex");
                    }, tabIndexResetDelay);
                }
            });
        }, initialDelay);
    }, [initialDelay, tabIndexResetDelay]);

    useEffect(() => {
        preventFocus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return preventFocus;
};
