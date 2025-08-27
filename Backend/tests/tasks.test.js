const { setupTestEnvironment, loginAs } = require("./setup");

// Set a longer timeout since we're doing multiple API calls
jest.setTimeout(15000);

// Run before all tests
beforeAll(async () => {
  console.log("=== SETTING UP TEST ENVIRONMENT ===");
  await setupTestEnvironment();
});

describe("Tasks API", () => {
  
    it("should allow creating a task", async () => {
  console.log("=== STARTING TASK CREATION TEST ===");
  
  const { agent, userId } = await loginAs();
  console.log("Using userId:", userId);

  const taskData = {
  title: "New Task",
  description: "Task description",
  priority: "high" 
};
  
  console.log("Creating task with data:", taskData);
  
  const res = await agent.post("/tasks").send(taskData);
  
  console.log("Task creation response status:", res.status);
  console.log("Task creation response body:", JSON.stringify(res.body, null, 2));
  
  // Debug: Check what error we're getting
  if (res.status === 400) {
    console.log("❌ Validation error:", res.body.error || res.body);
  }
  
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body.title).toBe(taskData.title);
});
  it("should fetch tasks", async () => {
    console.log("=== STARTING TASK FETCH TEST ===");
    
    const { agent } = await loginAs("testuser2", "testpass2");

    const res = await agent.get("/tasks");
    
    console.log("Tasks fetch response status:", res.status);
    console.log("Tasks fetch response body:", JSON.stringify(res.body, null, 2));
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tasks) || Array.isArray(res.body)).toBe(true);
  });

  it("should return empty array for new user", async () => {
    console.log("=== STARTING EMPTY TASKS TEST ===");
    
    const { agent } = await loginAs("newuser", "newpass");

    const res = await agent.get("/tasks");
    
    console.log("Empty tasks response status:", res.status);
    console.log("Empty tasks response body:", JSON.stringify(res.body, null, 2));
    
    expect(res.status).toBe(200);
    
    // Handle both response formats: {tasks: []} or just []
    const tasksArray = res.body.tasks || res.body;
    expect(Array.isArray(tasksArray)).toBe(true);
    expect(tasksArray.length).toBe(0);
  });
});