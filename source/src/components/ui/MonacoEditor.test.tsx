import { render, screen, fireEvent } from "@testing-library/react";
import { MonacoEditor } from "./MonacoEditor";

describe("MonacoEditor", () => {
    it("renders editor", () => {
        render(
            <MonacoEditor
                code="{}"
                onMountEditor={() => {
                    expect(screen.getByRole("code")).toBeInTheDocument();
                }}
            />
        );
    });

    it("calls setCode and validates correct JSON", () => {
        const setCode = jest.fn();
        const onValidChange = jest.fn();
        render(
            <MonacoEditor
                code="{}"
                setCode={setCode}
                onValidChange={onValidChange}
                onMountEditor={() => {
                    fireEvent.change(screen.getByRole("code"), { target: { value: '{"a":"b"}' } });
                    expect(setCode).toHaveBeenCalledWith('{"a":"b"}');
                    expect(onValidChange).toHaveBeenCalledWith(true);
                }}
            />
        );
    });

    it("invalid JSON triggers onValidChange(false)", () => {
        const onValidChange = jest.fn();
        render(
            <MonacoEditor
                code="{}"
                onValidChange={onValidChange}
                onMountEditor={() => {
                    fireEvent.change(screen.getByRole("code"), { target: { value: "{bad}" } });
                    expect(onValidChange).toHaveBeenCalledWith(false);
                }}
            />
        );
    });

    it("empty values are invalid if allowEmptyValues=false", () => {
        const onValidChange = jest.fn();
        render(
            <MonacoEditor
                code="{}"
                onValidChange={onValidChange}
                onMountEditor={() => {
                    fireEvent.change(screen.getByRole("code"), { target: { value: '{"a":""}' } });
                    expect(onValidChange).toHaveBeenCalledWith(false);
                }}
            />
        );
    });

    it("empty values are valid if allowEmptyValues=true", () => {
        const onValidChange = jest.fn();
        render(
            <MonacoEditor
                code="{}"
                onValidChange={onValidChange}
                onMountEditor={() => {
                    fireEvent.change(screen.getByRole("code"), { target: { value: '{"a":""}' } });
                    expect(onValidChange).toHaveBeenCalledWith(true);
                }}
                allowEmptyValues
            />
        );
    });

    it("calls onErrorsChange when markers provided", () => {
        const onErrorsChange = jest.fn();
        render(
            <MonacoEditor
                code="{}"
                onErrorsChange={onErrorsChange}
                onMountEditor={() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (screen.getByRole("code") as any).props?.onValidate?.([{ message: "err" }]);
                    expect(onErrorsChange).toHaveBeenCalledWith(true);
                }}
            />
        );
    });

    it("respects disabled prop", () => {
        render(
            <MonacoEditor
                code="{}"
                onMountEditor={() => {
                    expect(screen.getByRole("code")).toHaveAttribute("readonly");
                }}
                disabled
            />
        );
    });
});
