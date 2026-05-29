import { HttpError } from "../middleware/error.middleware";
import * as service from "../services/duty.service";
import * as repo from "../repositories/duty.repository";

jest.mock("../repositories/duty.repository");

const mockedRepo = repo as jest.Mocked<typeof repo>;

describe("duty.service", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("createDuty trims and normalizes whitespace", async () => {
    mockedRepo.createDuty.mockResolvedValue({
      id: "1",
      name: "Buy milk",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const duty = await service.createDuty({ name: "  Buy   milk  " });
    expect(mockedRepo.createDuty).toHaveBeenCalledWith("Buy milk");
    expect(duty.name).toBe("Buy milk");
  });

  test("createDuty rejects empty name", async () => {
    await expect(service.createDuty({ name: "   " })).rejects.toBeInstanceOf(
      HttpError
    );
  });

  test("updateDuty returns 404 when repository returns null", async () => {
    mockedRepo.updateDuty.mockResolvedValue(null);
    await expect(service.updateDuty("abc", { name: "Test" })).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
  });
});

