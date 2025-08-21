import "@testing-library/jest-dom";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextEncoder, TextDecoder });

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = function () {
    return null;
};
