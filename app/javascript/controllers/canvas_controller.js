import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("CanvasController connected!");
    
    this.canvas = this.element;
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 512;
    this.canvas.height = 512;

    this.isDrawing = false;
    this.currentColor = "black";
    this.currentSize = 16;

    this.canvas.addEventListener("mousedown", () => (this.isDrawing = true));
    this.canvas.addEventListener("mouseup", () => (this.isDrawing = false));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("click", this.draw.bind(this));
  }

  updateColor(color) {
    this.currentColor = color;
    console.log(`Color updated to: ${this.currentColor}`);
  }

  updateSize(size) {
    this.currentSize = size;
    console.log(`Pixel size updated to: ${this.currentSize}`);
  }
  
  draw(event) {
    if (!this.isDrawing && event.type !== "click") return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let gridSize = this.currentSize;
    const newX = Math.floor(x / gridSize) * gridSize;
    const newY = Math.floor(y / gridSize) * gridSize;
    
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fillRect(newX, newY, gridSize, gridSize);
  }
}
