const API = "https://task-manager-m4gn.onrender.com";

// Handle login
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
        credentials: "include"
      });

      // Get the response data whether it's success or error
      const data = await res.json();
      console.log("Login response:", data); // Check browser console

      if (res.ok) {
        window.location.href = "dashboard.html";
      } else {
        // Show the actual error message from the server
        alert("Login failed: " + (data.error || "Check console for details"));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error. Please try again.");
    }
  });
}

// Dashboard logic
if (document.getElementById("taskForm")) {
  const taskList = document.getElementById("taskList");

  async function loadTasks() {
    try {
      const res = await fetch(`${API}/tasks`, { credentials: "include" });
      
      if (!res.ok) {
        // If unauthorized, go back to login
        window.location.href = "index.html";
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
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  document.getElementById("taskForm").addEventListener("submit", async e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const priority = document.getElementById("priority").value;
    
    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority }),
        credentials: "include"
      });
      
      if (res.ok) {
        loadTasks();
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  });

  document.getElementById("logout").addEventListener("click", async () => {
    try {
      await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout error:", error);
    }
  });

  loadTasks();
}