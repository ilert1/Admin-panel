import { render, screen } from "@testing-library/react";
import { ToggleActiveUser } from "./toggle-active-user";

describe("ToggleActiveUser", () => {
    it("renders unlocked icon with correct styling", () => {
        render(<ToggleActiveUser active={true} />);
        const unlockIcon = screen.getByTestId("lock-keyhole-open");
        expect(unlockIcon).toBeInTheDocument();
        expect(screen.queryByTestId("lock-keyhole")).not.toBeInTheDocument();
        expect(unlockIcon).toHaveClass("text-green-50");
    });

    it("renders locked icon with correct styling", () => {
        render(<ToggleActiveUser active={false} />);
        const lockIcon = screen.getByTestId("lock-keyhole");
        expect(lockIcon).toBeInTheDocument();
        expect(screen.queryByTestId("lock-keyhole-open")).not.toBeInTheDocument();
        expect(lockIcon).toHaveClass("text-red-40");
    });
});
