// Seleksi elemen DOM
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const filterSelect = document.getElementById('filterSelect');

// Event Listeners
addBtn.addEventListener('click', addTask);
deleteAllBtn.addEventListener('click', deleteAllTasks);
filterSelect.addEventListener('change', filterTasks);

// Fungsi Menambah Tugas
function addTask() {
    const taskValue = taskInput.value;
    const dateValue = dateInput.value;

    // 1. Validate Input Form (Sesuai instruksi)
    if (taskValue === '' || dateValue === '') {
        alert("Please fill in both the task and the due date!");
        return;
    }

    // Hapus pesan "No Task Found" jika ada
    const emptyMsg = document.querySelector('.empty-message');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    // Membuat elemen list item baru
    const li = document.createElement('li');
    li.className = 'task-item';
    
    // Isi HTML di dalam li
    li.innerHTML = `
        <span>${taskValue}</span>
        <span>${dateValue}</span>
        <span class="status-badge status-pending">Pending</span>
        <div>
            <button class="action-btn complete-btn"><i class="fas fa-check"></i></button>
            <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Menambahkan fungsionalitas tombol di dalam item baru (Complete & Delete)
    const completeBtn = li.querySelector('.complete-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    const statusBadge = li.querySelector('.status-badge');

    // Logic Tombol Selesai (Complete)
    completeBtn.addEventListener('click', function() {
        li.classList.toggle('completed');
        if (li.classList.contains('completed')) {
            statusBadge.textContent = "Completed";
            statusBadge.classList.replace('status-pending', 'status-completed');
        } else {
            statusBadge.textContent = "Pending";
            statusBadge.classList.replace('status-completed', 'status-pending');
        }
        filterTasks(); // Refresh filter saat status berubah
    });

    // Logic Tombol Hapus (Delete per item)
    deleteBtn.addEventListener('click', function() {
        li.remove();
        checkEmpty();
    });

    // Masukkan ke dalam list
    taskList.appendChild(li);

    // Reset input
    taskInput.value = '';
    dateInput.value = '';
}

// Fungsi Menghapus Semua Tugas
function deleteAllTasks() {
    // Konfirmasi sederhana agar tidak sengaja terhapus
    if(confirm("Are you sure you want to delete all tasks?")) {
        taskList.innerHTML = '<li class="empty-message">No Task Found!</li>';
    }
}

// Fungsi Cek Apakah List Kosong
function checkEmpty() {
    if (taskList.children.length === 0) {
        taskList.innerHTML = '<li class="empty-message">No Task Found!</li>';
    }
}

// Fungsi Filter (All, Completed, Pending)
function filterTasks() {
    const todos = taskList.childNodes;
    const filterValue = filterSelect.value;

    todos.forEach(function(todo) {
        // Skip jika itu adalah pesan "No Task Found"
        if (todo.classList && todo.classList.contains('empty-message')) return;

        if (todo.nodeType === 1) { // Pastikan elemen HTML
            switch(filterValue) {
                case "all":
                    todo.style.display = "grid";
                    break;
                case "completed":
                    if (todo.classList.contains('completed')) {
                        todo.style.display = "grid";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
                case "pending":
                    if (!todo.classList.contains('completed')) {
                        todo.style.display = "grid";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
            }
        }
    });
}