// Tema
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const themeIcon = document.getElementById("themeIcon");
// Load tema awal
function loadTheme() {
  const saved = localStorage.getItem("todo-theme");
  if (saved === "dark") root.setAttribute("data-theme", "dark");
}
loadTheme();
// Toggle tema
themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  if (isDark) {
    root.removeAttribute("data-theme");
    localStorage.setItem("todo-theme", "light");
  } else {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("todo-theme", "dark");
  }
});
// To-Do Logic
let tasks = JSON.parse(localStorage.getItem("todo-tasks") || "[]");
let currentFilter = "all";
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const clearBtn = document.getElementById("clearCompleted");
function saveTasks() {
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}
function render() {
  list.innerHTML = "";
  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "completed") return t.done;
    return true;
  });
  filtered.forEach((task) => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = task.done;
    cb.addEventListener("change", () => {
      task.done = cb.checked;
      saveTasks();
      render();
    });
    const p = document.createElement("span");
    p.textContent = task.text;
    if (task.done) p.classList.add("completed");
    left.appendChild(cb);
    left.appendChild(p);
    // tampilkan tanggal
    if (task.date) {
      const d = document.createElement("small");
      d.textContent = ` ${task.date}`;
      d.style.marginLeft = "10px";
      d.style.color = "var(--muted)";
      left.appendChild(d);
    }
    li.appendChild(left);
    const del = document.createElement("button");
    del.textContent = "Hapus";
    del.style.background = "var(--danger)";
    del.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      render();
    });
    li.appendChild(del);
    list.appendChild(li);
  });
}
render();
// Tambah tugas
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, date: dateVal, done: false });
  input.value = "";
  saveTasks();
  render();
});
// Filter
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  })
);
// Hapus selesai
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
});
