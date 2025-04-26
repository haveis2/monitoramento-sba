// Função de login
async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Login realizado com sucesso!");
        loadTasks();
        toggleLoginForm(false);
    } catch (error) {
        alert("Erro ao fazer login: " + error.message);
    }
}

// Função de registro
async function registerUser() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert("Usuário registrado com sucesso!");
        toggleRegisterForm(false);
    } catch (error) {
        alert("Erro ao registrar: " + error.message);
    }
}

// Função para logout
async function logoutUser() {
    try {
        await auth.signOut();
        alert("Logout realizado com sucesso!");
        toggleLoginForm(true);
    } catch (error) {
        alert("Erro ao fazer logout: " + error.message);
    }
}

// Alterna entre o formulário de login e o de registro
function toggleRegister() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm.style.display === "none") {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
    } else {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
    }
}

// Função para adicionar tarefa
async function saveTask() {
    const taskInput = document.getElementById('newTask');
    const taskText = taskInput.value;

    if (taskText.trim() !== "") {
        const user = auth.currentUser;
        if (user) {
            try {
                await db.collection("tasks").add({
                    userId: user.uid,
                    task: taskText,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    priority: "low"  // Ajuste para sua lógica de prioridade
                });
                alert("Tarefa salva com sucesso!");
                loadTasks();
            } catch (error) {
                alert("Erro ao salvar tarefa: " + error.message);
            }
        } else {
            alert("Você precisa estar logado para salvar tarefas.");
        }
    }
}

// Função para carregar tarefas
async function loadTasks() {
    const user = auth.currentUser;
    if (user) {
        try {
            const querySnapshot = await db.collection("tasks")
                .where("userId", "==", user.uid)
                .orderBy("timestamp", "desc")
                .get();

            const tasksList = document.getElementById('tasksList');
            tasksList.innerHTML = "";  // Limpa a lista antes de carregar

            querySnapshot.forEach(doc => {
                const task = doc.data();
                const li = document.createElement('li');
                li.textContent = task.task;
                tasksList.appendChild(li);
            });
        } catch (error) {
            alert("Erro ao carregar tarefas: " + error.message);
        }
    } else {
        alert("Você precisa estar logado para ver suas tarefas.");
    }
}

// Alternar entre mostrar o formulário de login ou tarefas
function toggleLoginForm(show) {
    const loginForm = document.getElementById('loginForm');
    const tasksContainer = document.getElementById('tasksContainer');

    if (show) {
        loginForm.style.display = "block";
        tasksContainer.style.display = "none";
    } else {
        loginForm.style.display = "none";
        tasksContainer.style.display = "block";
    }
}

// Inicialização
auth.onAuthStateChanged(user => {
    if (user) {
        loadTasks();
        toggleLoginForm(false);
    } else {
        toggleLoginForm(true);
    }
});
