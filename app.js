// Load the sample tasks in the local storage
const sampleTasks = [
    { title: "Fix Bug #123", description: "Resolve the login issue", status: "Pending" },
    { title: "Write Documentation", description: "API usage guidelines", status: "Completed" },
    { title: "Code Review", description: "Review PR #45", status: "Pending" },
  ];
  
  const tasks = JSON.parse(localStorage.getItem("tasks")) || sampleTasks;
  
  // Select DOM elements
  const taskForm = document.getElementById("add-task-form");
  const taskTitleInput = document.getElementById("task-title");
  const taskDescInput = document.getElementById("task-desc");
  const taskStatusInput = document.getElementById("task-status");
  const taskContainer = document.getElementById("tasks-container");
  const filterStatus = document.getElementById("filter-status");
  
  // Save tasks to local storage
  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  
// Render tasks in the list
const renderTasks = (filter = "All") => {
    taskContainer.innerHTML = "";
    const filteredTasks = tasks
      .map((task, index) => ({ ...task, originalIndex: index })) 
      .filter(task => filter === "All" || task.status === filter);
  
    filteredTasks.forEach((task) => {
      const row = document.createElement("tr");
      row.dataset.index = task.originalIndex; 
      row.innerHTML = `
        <td contenteditable="false" data-index="${task.originalIndex}" data-key="title" class="editable">${task.title}</td>
        <td contenteditable="false" data-index="${task.originalIndex}" data-key="description" class="editable">${task.description}</td>
        <td>
          <select data-index="${task.originalIndex}" data-key="status">
            <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
        <td>
          <button data-index="${task.originalIndex}" class="edit-task">Edit</button>
          <button data-index="${task.originalIndex}" class="delete-task">Delete</button>
        </td>
      `;
      taskContainer.appendChild(row);
    });
  };
  
  // Add a new task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTask = {
      title: taskTitleInput.value.trim(),
      description: taskDescInput.value.trim(),
      status: taskStatusInput.value,
    };
  
    // Ensure the task has a title
    if (!newTask.title) {
      alert("Task title is required!");
      return;
    }
  
    tasks.push(newTask);
    saveTasks();
    renderTasks(filterStatus.value); // Keep the filter intact
    taskForm.reset();
  });
  
// Toggle editing state and handle delete action
taskContainer.addEventListener("click", (e) => {
    const originalIndex = parseInt(e.target.dataset.index); // Use the original index
  
    if (e.target.classList.contains("edit-task")) {
      const titleCell = taskContainer.querySelector(`tr[data-index="${originalIndex}"] td[data-key="title"]`);
      const descCell = taskContainer.querySelector(`tr[data-index="${originalIndex}"] td[data-key="description"]`);
      
      if (titleCell.isContentEditable) {
        titleCell.contentEditable = "false";
        descCell.contentEditable = "false";
        e.target.textContent = "Edit"; 
      } else {
        titleCell.contentEditable = "true";
        descCell.contentEditable = "true";
        e.target.textContent = "Unedit"; 
      }
    }
  
    if (e.target.classList.contains("delete-task")) {
      if (!isNaN(originalIndex)) {
        tasks.splice(originalIndex, 1); 
        saveTasks();
        renderTasks(filterStatus.value); 
      }
    }
  });
  
  // Update status when the dropdown value changes
  taskContainer.addEventListener("change", (e) => {
    if (e.target.dataset.key === "status") {
      const index = e.target.dataset.index;
      tasks[index].status = e.target.value; 
      saveTasks();
    }
  });
  
  taskContainer.addEventListener("input", (e) => {
    const index = e.target.dataset.index;
    const key = e.target.dataset.key;
  
    tasks[index][key] = e.target.innerText || e.target.value;
    saveTasks();
  });
  
  // Filter tasks
  filterStatus.addEventListener("change", (e) => {
    renderTasks(e.target.value);
  });
  
  // Initial render
  renderTasks();
  