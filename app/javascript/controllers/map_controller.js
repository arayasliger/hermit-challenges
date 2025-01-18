import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  connect() {
    console.log("Connected to Map")

    this.canvas = this.element;
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    const backgroundImage = new Image();
    backgroundImage.src = this.canvas.dataset.background;

    const coordinatesData = this.canvas.dataset.mapCoordinates;
    this.coordinates = JSON.parse(coordinatesData);

    backgroundImage.onload = () => {
      this.ctx.drawImage(
        backgroundImage,
        -this.canvas.width / 2,
        -this.canvas.height / 2,
        this.canvas.width,
        this.canvas.height
      );

      this.drawCoordinates(this.coordinates);
    }
    
    this.canvas.addEventListener("mousemove", (event) => this.trackMouse(event));
  }

  drawCoordinates(coordinates) {
    this.points = []
    
    coordinates.forEach((coord) => {
      const x = coord.x;
      const y = coord.y;
      const radius = 5;

      this.ctx.beginPath();
      this.ctx.arc(x, -y, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = coord.color;
      this.ctx.fill();

      this.points.push({ x, y, radius, label: coord.label });
    })
  }

  trackMouse(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = Math.round(event.clientX - rect.left);
    const mouseY = Math.round(event.clientY - rect.top);
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    const canvasX = mouseX * scaleX
    const canvasY = mouseY * scaleY

    // Translate to map coordinates
    const translatedX = Math.round(canvasX - this.canvas.width / 2);
    const translatedY = Math.round(-(canvasY - this.canvas.height / 2));

    // Clear
    this.ctx.clearRect(this.canvas.width / 2 - 150, -this.canvas.height / 2, 150, 45);

    // Display coords
    this.ctx.fillStyle = "black";
    this.ctx.font = "14px Arial";
    this.ctx.textAlign = "right";
    this.ctx.fillText(`X: ${translatedX}, Y: ${translatedY}`, this.canvas.width / 2 - 10, -this.canvas.height / 2 + 20);
    this.ctx.fillText(`X: ${mouseX}, Y: ${mouseY}`, this.canvas.width / 2 - 10, -this.canvas.height / 2 + 40);

    const hoveredPoint = this.points.find((point) => {
      const distance = Math.sqrt((translatedX - point.x) ** 2 + (translatedY - point.y) ** 2);
      return distance <= point.radius;
    });

    if (hoveredPoint) {
      this.showTooltip(hoveredPoint, mouseX, mouseY);
    } else {
      this.hideTooltip();
    };

    this.canvas.addEventListener("click", (event) => this.addPoint(translatedX, translatedY));
  }

  showTooltip(point, x, y) {
    const tooltip = document.getElementById("map-tooltip");

    tooltip.style.display = "block";
    tooltip.style.left = `${x - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${y - 40 }px`;
    tooltip.textContent = `${point.label}, X: ${point.x}, Y: ${point.y}`;
  }

  hideTooltip() {
    const tooltip = document.getElementById("map-tooltip");
    tooltip.style.display = "none";
  }

  addPoint(x, y) {
    const modalController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller='modal']"),
      "modal"
    );

    const addModal = modalController.addModalTarget;
    const inputX = addModal.querySelector("#x-coord");
    const inputY = addModal.querySelector("#y-coord");

    inputX.value = x;
    inputY.value = y;

    modalController.show({
      preventDefault: () => {},
      target: {
        dataset: { modal: "addModal" },
      },
    });
  };
}
