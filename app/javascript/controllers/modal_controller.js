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
      this.initializeShapeSelector(addModal);
      $(addModal).modal("show");
    } else if (modalType === "editModal") {
      const editModal = this.editModalTarget;
      this.initializeShapeSelector(editModal);
      $(editModal).modal("show");
    }
  }

  clearCoordinates() {
    const xField = this.addModalTarget.querySelector("#x-coord");
    const yField = this.addModalTarget.querySelector("#y-coord");

    if (xField) xField.value = "";
    if (yField) yField.value = "";
  }

  initializeShapeSelector(modal) {
    const shapeInput = modal.querySelector("#shape-input");
    
    modal.querySelector("#shape-selector").addEventListener("click", (event) => {
      const button = event.target.closest(".ui.button");
      if (button) {
        shapeInput.value = button.dataset.shape;
      }
    });
  }
}
