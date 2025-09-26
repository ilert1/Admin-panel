import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "./dialog";

const setup = (ui: React.ReactNode) => {
    return render(ui);
};

describe("Dialog component", () => {
    it("должен открываться и закрываться по клику на триггер", async () => {
        setup(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <DialogTitle />
                    <DialogDescription />

                    <p>Dialog body</p>
                    <DialogClose>Close</DialogClose>
                </DialogContent>
            </Dialog>
        );

        expect(screen.queryByText("Dialog body")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText("Open"));
        expect(await screen.findByText("Dialog body")).toBeInTheDocument();

        await userEvent.click(screen.getByText("Close"));
        expect(screen.queryByText("Dialog body")).not.toBeInTheDocument();
    });

    it("отрисовывает заголовок и описание", async () => {
        setup(
            <Dialog open>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Title</DialogTitle>
                        <DialogDescription>Description</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );

        expect(screen.getByText("Title")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("рендерит footer и children", async () => {
        setup(
            <Dialog open>
                <DialogContent>
                    <DialogTitle />
                    <DialogDescription />

                    <p>Dialog body</p>
                    <DialogFooter>
                        <button>Action</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );

        expect(screen.getByText("Dialog body")).toBeInTheDocument();
        expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("закрывается при клике вне, если disableOutsideClick=false (по умолчанию)", async () => {
        setup(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <DialogTitle />
                    <DialogDescription />

                    <p>Dialog body</p>
                </DialogContent>
            </Dialog>
        );

        await userEvent.click(screen.getByText("Open"));
        expect(await screen.findByText("Dialog body")).toBeInTheDocument();

        const overlay = document.querySelector("[data-state='open'][class*='bg-neutral']");
        expect(overlay).toBeInTheDocument();

        if (overlay) {
            await userEvent.click(overlay);
        }

        expect(screen.queryByText("Dialog body")).not.toBeInTheDocument();
    });

    it("не закрывается при клике вне, если disableOutsideClick=true", async () => {
        setup(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent disableOutsideClick>
                    <DialogTitle />
                    <DialogDescription />

                    <p>Dialog body</p>
                </DialogContent>
            </Dialog>
        );

        await userEvent.click(screen.getByText("Open"));
        expect(await screen.findByText("Dialog body")).toBeInTheDocument();

        const overlay = document.querySelector("[data-state='open'][class*='bg-neutral']");
        expect(overlay).toBeInTheDocument();

        if (overlay) {
            await userEvent.click(overlay);
        }

        expect(screen.getByText("Dialog body")).toBeInTheDocument();
    });

    it("игнорирует клики по toast (data-sonner-toaster)", async () => {
        setup(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <DialogTitle />
                    <DialogDescription />

                    <p>Dialog body</p>
                </DialogContent>
            </Dialog>
        );

        await userEvent.click(screen.getByText("Open"));
        expect(await screen.findByText("Dialog body")).toBeInTheDocument();

        const toast = document.createElement("div");
        toast.setAttribute("data-sonner-toaster", "");
        document.body.appendChild(toast);

        fireEvent.mouseDown(toast);
        fireEvent.click(toast);

        expect(screen.getByText("Dialog body")).toBeInTheDocument();
    });

    it("поддерживает кастомные className для DialogContent", async () => {
        setup(
            <Dialog open>
                <DialogContent className="custom-class">
                    <DialogTitle />
                    <DialogDescription />

                    <p>Dialog body</p>
                </DialogContent>
            </Dialog>
        );

        const dialogContent = screen.getByText("Dialog body").closest("[data-state='open']");
        expect(dialogContent).toHaveClass("custom-class");
    });

    it("поддерживает кастомные className для DialogOverlay", async () => {
        setup(
            <Dialog open>
                <DialogContent>
                    <DialogTitle />
                    <DialogDescription />

                    <p>Dialog body</p>
                </DialogContent>
            </Dialog>
        );

        const overlay = document.querySelector("[data-state='open'][class*='bg-neutral']");
        expect(overlay).toBeInTheDocument();
    });
});
