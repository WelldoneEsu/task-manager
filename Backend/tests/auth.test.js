const request = require("supertest");
const fs = require("fs-extra");
const path = require("path");
const app = require("../app");

const baseDir = path.join(__dirname, "../data");
const usersFile = path.join(baseDir, "users.json");
const tasksFile = path.join(baseDir, "tasks.json");

// Ensure data directory and files exist before each test
beforeEach(async () => {
  try {
    await fs.ensureDir(baseDir); // Ensure data directory exists
    await fs.writeJSON(usersFile, [], { flag: "w" }); // Overwrite users.json
    await fs.writeJSON(tasksFile, [], { flag: "w" }); // Overwrite tasks.json
  } catch (error) {
    console.error("Failed to set up test files:", error);
    throw error; // Fail the test if setup fails
  }
});

// Helper: signup + login → returns agent with cookies
async function loginAs(name = "eve", password = "1234") {
  await request(app).post("/auth/signup").send({ name, password });
  const agent = request.agent(app); // persist cookies
  const loginRes = await agent.post("/auth/login").send({ name, password });
  if (loginRes.status !== 200) {
    console.log("Login failed:", loginRes.body);
  }
  return agent;
}

describe("Auth API", () => {
  it("should signup a new user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "alice", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "✅User registered");
  });

  it("should not signup with duplicate name", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ name: "bob", password: "1234" });

    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "bob", password: "abcd" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "❌Name already exists");
  });

  it("should login with valid credentials and maintain session", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ name: "charlie", password: "mypassword" });

    const agent = request.agent(app);
    const res = await agent
      .post("/auth/login")
      .send({ name: "charlie", password: "mypassword" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("name", "charlie");

    const tasksRes = await agent.get("/tasks");
    expect(tasksRes.status).toBe(200);
    expect(Array.isArray(tasksRes.body)).toBe(true);
  });

  it("should logout and block further access", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ name: "dave", password: "test" });

    const agent = request.agent(app);
    await agent.post("/auth/login").send({ name: "dave", password: "test" });

    const logoutRes = await agent.post("/auth/logout");
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body).toHaveProperty("message", "Logged out");

    const tasksRes = await agent.get("/tasks");
    expect(tasksRes.status).toBe(401);
  });
});