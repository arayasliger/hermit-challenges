import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="coordinates"
export default class extends Controller {
  connect() {
  }

  focusPoint(event) {
    event.preventDefault();

    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);

    const mapController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller='map']"),
      "map"
    );

    mapController.focusPoint(x, y);
  }
}
