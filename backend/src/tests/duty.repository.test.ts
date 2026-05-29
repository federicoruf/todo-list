import * as db from "../config/db";
import * as repo from "../repositories/duty.repository";

jest.mock("../config/db");

const mockedDb = db as jest.Mocked<typeof db>;

describe("duty.repository", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("listDuties runs expected query", async () => {
    mockedDb.query.mockResolvedValue({
      rows: [
        {
          id: "1",
          name: "Test",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });

    const duties = await repo.listDuties();
    expect(duties).toHaveLength(1);
    expect(mockedDb.query).toHaveBeenCalledTimes(1);
  });
});

