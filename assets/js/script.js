// Retrieve tasks and nextId from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks"));
// let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskDisplayEl = $('.swim-lanes');
const taskFormEl = $('#task-form');
const taskTitleEl = $('#task-title');
const taskDueEl = $('#task-due');
const taskDescEl = $('#task-desc');
const taskButtonEl = $('.btn-primary');

function readTasksFromStorage() {

    tasks = JSON.parse(localStorage.getItem('tasks'));

    if (!tasks) {
        tasks = [];
    }

    return tasks;
};

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomNum}`;
};

const taskId = generateTaskId();
console.log(taskId);

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCardEl = $('<div>')
        .addClass('card task-card draggable')
        .attr('data-task-id', task.id);
    const cardHeader = $('<h3>')
        .addClass('card-header')
        .text(task.title);
    const cardBody = $('<div>')
        .addClass('card-body');
    const cardDue = $('<p>')
        .addClass('card-text')
        .text(task.dueDate);
    const cardDesc = $('<p>')
        .addClass('card-text')
        .text(task.desc);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .attr('data-task-id', task.id)
        .text('Delete')

    // cardDeleteBtn.on('click', handleDeleteTask);
    // console.log(cardDeleteBtn);

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    
        console.log(now,taskDueDate);

        if (now.isSame(taskDueDate, 'day')) {
          taskCardEl.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
          taskCardEl.addClass('bg-danger text-white');
          cardDeleteBtn.addClass('border-light');
        }
    };
        
    cardBody.append(cardDesc, cardDue, cardDeleteBtn);   
    taskCardEl.append(cardHeader, cardBody);
    
    // console.log(taskCardEl);

    return taskCardEl;
    
};

function printTaskData() {
    readTasksFromStorage();

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
        // console.log(task);
    };
    
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');

            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).attr('data-task-id');
    readTasksFromStorage();
    
    console.log(taskId);
    console.log(event.target);

    tasks = tasks.filter((task) => {
        return(task.id !== taskId)
    });
    
    saveTasksToStorage(tasks);
    
    printTaskData();
};

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskTitle = taskTitleEl.val().trim();
    const taskDue = taskDueEl.val();
    const taskDesc = taskDescEl.val();

    const newTask = {
        title: taskTitle,
        dueDate: taskDue,
        desc: taskDesc,
        status: 'to-do',
        id: generateTaskId(),
    };

    readTasksFromStorage();
    tasks.push(newTask);
      
    saveTasksToStorage(tasks);
      
    printTaskData();
      
    taskTitleEl.val('');
    taskDueEl.val('');
    taskDescEl.val('');

};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    readTasksFromStorage();

    const taskIdEl = ui.draggable[0].dataset.taskId;
      
    const newStatus = event.target.id;
      
    for (let task of tasks) {
        if (task.id === taskIdEl) {
        task.status = newStatus;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    printTaskData();
};

taskDisplayEl.on('click', '.btn.btn-danger.delete', handleDeleteTask);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    printTaskData();

    $('#taskDue').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });

    taskFormEl.on('submit', handleAddTask);
    // taskButtonEl.on('click', handleAddTask);
});
