import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="canvas"
export default class extends Controller {
  connect() {
    console.log("CanvasController connected!");
    
    this.canvas = this.element;
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 512;
    this.canvas.height = 512;

    this.isDrawing = false;
    this.currentColor = "black";

    this.canvas.addEventListener("mousedown", () => (this.isDrawing = true));
    this.canvas.addEventListener("mouseup", () => (this.isDrawing = false));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("click", this.draw.bind(this));
  }

  updateColor(color) {
    this.currentColor = color;
    console.log(`Canvas color updated to: ${this.currentColor}`);
  }
  
  draw(event) {
    if (!this.isDrawing && event.type !== "click") return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const gridSize = 16;
    const newX = Math.floor(x / gridSize) * gridSize;
    const newY = Math.floor(y / gridSize) * gridSize;
    
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fillRect(newX, newY, gridSize, gridSize);
  }
}
