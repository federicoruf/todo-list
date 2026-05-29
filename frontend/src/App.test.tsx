import React from 'react'
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import * as dutiesApi from "./api/duties";

jest.mock("./api/duties");

const mockedApi = dutiesApi as jest.Mocked<typeof dutiesApi>;

const sampleDuty = {
  id: "a1",
  name: "Sample",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("App", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedApi.listDuties.mockResolvedValue([sampleDuty]);
  });

  test("loads and displays duties", async () => {
    render(<App />);

    expect(await screen.findByText("Sample")).toBeInTheDocument();
    expect(mockedApi.listDuties).toHaveBeenCalled();
  });

  test("creates a duty from the form", async () => {
    const user = userEvent.setup();
    const created = { ...sampleDuty, id: "b2", name: "New task" };
    mockedApi.createDuty.mockResolvedValue(created);

    render(<App />);
    await screen.findByText("Sample");

    await user.type(screen.getByLabelText(/duty name/i), "New task");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(mockedApi.createDuty).toHaveBeenCalledWith("New task");
    expect(await screen.findByText("New task")).toBeInTheDocument();
  });

  test("shows error when load fails", async () => {
    mockedApi.listDuties.mockRejectedValue(new Error("Network error"));

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Network error");
  });
});
