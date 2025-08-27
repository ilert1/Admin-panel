import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

describe("Button default component", () => {
    it("rendering with custom className", () => {
        render(<Button className="text-red-60">Test</Button>);

        expect(screen.getByRole("button")).toHaveClass("text-red-60");
        expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("disabled", async () => {
        render(<Button disabled />);

        expect(screen.getByRole("button")).toHaveAttribute("disabled");
    });

    it("user click", async () => {
        const user = userEvent.setup();
        const WrapperBtn = () => {
            const [count, setCount] = useState(0);

            return <Button onClick={() => setCount(1)}>{count}</Button>;
        };
        render(<WrapperBtn />);

        const button = screen.getByRole("button");
        await user.click(button);
        expect(button).toHaveTextContent("1");
    });
});
