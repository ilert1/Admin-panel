import { ValidationError } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useTranslate } from "react-admin";

type BackendErrorResponse = ValidationError[];

interface IParseError {
    error: unknown;
    defaultErrorText?: string;
    alreadyExistText?: string;
}

export const useErrorHandler = () => {
    const translate = useTranslate();

    const parseError = ({
        error,
        defaultErrorText = translate("app.ui.toast.error"),
        alreadyExistText
    }: IParseError): string => {
        if (!(error instanceof Error)) {
            return defaultErrorText;
        }

        if (alreadyExistText && error.message.includes("already exists")) {
            return alreadyExistText;
        }

        try {
            const errors: BackendErrorResponse = JSON.parse(
                error.message.replace(/'/g, '"').replace(/\(/g, "[").replace(/\)/g, "]")
            );
            return errors[0]?.msg || error.message;
        } catch {
            return error.message;
        }
    };

    return { parseError };
};
