import request from "supertest";
import { createApp } from "../app";

jest.mock("../config/db", () => ({
  getPool: jest.fn(),
  query: jest.fn(),
}));

import { query } from "../config/db";
const mockQuery = query as jest.MockedFunction<typeof query>;

const DUTY_A = {
  id: "uuid-1",
  name: "Buy groceries",
  created_at: "2024-01-01T10:00:00.000Z",
  updated_at: "2024-01-01T10:00:00.000Z",
};

const DUTY_B = {
  id: "uuid-2",
  name: "Walk the dog",
  created_at: "2024-01-02T10:00:00.000Z",
  updated_at: "2024-01-02T10:00:00.000Z",
};

function dbRows<T>(rows: T[]) {
  return Promise.resolve({ rows, rowCount: rows.length });
}

describe("Duties API – integration", () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /duties", () => {
    it("returns 200 with the list of duties", async () => {
      mockQuery.mockResolvedValueOnce(dbRows([DUTY_A, DUTY_B]));

      const res = await request(app).get("/duties");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ duties: [DUTY_A, DUTY_B] });
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("returns 200 with an empty array when there are no duties", async () => {
      mockQuery.mockResolvedValueOnce(dbRows([]));

      const res = await request(app).get("/duties");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ duties: [] });
    });

    it("returns 500 when the database throws", async () => {
      mockQuery.mockRejectedValueOnce(new Error("DB connection lost"));

      const res = await request(app).get("/duties");

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ error: { code: "INTERNAL_ERROR" } });
    });
  });

  describe("POST /duties", () => {
    it("returns 201 with the created duty", async () => {
      mockQuery.mockResolvedValueOnce(dbRows([DUTY_A]));

      const res = await request(app)
        .post("/duties")
        .send({ name: "Buy groceries" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ duty: DUTY_A });
    });

    it("trims and collapses whitespace in the name", async () => {
      const trimmed = { ...DUTY_A, name: "Buy groceries" };
      mockQuery.mockResolvedValueOnce(dbRows([trimmed]));

      const res = await request(app)
        .post("/duties")
        .send({ name: "  Buy   groceries  " });

      expect(res.status).toBe(201);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        ["Buy groceries"]
      );
    });

    it("returns 400 when name is missing", async () => {
      const res = await request(app).post("/duties").send({});

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: { code: "VALIDATION_ERROR", message: "Name is required" },
      });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("returns 400 when name is an empty string", async () => {
      const res = await request(app).post("/duties").send({ name: "" });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ error: { code: "VALIDATION_ERROR" } });
    });

    it("returns 400 when name is only whitespace", async () => {
      const res = await request(app).post("/duties").send({ name: "   " });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ error: { code: "VALIDATION_ERROR" } });
    });

    it("returns 400 when name exceeds 255 characters", async () => {
      const res = await request(app)
        .post("/duties")
        .send({ name: "a".repeat(256) });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: { code: "VALIDATION_ERROR", message: "Name is too long" },
      });
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("accepts a name of exactly 255 characters", async () => {
      const name = "a".repeat(255);
      mockQuery.mockResolvedValueOnce(dbRows([{ ...DUTY_A, name }]));

      const res = await request(app).post("/duties").send({ name });

      expect(res.status).toBe(201);
    });

    it("returns 400 when the request body is not JSON", async () => {
      const res = await request(app)
        .post("/duties")
        .set("Content-Type", "text/plain")
        .send("buy milk");

      expect(res.status).toBe(400);
    });

    it("returns 500 when the database throws", async () => {
      mockQuery.mockRejectedValueOnce(new Error("DB error"));

      const res = await request(app)
        .post("/duties")
        .send({ name: "Valid name" });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ error: { code: "INTERNAL_ERROR" } });
    });
  });

  describe("PUT /duties/:id", () => {
    it("returns 200 with the updated duty", async () => {
      const updated = { ...DUTY_A, name: "Buy organic groceries" };
      mockQuery.mockResolvedValueOnce(dbRows([updated]));

      const res = await request(app)
        .put(`/duties/${DUTY_A.id}`)
        .send({ name: "Buy organic groceries" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ duty: updated });
    });

    it("returns 404 when the duty does not exist", async () => {
      mockQuery.mockResolvedValueOnce(dbRows([]));

      const res = await request(app)
        .put("/duties/non-existent-id")
        .send({ name: "Whatever" });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        error: { code: "NOT_FOUND", message: "Duty not found" },
      });
    });

    it("returns 400 when name is empty", async () => {
      const res = await request(app)
        .put(`/duties/${DUTY_A.id}`)
        .send({ name: "" });

      expect(res.status).toBe(400);
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("returns 400 when name exceeds 255 characters", async () => {
      const res = await request(app)
        .put(`/duties/${DUTY_A.id}`)
        .send({ name: "b".repeat(256) });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ error: { code: "VALIDATION_ERROR" } });
    });

    it("normalises the name before updating", async () => {
      const updated = { ...DUTY_A, name: "Buy organic groceries" };
      mockQuery.mockResolvedValueOnce(dbRows([updated]));

      await request(app)
        .put(`/duties/${DUTY_A.id}`)
        .send({ name: "  Buy   organic groceries  " });

      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [
        DUTY_A.id,
        "Buy organic groceries",
      ]);
    });

    it("returns 500 when the database throws", async () => {
      mockQuery.mockRejectedValueOnce(new Error("DB error"));

      const res = await request(app)
        .put(`/duties/${DUTY_A.id}`)
        .send({ name: "Valid name" });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ error: { code: "INTERNAL_ERROR" } });
    });
  });

  describe("DELETE /duties/:id", () => {
    it("returns 204 when the duty is deleted", async () => {
      mockQuery.mockResolvedValueOnce(dbRows([{ id: DUTY_A.id }]));

      const res = await request(app).delete(`/duties/${DUTY_A.id}`);

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it("returns 404 when the duty does not exist", async () => {
      mockQuery.mockResolvedValueOnce(dbRows([]));

      const res = await request(app).delete("/duties/non-existent-id");

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        error: { code: "NOT_FOUND", message: "Duty not found" },
      });
    });

    it("returns 500 when the database throws", async () => {
      mockQuery.mockRejectedValueOnce(new Error("DB error"));

      const res = await request(app).delete(`/duties/${DUTY_A.id}`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ error: { code: "INTERNAL_ERROR" } });
    });
  });
});