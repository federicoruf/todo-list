import request from "supertest";
import { createApp } from "../app";
import * as service from "../services/duty.service";

jest.mock("../services/duty.service");

const mockedService = service as jest.Mocked<typeof service>;

describe("duty.controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("GET /duties returns duties", async () => {
    mockedService.listDuties.mockResolvedValue([
      {
        id: "1",
        name: "One",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    const app = createApp();
    const res = await request(app).get("/duties");
    expect(res.status).toBe(200);
    expect(res.body.duties).toHaveLength(1);
  });

  test("POST /duties returns 201", async () => {
    mockedService.createDuty.mockResolvedValue({
      id: "1",
      name: "New",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const app = createApp();
    const res = await request(app).post("/duties").send({ name: "New" });
    expect(res.status).toBe(201);
    expect(res.body.duty.name).toBe("New");
  });
});

