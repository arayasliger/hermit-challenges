import consumer from "channels/consumer"

consumer.subscriptions.create("TodoChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    const todoList = document.getElementById("todo-list");
    const newTask = document.createElement("li");
    newTask.textContent = data.task;
    todoList.appendChild(newTask);
  }
});
