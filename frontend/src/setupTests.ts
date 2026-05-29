import "@testing-library/jest-dom";

jest.mock("./api/config", () => ({
  API_BASE: "http://localhost:3001",
}));

if (!globalThis.fetch) {
  globalThis.fetch = jest.fn() as typeof fetch;
}
