class Maze
  attr_reader :size, :grid

  def initialize(size)
    @size = size
    @grid = Array.new(@size) { Array.new(@size) { Wall.new } }
    @next_cells = []
    generate
  end

  def display
    @grid.each do |row|
      puts row.map(&:to_s).join
    end
  end

  def generate
    # Select random starting location
    start_row = (1...@size-1).step(2).to_a.sample
    start_col = (1...@size-1).step(2).to_a.sample
    add_path(start_row, start_col)
    display

    while @next_cells.any?
      next_cell = @next_cells.sample
      row, col = next_cell[:row], next_cell[:col]

      if connect_to_maze(row, col)
        add_path(row, col)
        display
      end

      @next_cells.delete(next_cell)
    end

    @grid[0][1] = Path.new
    @grid[@size-1][@size-2] = Path.new
  end

  def add_path(row, col)
    @grid[row][col] = Path.new

    neighbors(row, col).each do |r, c|
      unless @grid[r][c].is_a?(Path) || @next_cells.any? { |cell| cell[:row] == r && cell[:col] == c }
        @next_cells << { row: r, col: c }
      end
    end
  end

  def neighbors(row, col)
    directions = [
      [ -2, 0 ], [ 2, 0 ], [ 0, -2 ], [ 0, 2 ]
    ]

    directions.map { |r, c| [row + r, col + c]}
              .select { |r, c| r.between?(1, @size-2) && c.between?(1, @size-2) }
  end

  def connect_to_maze(row, col)
    # Check for paths
    adjacent_paths = neighbors(row, col).select { |r, c| @grid[r][c].is_a?(Path) }

    if adjacent_paths.any?
      r, c = adjacent_paths.sample
      remove_wall(row, col, r, c)
      true
    else
      false
    end
  end

  def remove_wall(row1, col1, row2, col2)
    row = (row1 + row2) / 2
    col = (col1 + col2) / 2
    @grid[row][col] = Path.new
  end
end

class Path
  def to_s
    "◻️ "
  end
end

class Wall
  def to_s
    "◼️ "
  end
end
