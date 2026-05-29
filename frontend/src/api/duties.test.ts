import { createDuty, deleteDuty, listDuties, updateDuty } from "./duties";

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

beforeEach(() => {
  mockFetch.mockReset();
  jest.spyOn(globalThis, "fetch").mockImplementation(mockFetch);
});

afterEach(() => {
  jest.restoreAllMocks();
});

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Bad Request",
    json: async () => body,
  } as Response;
}

describe("duties api", () => {
  test("listDuties returns duties array", async () => {
    const duty = {
      id: "1",
      name: "One",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    mockFetch.mockResolvedValue(jsonResponse({ duties: [duty] }));

    const duties = await listDuties();

    expect(duties).toEqual([duty]);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3001/duties");
  });

  test("createDuty posts name and returns duty", async () => {
    const duty = {
      id: "2",
      name: "New",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    mockFetch.mockResolvedValue(jsonResponse({ duty }, true, 201));

    const created = await createDuty("New");

    expect(created).toEqual(duty);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/duties"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "New" }),
      })
    );
  });

  test("updateDuty puts name", async () => {
    const duty = {
      id: "2",
      name: "Updated",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-02T00:00:00.000Z",
    };
    mockFetch.mockResolvedValue(jsonResponse({ duty }));

    const updated = await updateDuty("2", "Updated");

    expect(updated).toEqual(duty);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/duties/2"),
      expect.objectContaining({ method: "PUT" })
    );
  });

  test("deleteDuty calls DELETE", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, true, 204));

    await deleteDuty("2");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/duties/2"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("throws api error message on failure", async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { error: { message: "Name is required", code: "VALIDATION_ERROR" } },
        false,
        400
      )
    );

    await expect(createDuty("   ")).rejects.toThrow("Name is required");
  });
});
