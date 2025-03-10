class Todo {
  constructor(text) {
    this.text = text;
    this.id = Date.now();
  }
}

class PrioritizedTodo extends Todo {
  constructor(text, priority) {
    super(text);
    this.priority = priority;
  }
}

class TodoApp {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos") || "[]");
    this.container = document.querySelector(".todo-container");
    this.input = document.querySelector("#todo-input");
    this.priority = document.querySelector("#priority-input");
    this.addButton = document.querySelector("#add-button");
    this.addButton.addEventListener("click", () => this.addTodo());

    this.list = document.querySelector("#todo-list");
  }

  addTodo() {
    const text = this.input.value.trim();
    const priority = parseInt(this.priority.value);
    const errors = [];

    if (text === "") {
      errors.push("Feladat neve");
    }

    if (priority < 1 || priority > 5) {
      errors.push("Prio hibás (1 és 5 között kell lennie)");
    }

    if (errors.length > 0) {
      const errs = errors.join(",");
      alert(`Az alábbi érték(ek) hiányosak: ${errs}`);
      return;
    }

    const todo = new PrioritizedTodo(text, priority);

    this.todos.push(todo);
    this.render();
    this.input.value = "";
    this.priority.value = "";
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.render();
  }
  render() {
    this.list.innerHTML = "";
    this.todos.forEach((todo) => {
      const li = document.createElement("li");
      li.innerText = `${todo.text} ${
        todo.priority ? `(Prio: ${todo.priority})` : ""
      }`;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("button");
      deleteButton.innerText = "❌";
      deleteButton.addEventListener("click", () => this.deleteTodo(todo.id));

      li.appendChild(deleteButton);
      this.list.appendChild(li);
    });
  }
}

new TodoApp();
