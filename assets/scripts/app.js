const input = document.getElementById('new-task');
const addTask = document.getElementById('add-button');
const clrAllActiveBtn = document.getElementById('active-projects-btn');
const clrAllFinishedBtn = document.getElementById('finished-projects-btn');

function clearInput() {
  input.value = '';
}

function createNewTask() {
  const taskInput = document.getElementById('new-task').value;
  const tasksList = document.getElementById('active-projects-list');

  if (taskInput.trim() === '') {
    return;
  }

  const newTask = {
    info: taskInput,
    id: Math.random()
  }
  const taskEl = document.createElement('li');
  taskEl.classList.add('active-projects');
  taskEl.classList.add('card');
  taskEl.setAttribute('id', newTask.id);
  taskEl.innerHTML = `<p>${taskInput}</p>
    <button id="switchBtn">Finish</button>`;
  tasksList.append(taskEl);

  clearInput();
}

function clearAll(type) {
  const tasksItems = document.querySelectorAll(`#${type}-projects li`);
  for (const tskItem of tasksItems) {
    tskItem.remove();
  }
  console.log('Button clicked!');
}

class DOMHelper {
static clearEventListeners(element) {
  const clonedElement = element.cloneNode(true);
  element.replaceWith(clonedElement);
  return clonedElement;
}

  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
  }
}

class TaskItem {
  constructor(id, updateTasksListFunction, type) {
    this.id = id;
    this.updateTasksListHandler = updateTasksListFunction;
    this.connectSwitchButton(type);
  }

  connectSwitchButton(type) {
    const taskItemElement = document.getElementById(this.id);
    let switchBtn = taskItemElement.querySelector('button');
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
    switchBtn.addEventListener('click', this.updateTasksListHandler.bind(null, this.id));
  }

  update(updateTasksListFn, type) {
    this.updateTasksListHandler = updateTasksListFn;
    this.connectSwitchButton(type);
  }
}

class TaskList {
  tasks = [];

  constructor(type) {
    this.type = type;
    const tasksItems = document.querySelectorAll(`#${type}-projects li`);
    for (const tskItems of tasksItems) {
      this.tasks.push(new TaskItem(tskItems.id, this.switchTask.bind(this), this.type))
    }
    console.log(this.tasks);
  }

  setSwitchHandlerFunction(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }

  addTask(task) {
    this.tasks.push(task);
    DOMHelper.moveElement(task.id, `#${this.type}-projects ul`);
    task.update(this.switchTask.bind(this), this.type);
  }

  switchTask(taskId) {
    this.switchHandler(this.tasks.find(t => t.id === taskId));
    this.tasks = this.tasks.filter(t => t.id !== taskId);
  }
}

class App {
  static init() {
    const activeTasksList = new TaskList('active');
    const finishedTasksList = new TaskList('finished');
    activeTasksList.setSwitchHandlerFunction(finishedTasksList.addTask.bind(finishedTasksList));
    finishedTasksList.setSwitchHandlerFunction(activeTasksList.addTask.bind(activeTasksList));
  }
}

function onClick() {
  createNewTask();
  App.init();
}

addTask.addEventListener('click', onClick);
input.addEventListener('keyup', (keypressed) => {
  if (keypressed.keyCode === 13) {
    onClick();
  }
});

clrAllActiveBtn.addEventListener('click', () => {
  clearAll('active');
});
clrAllFinishedBtn.addEventListener('click', () => {
  clearAll('finished');
});