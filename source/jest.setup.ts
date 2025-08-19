import "@testing-library/jest-dom";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextEncoder, TextDecoder });
