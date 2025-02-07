import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="maze"
export default class extends Controller {
  connect() {
    this.setupCanvas();
    this.fetchMaze();
    this.handleKeyPress = this.handleKeyPress.bind(this);
    document.addEventListener("keydown", this.handleKeyPress);
  }

  setupCanvas() {
    this.canvas = this.element;
    this.ctx = this.canvas.getContext("2d");
    this.cellSize = 15;
    this.mazeGrid = [];
  }

  async fetchMaze() {
    const response = await fetch("/maze.json");
    const data = await response.json();
    this.mazeGrid = data.maze;
    this.player = { row: 0, col : 1 };
    this.drawMaze();
  }

  drawMaze() {
    const ctx = this.ctx;
    const cellSize = this.cellSize;
    const size = this.mazeGrid.length;

    this.canvas.width = size * cellSize;
    this.canvas.height = size * cellSize;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        ctx.fillStyle = this.mazeGrid[row][col] === "◼️ " ? "black" : "white";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  
    this.drawPlayer()
  }

  drawPlayer() {
    const ctx = this.ctx;
    const cellSize = this.cellSize;

    ctx.fillStyle = "red";
    ctx.fillRect(
      this.player.col * cellSize + 2,
      this.player.row * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
  }

  handleKeyPress(event) {
    const directions = {
      ArrowUp: { row: -1, col: 0 },
      ArrowDown: { row: 1, col: 0 },
      ArrowLeft: { row: 0, col: -1 },
      ArrowRight: { row: 0, col: 1 },
    };

    const move = directions[event.key];

    if (move) {
      const newRow = this.player.row + move.row;
      const newCol = this.player.col + move.col;

      if (this.mazeGrid[newRow] && this.mazeGrid[newRow][newCol] === "◻️ ") {
        this.player.row = newRow;
        this.player.col = newCol;
        this.drawMaze();

        if (this.player.row === this.mazeGrid.length - 1 && this.player.col === this.mazeGrid.length - 2) {
          console.log("winner!!");
          this.fetchMaze();
        }
      }
    }
  }
}
