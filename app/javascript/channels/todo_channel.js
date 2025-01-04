import consumer from "channels/consumer"

consumer.subscriptions.create("TodoChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    $('#todo-list').append(data.list_item);

    if (data.action === "delete") {
      $(`#item-${data.id}`).remove(); // Remove the item from the DOM
    }
  }
});

$('#todo-list').on('click', '.eraser.link.icon', function () {
  const itemId = $(this).data('id'); // Get the item's ID

  // Send DELETE request to the backend
  fetch(`/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      "Content-Type": "application/json",
    },
  });

  // Remove the item from the DOM
  $(`#item-${itemId}`).remove();
});

