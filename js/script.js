// simple todo app with date, filter, delete all confirm
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const dateInput = document.getElementById('dateInput');
  const statusInput = document.getElementById('statusInput');
  const taskBody = document.getElementById('taskBody');

  const filters = document.querySelectorAll('.filter');
  const dateFilter = document.getElementById('dateFilter');
  const clearDate = document.getElementById('clearDate');
  const deleteAllBtn = document.getElementById('deleteAll');

  const confirmModal = document.getElementById('confirmModal');
  const cancelDel = document.getElementById('cancelDel');
  const confirmDel = document.getElementById('confirmDel');

  // tasks stored as array of {id, text, date, status}
  let tasks = JSON.parse(localStorage.getItem('todo-tasks') || '[]');
  let currentFilter = 'all';
  let dateFilterVal = '';

  function save(){ localStorage.setItem('todo-tasks', JSON.stringify(tasks)); }

  function formatDate(iso){
    if(!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    // format dd MMM yyyy (Indonesia-like)
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function render(){
    taskBody.innerHTML = '';
    const filtered = tasks.filter(t => {
      if (currentFilter === 'active' && t.status !== 'active') return false;
      if (currentFilter === 'done' && t.status !== 'done') return false;
      if (dateFilterVal && t.date !== dateFilterVal) return false;
      return true;
    });

    if (filtered.length === 0){
      const tr = document.createElement('tr');
      tr.className = 'empty-row';
      tr.innerHTML = `<td colspan="4">No task found</td>`;
      taskBody.appendChild(tr);
      return;
    }

    filtered.forEach(task => {
      const tr = document.createElement('tr');

      // TASK
      const tdTask = document.createElement('td');
      tdTask.textContent = task.text;

      // DATE
      const tdDate = document.createElement('td');
      tdDate.textContent = task.date ? formatDate(task.date) : '-';

      // STATUS
      const tdStatus = document.createElement('td');
      tdStatus.textContent = task.status === 'done' ? 'Done' : 'Active';

      // ACTIONS
      const tdActions = document.createElement('td');
      tdActions.className = 'row-actions';

      // toggle status button
      const btnToggle = document.createElement('button');
      btnToggle.className = 'action-btn done';
      btnToggle.title = 'Toggle done';
      btnToggle.textContent = task.status === 'done' ? 'Undo' : 'OK';
      btnToggle.addEventListener('click', () => {
        tasks = tasks.map(t => t.id === task.id ? {...t, status: t.status === 'done' ? 'active' : 'done'} : t);
        save(); render();
      });

      // edit button (quick inline edit)
      const btnEdit = document.createElement('button');
      btnEdit.className = 'action-btn edit';
      btnEdit.textContent = 'Edit';
      btnEdit.addEventListener('click', () => {
        const newText = prompt('Edit task', task.text);
        if (newText === null) return;
        const newDate = prompt('Edit date (yyyy-mm-dd)', task.date || '');
        tasks = tasks.map(t => t.id === task.id ? {...t, text: newText.trim() || t.text, date: newDate || t.date} : t);
        save(); render();
      });

      // delete button
      const btnDel = document.createElement('button');
      btnDel.className = 'action-btn del';
      btnDel.textContent = 'Delete';
      btnDel.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        save(); render();
      });

      tdActions.appendChild(btnToggle);
      tdActions.appendChild(btnEdit);
      tdActions.appendChild(btnDel);

      tr.appendChild(tdTask);
      tr.appendChild(tdDate);
      tr.appendChild(tdStatus);
      tr.appendChild(tdActions);

      taskBody.appendChild(tr);
    });
  }

  // init render
  render();

  // add
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    const dateVal = dateInput.value || '';
    const statusVal = statusInput.value || 'active';
    tasks.push({ id: Date.now().toString(36), text, date: dateVal, status: statusVal });
    taskInput.value = ''; dateInput.value = ''; statusInput.value = 'active';
    save(); render();
  });

  // filters
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  }));

  // date filter
  if (dateFilter){
    dateFilter.addEventListener('change', () => {
      dateFilterVal = dateFilter.value || '';
      render();
    });
  }
  if (clearDate){
    clearDate.addEventListener('click', () => {
      dateFilter.value = ''; dateFilterVal = ''; render();
    });
  }

  // delete all with confirm
  deleteAllBtn.addEventListener('click', () => {
    confirmModal.classList.remove('hidden');
  });
  cancelDel.addEventListener('click', () => confirmModal.classList.add('hidden'));
  confirmDel.addEventListener('click', () => {
    tasks = []; save(); render();
    confirmModal.classList.add('hidden');
  });
});
