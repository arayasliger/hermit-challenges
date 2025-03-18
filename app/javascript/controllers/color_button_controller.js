import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { color: String, size: Number };
  
  connect() {
  }

  selectColor(event) {
    const canvasController = this.getCanvasController();
    canvasController.updateColor(this.colorValue);
  }

  selectSize(event) {
    const canvasController = this.getCanvasController();
    
    const size = event.target.value;
    this.element.dataset.colorButtonSizeValue = size;
    
    canvasController.updateSize(size);
  }

  getCanvasController() {
    const canvasElement = document.querySelector("[data-controller='canvas']");
    if (canvasElement) {
      return this.application.getControllerForElementAndIdentifier(canvasElement, "canvas");
    }
    return null;
  }
}
