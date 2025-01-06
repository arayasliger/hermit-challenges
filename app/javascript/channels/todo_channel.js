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

    if (data.action === "update") {
      $(`#item-${data.id} .item-content`).text(data.content);
    }
  }
});

$('#todo-list').on('click', '.eraser.link.icon', function () {
  const itemId = $(this).data('id');

  // Send DELETE request to the backend
  fetch(`/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
      "Content-Type": "application/json",
    },
  });
});

$('#todo-list').on('click', '.edit.link.icon', function () {
  const itemId = $(this).data('id');
  const contentLabel = $(`#item-${itemId} .item-content`);
  const editInput = $(`#item-${itemId} .edit-input`);

  contentLabel.hide();
  editInput.val(contentLabel.text()).show().focus();

  editInput.on('keypress', function (e) {
    if (e.which === 13) {
      const updatedContent = $(this).val();
      
      // Send update to backend
      fetch(`/items/${itemId}`, {
        method: "PUT",
        headers: {
          "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: { item: updatedContent } }),
      });
    
      // Hide the input field and update the content in the DOM
      contentLabel.text(updatedContent).show();
      editInput.hide();
    }
  });

  // Cancel editting by clicking out of input field
  editInput.on('blur', function() {
    contentLabel.show();
    editInput.hide();
  });
});