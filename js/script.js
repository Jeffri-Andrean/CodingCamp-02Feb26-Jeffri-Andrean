const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filterSelect');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', loadTasks); // Load data saat web dibuka
addBtn.addEventListener('click', addTask);
filterSelect.addEventListener('change', filterTasks);
deleteAllBtn.addEventListener('click', () => {
    if(confirm('Hapus semua tugas?')) {
        taskList.innerHTML = '';
        saveLocalTasks(); // Update penyimpanan setelah dihapus semua
    }
});

function addTask() {
    const taskValue = taskInput.value;
    const dateValue = dateInput.value;

    if (taskValue === '' || dateValue === '') {
        alert("Harap isi nama tugas dan tanggalnya!");
        return;
    }

    // Panggil fungsi pembuat elemen
    createTaskElement(taskValue, dateValue, false);
    
    // Simpan ke Local Storage
    saveLocalTasks();
    
    // Reset Input
    taskInput.value = '';
    dateInput.value = '';
}

// Fungsi untuk membuat HTML Task (Dipisah agar bisa dipakai saat Load data juga)
function createTaskElement(taskValue, dateValue, isCompleted) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (isCompleted) {
        li.classList.add('completed');
    }

    li.innerHTML = `
        <span class="task-text ${isCompleted ? 'completed-text' : ''}">${taskValue}</span>
        <span class="task-date">${dateValue}</span>
        <span class="status">${isCompleted ? 'Completed' : 'Pending'}</span>
        <div>
            <button class="action-btn check-btn"><i class="fas fa-check"></i></button>
            <button class="action-btn trash-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Logic tombol check
    li.querySelector('.check-btn').addEventListener('click', () => {
        li.classList.toggle('completed');
        const statusSpan = li.querySelector('.status');
        const textSpan = li.querySelector('.task-text');
        
        if (li.classList.contains('completed')) {
            statusSpan.textContent = "Completed";
            textSpan.classList.add('completed-text');
        } else {
            statusSpan.textContent = "Pending";
            textSpan.classList.remove('completed-text');
        }
        filterTasks();
        saveLocalTasks(); // Simpan perubahan status
    });

    // Logic tombol trash
    li.querySelector('.trash-btn').addEventListener('click', () => {
        li.remove();
        saveLocalTasks(); // Simpan perubahan setelah dihapus
    });

    taskList.appendChild(li);
}

// FUNGSI SIMPAN KE LOCAL STORAGE
function saveLocalTasks() {
    const tasks = [];
    const taskItems = taskList.querySelectorAll('.task-item');

    taskItems.forEach(function(item) {
        tasks.push({
            text: item.querySelector('.task-text').innerText,
            date: item.querySelector('.task-date').innerText,
            completed: item.classList.contains('completed')
        });
    });

    localStorage.setItem('todos', JSON.stringify(tasks));
}

// FUNGSI LOAD DARI LOCAL STORAGE
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('todos')) || [];
    
    tasks.forEach(function(task) {
        createTaskElement(task.text, task.date, task.completed);
    });
}

function filterTasks() {
    const tasks = taskList.childNodes;
    tasks.forEach(task => {
        if (task.nodeType === 1) { 
            switch (filterSelect.value) {
                case "all":
                    task.style.display = "grid";
                    break;
                case "completed":
                    if (task.classList.contains('completed')) task.style.display = "grid";
                    else task.style.display = "none";
                    break;
                case "pending":
                    if (!task.classList.contains('completed')) task.style.display = "grid";
                    else task.style.display = "none";
                    break;
            }
        }
    });
}