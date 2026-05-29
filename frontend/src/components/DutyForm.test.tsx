import React from 'react'
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DutyForm } from "./DutyForm";

describe("DutyForm", () => {
  test("submits trimmed name and clears input", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<DutyForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/duty name/i), "  Buy milk  ");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onSubmit).toHaveBeenCalledWith("Buy milk");
    expect(screen.getByLabelText(/duty name/i)).toHaveValue("");
  });

  test("does not submit when name is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<DutyForm onSubmit={onSubmit} />);

    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
