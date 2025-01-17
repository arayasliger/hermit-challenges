import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class extends Controller {
  static targets = ["addModal", "editModal"];
  
  connect() {
    $(this.addModalTarget).modal({
      detachable: false,
      inverted: true
    });

    $(this.editModalTarget).modal({
      detachable: false,
      inverted: true
    });
  }

  show(event) {
    event.preventDefault();

    const modalType = event.target.dataset.modal;

    if (modalType === "addModal") {
      const addModal = this.addModalTarget;
      $(addModal).modal("show");
    } else if (modalType === "editModal") {
      const editModal = this.editModalTarget;
      $(editModal).modal("show");
    }
  }
}
