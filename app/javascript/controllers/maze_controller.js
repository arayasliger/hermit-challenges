import { Controller } from "@hotwired/stimulus"

class Player {
  constructor(row, col, maze, color="red", parent = null) {
    this.row = row;
    this.col = col;
    this.maze = maze;
    this.ctx = maze.ctx;
    this.color = color;
    this.parent = parent;
    this.children = new Set();
    
    this.previousPosition = parent ? { row: parent.row, col: parent.col } : null;

    if (this.color === "blue") {
      this.spawnPoint = { row, col };
      this.maze.ghosts.push(this);
      if (parent) parent.children.add(this);
    }
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
        this.col * this.maze.cellSize + 2,
        this.row * this.maze.cellSize + 2,
        this.maze.cellSize - 4,
        this.maze.cellSize - 4
    );
  }

  move() {
    if (this.color == "red" && this.isExit()) {
      console.log("Winner!");
      return;
    }

    let paths = this.maze.getAvailablePaths(this.row, this.col, this.previousPosition);

    if (paths.length == 0) {
      this.despawn();
      return;
    }

    if (paths.length > 1) {
      this.spawn(paths)
      return;
    }

    let nextMove = paths[0];
    this.previousPosition = { row: this.row, col: this.col }
    this.row = nextMove.row;
    this.col = nextMove.col;
    this.maze.draw();
    this.draw();

    setTimeout(() => this.move(), 200);
  }

  isExit() {
    return this.row === this.maze.grid.length - 1 && this.col === this.maze.grid[0].length - 2;
  }

  spawn(paths) {
    paths.forEach(path => {
      const ghost = new Player(path.row, path.col, this.maze, "blue", this);
      ghost.draw();
      setTimeout(() => ghost.move(), 200);
    });
  }

  despawn() {    
    if (this.color === "red") return;
    if (this.isExit()) return;

    this.maze.ghosts = this.maze.ghosts.filter(g => g !== this);
    
    if (this.parent) {
      this.parent.children.delete(this);
      
      if (this.parent.children.size === 0) {
        
        if (this.parent.spawnPoint) {
          this.maze.markExplored(this.parent.spawnPoint.row, this.parent.spawnPoint.col);
        }

        this.parent.despawn();
      }
    }

    if (this.spawnPoint) {
      this.maze.markExplored(this.spawnPoint.row, this.spawnPoint.col);
    }

    this.maze.checkRedMovement();
  }
}

class Maze {
  constructor(ctx, cellSize) {
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.grid = [];
    this.ghosts = [];
    this.redPlayer = null;
    this.exploredPaths = new Set();
  }

  setGrid(grid){
    this.grid = grid;
  }

  setRedPlayer(player) {
    this.redPlayer = player;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        this.ctx.fillStyle = this.grid[row][col] === "◼️ " ? "black" : "white";
        this.ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  
    this.ghosts.forEach(ghost => ghost.draw());
    if (this.redPlayer) this.redPlayer.draw();
  }

  getAvailablePaths(row, col, previousPosition = null) {
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
    ];

    return directions
      .map(dir => ({ row: row + dir.row, col: col + dir.col }))
      .filter(pos =>
        this.grid[pos.row] && this.grid[pos.row][pos.col] === "◻️ " &&
        !this.exploredPaths.has(`${pos.row},${pos.col}`) &&
        (!previousPosition || previousPosition.row !== pos.row || previousPosition.col !== pos.col)
      );
  }

  markExplored(row, col) {
    this.exploredPaths.add(`${row},${col}`);
  }

  isExplored(row, col) {
    return this.exploredPaths.has(`${row},${col}`);
  }

  checkRedMovement() {
    let availablePaths = this.getAvailablePaths(this.redPlayer.row, this.redPlayer.col, this.redPlayer.previousPosition);

    if (availablePaths.length === 1) {
      this.redPlayer.move();
    } else {
    }
  }
}


// Connects to data-controller="maze"
export default class extends Controller {
  connect() {
    this.setupCanvas();
    this.fetchMaze();
    
    // this.handleKeyPress = this.handleKeyPress.bind(this);
    // document.addEventListener("keydown", this.handleKeyPress);
  }
  
  setupCanvas() {
    this.canvas = this.element;
    this.ctx = this.canvas.getContext("2d");
    this.cellSize = 15;
    this.maze = new Maze(this.ctx, this.cellSize);
  }

  async fetchMaze() {
    const response = await fetch("/maze.json");
    const data = await response.json();
    
    this.maze.setGrid(data.maze);
    this.canvas.width = data.maze.length * this.cellSize;
    this.canvas.height = data.maze.length * this.cellSize;

    this.maze.draw();

    this.player = new Player(0, 1, this.maze);
    this.maze.setRedPlayer(this.player);
    this.player.draw();
    this.player.move();
  }

  // handleKeyPress(event) {
  //   const directions = {
  //     ArrowUp: { row: -1, col: 0 },
  //     ArrowDown: { row: 1, col: 0 },
  //     ArrowLeft: { row: 0, col: -1 },
  //     ArrowRight: { row: 0, col: 1 },
  //   };

  //   const move = directions[event.key];

  //   if (move) {
  //     const newRow = this.player.row + move.row;
  //     const newCol = this.player.col + move.col;

  //     if (this.mazeGrid[newRow] && this.mazeGrid[newRow][newCol] === "◻️ ") {
  //       this.player.row = newRow;
  //       this.player.col = newCol;
  //       this.drawMaze();

  //       if (this.player.row === this.mazeGrid.length - 1 && this.player.col === this.mazeGrid.length - 2) {
  //         console.log("winner!!");
  //         this.fetchMaze();
  //       }
  //     }
  //   }
  // }
}
