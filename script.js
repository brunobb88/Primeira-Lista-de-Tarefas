// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. "Pega" os elementos do HTML
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Array que vai armazenar nossas tarefas
    let tasks = [];

    // Função para salvar as tarefas no localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para carregar as tarefas do localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    }

    // Função para renderizar (mostrar) a lista de tarefas na tela
    function renderTasks() {
        taskList.innerHTML = ''; // Limpa a lista

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = task.id; // Usando dataset para guardar o ID

            if (task.completed) {
                li.classList.add('completed');
            }

            // Cria o conteúdo do item da lista
            li.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn">X</button>
            `;

            taskList.appendChild(li);
        });
    }

    // Função para adicionar uma nova tarefa
    function addTask(event) {
        event.preventDefault(); // Impede o recarregamento da página

        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            const newTask = {
                id: Date.now(), // ID único baseado no timestamp
                text: taskText,
                completed: false
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();

            taskInput.value = ''; // Limpa o campo
            taskInput.focus(); // Coloca o foco de volta no input
        }
    }

    // Função para marcar/desmarcar uma tarefa como concluída
    function toggleTaskCompleted(id) {
        // Encontra a tarefa no array pelo ID
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed; // Inverte o estado
            saveTasks();
            renderTasks();
        }
    }

    // Função para deletar uma tarefa
    function deleteTask(id) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            // Filtra o array, mantendo apenas as tarefas com ID diferente do informado
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
    }

    // DELEGAÇÃO DE EVENTOS - A SOLUÇÃO DEFINITIVA
    // Adiciona um único event listener na lista UL para capturar cliques
    // em qualquer elemento dentro dela (os itens dinâmicos)
    taskList.addEventListener('click', function(event) {
        // Descobre em qual elemento exatamente o clique ocorreu
        const clickedElement = event.target;
        // Encontra o elemento <li> pai mais próximo do elemento clicado
        const listItem = clickedElement.closest('li');
        
        // Se não encontrar um <li>, ignora o clique
        if (!listItem) return;

        // Pega o ID da tarefa armazenado no dataset do <li>
        const taskId = parseInt(listItem.dataset.id);

        // Verifica se o clique foi no botão de deletar
        if (clickedElement.classList.contains('delete-btn')) {
            deleteTask(taskId);
            return; // Importante: para aqui se for para deletar
        }

        // Se o clique foi no texto (span) ou no próprio li, marca como concluída
        if (clickedElement.tagName === 'SPAN' || clickedElement === listItem) {
            toggleTaskCompleted(taskId);
        }
    });

    // Adiciona o event listener para o formulário
    taskForm.addEventListener('submit', addTask);

    // Carrega as tarefas quando a página abre
    loadTasks();
});
