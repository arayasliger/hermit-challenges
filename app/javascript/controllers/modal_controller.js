import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class extends Controller {
  static targets = ["modal"];
  
  connect() {
    $(this.modalTarget).modal({
      detachable: false,
      inverted: true
    });
  }

  show() {
    $(this.modalTarget).modal("show");
  }
}
