import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  connect() {
    this.canvas = this.element;
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    const backgroundImage = new Image();
    backgroundImage.src = this.canvas.dataset.background;

    const coordinatesData = this.canvas.dataset.mapCoordinates;
    this.coordinates = JSON.parse(coordinatesData);

    this.offsetX = 0;
    this.offsetY = 0;

    this.startPoint = null;

    backgroundImage.onload = () => {
      // this.ctx.drawImage(
      //   backgroundImage,
      //   -this.canvas.width / 2,
      //   -this.canvas.height / 2,
      //   this.canvas.width,
      //   this.canvas.height
      // );

      this.drawCoordinates(this.coordinates);
    }
    
    this.canvas.addEventListener("mousemove", (event) => this.trackMouse(event));
    this.canvas.addEventListener("click", (event) => this.handleClick(event));
  }

  drawCoordinates(coordinates) {
    this.points = []
    
    coordinates.forEach((coord) => {
      const x = coord.x + this.offsetX;
      const y = coord.y + this.offsetY;
      const radius = 5;
      const shape = coord.shape;

      this.ctx.fillStyle = coord.color;
      
      switch (shape) {
        case "circle":
          this.drawCircle(x, y, radius);
          break;

        case "square":
          this.drawSquare(x, y, radius);
          break;

        case "star":
          this.drawStar(x, y, radius, 5, 2, 1.5);
          break;
      }

      this.points.push({ x: coord.x, y: coord.y, radius, label: coord.label });
    })
  }

  drawCircle(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.arc(x, -y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  drawSquare(x, y, radius) {
    const size = radius * 2; // Square's side length
    this.ctx.beginPath();
    this.ctx.rect(x - radius, -y - radius, size, size); // Centered square
    this.ctx.fill();
  }
  
  drawStar(x, y, radius, points, inset, scale) {
    this.ctx.beginPath();
    const step = Math.PI / points;
    const outerRadius = radius * scale;
    const innerRadius = (radius/inset) * scale
    let angle = -Math.PI / 2;
    let i = 0;
  
    while (i < points * 2) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const px = x + r * Math.cos(angle);
      const py = -y + r * Math.sin(angle);

      this.ctx.lineTo(px, py);
      angle += step;
      i++;
    }
  
    this.ctx.closePath();
    this.ctx.fill();
  }

  focusPoint (x, y) {
    this.offsetX = -x;
    this.offsetY = -y;

    this.redrawCanvas();
  }

  redrawCanvas() {
    this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
    
    if (this.lines) {
      this.lines.forEach((line) => {
        this.ctx.beginPath();
        this.ctx.moveTo(line.aX + this.offsetX, -line.aY - this.offsetY);
        this.ctx.lineTo(line.bX + this.offsetX, -line.bY - this.offsetY);
        this.ctx.strokeStyle = "gray";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
      });
    }
    
    this.drawCoordinates(this.coordinates);
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
    const translatedX = Math.round(canvasX - this.canvas.width / 2) - this.offsetX;
    const translatedY = Math.round(-(canvasY - this.canvas.height / 2)) - this.offsetY;

    // Clear corner
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
  }

  showTooltip(point, x, y) {
    const tooltip = document.getElementById("map-tooltip");

    tooltip.style.display = "block";
    tooltip.style.left = `${x - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${y - 40}px`;
    tooltip.textContent = `${point.label}, X: ${point.x}, Y: ${point.y}`;
  }

  hideTooltip() {
    const tooltip = document.getElementById("map-tooltip");
    tooltip.style.display = "none";
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
  
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const canvasX = mouseX * scaleX;
    const canvasY = mouseY * scaleY;
  
    const translatedX = Math.round(canvasX - this.canvas.width / 2) - this.offsetX;
    const translatedY = Math.round(-(canvasY - this.canvas.height / 2)) - this.offsetY;
  
    const hoveredPoint = this.points.find((point) => {
      const distance = Math.sqrt((translatedX - point.x) ** 2 + (translatedY - point.y) ** 2);
      return distance <= point.radius;
    });
  
    if (hoveredPoint) {
      this.handlePointSelection(hoveredPoint);
    } else {
      this.addPoint(translatedX, translatedY);
    }
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

  handlePointSelection (point) {
    if (!this.startPoint) {
      this.startPoint = point;
    } else {
      this.drawLine(this.startPoint, point);
      this.startPoint = null;
    }
  }

  drawLine(pointA, pointB) {
    if (!this.lines) {
      this.lines = [];
    }

    this.lines.push({ aX: pointA.x, aY: pointA.y, bX: pointB.x, bY: pointB.y });

    this.ctx.beginPath();
    this.ctx.moveTo(pointA.x + this.offsetX, -pointA.y - this.offsetY);
    this.ctx.lineTo(pointB.x + this.offsetX, -pointB.y - this.offsetY);
    this.ctx.strokeStyle = "gray"
    this.ctx.lineWidth = 1
    this.ctx.stroke();
    this.ctx.closePath();

    console.log(this.lines)
  }
}
