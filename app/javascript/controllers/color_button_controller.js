import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="color-button"
export default class extends Controller {
  static values = { color : String };
  
  connect() {
    console.log(`ButtonController connected for color: ${this.colorValue}`);
  }

  selectColor(event) {
    const canvasController = this.getCanvasController();
    if (canvasController) {
      canvasController.updateColor(this.colorValue);
    } else {
      console.error("CanvasController not found!");
    }
  }

  getCanvasController() {
    // Use Stimulus's internal API to find the CanvasController
    const canvasElement = document.querySelector("[data-controller='canvas']");
    if (canvasElement) {
      return this.application.getControllerForElementAndIdentifier(canvasElement, "canvas");
    }
    return null;
  }
}
