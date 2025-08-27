const API = "http://localhost:4000";

// Handle login
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    });

    if (res.ok) {
      window.location = "dashboard.html";
    } else {
      alert("Login failed");
    }
  });
}

// Dashboard logic
if (document.getElementById("taskForm")) {
  const taskList = document.getElementById("taskList");

  async function loadTasks() {
    const res = await fetch(`${API}/tasks`, { credentials: "include" });
    if (!res.ok) {
      window.location = "index.html";
      return;
    }
    const tasks = await res.json();
    taskList.innerHTML = "";
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.title + " (" + task.priority + ")";
      li.className = `task ${task.priority.toLowerCase()}`;
      taskList.appendChild(li);
    });
  }

  document.getElementById("taskForm").addEventListener("submit", async e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const priority = document.getElementById("priority").value;
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority }),
      credentials: "include"
    });
    loadTasks();
  });

  document.getElementById("logout").addEventListener("click", async () => {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
    window.location = "index.html";
  });

  loadTasks();
}
