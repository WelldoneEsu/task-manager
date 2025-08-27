const request = require("supertest");
const fs = require("fs-extra");
const path = require("path");
const app = require("../app");

const baseDir = path.resolve(__dirname, "../data");
const usersFile = path.join(baseDir, "users.json");
const tasksFile = path.join(baseDir, "tasks.json");

// Ensure data directory and files exist
async function setupTestEnvironment() {
  console.log("Current working directory:", process.cwd());
  try {
    await fs.ensureDir(baseDir); // `recursive: true` is default in ensureDir, so no need to specify
    await fs.writeJSON(usersFile, []);
    await fs.writeJSON(tasksFile, []);
    console.log("Test files set up successfully at:", baseDir);
  } catch (error) {
    console.error("Failed to set up test files:", error.message);
    throw error;
  }
}

// Helper: signup + login → returns agent and userId
async function loginAs(name = "eve", password = "1234") {
  try {
    console.log("=== SIGNUP PROCESS ===");
    const signupRes = await request(app).post("/auth/signup").send({ name, password });

    console.log("Signup status:", signupRes.status);
    console.log("Signup body:", signupRes.body);

    if (![200, 201].includes(signupRes.status)) {
      throw new Error("Signup failed");
    }

    const agent = request.agent(app);

    console.log("=== LOGIN PROCESS ===");
    const loginRes = await agent.post("/auth/login").send({ name, password });

    console.log("Login status:", loginRes.status);
    console.log("Login body:", loginRes.body);
    console.log("Login headers (cookies):", loginRes.headers['set-cookie']);

    if (loginRes.status !== 200) {
      throw new Error(`Login failed with status: ${loginRes.status}`);
    }

    const userId = loginRes.body.user?.id;

    if (!userId) {
      console.log("User ID not found in login response");
      throw new Error("User ID not found");
    }

    console.log("✅ Login successful, userId:", userId);

    console.log("=== SESSION TEST ===");
    const testRes = await agent.get("/tasks");

    console.log("Session test status:", testRes.status);
    console.log("Session test body:", testRes.body);

    if ([401, 403].includes(testRes.status)) {
      console.log("❌ Session not maintained between requests");
      throw new Error("Session authentication failed");
    }

    return { agent, userId };

  } catch (error) {
    console.error("Error in loginAs:", error.message);
    throw error;
  }
}

module.exports = { setupTestEnvironment, loginAs };
