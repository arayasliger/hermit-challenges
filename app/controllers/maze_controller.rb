class MazeController < ApplicationController
  def show
    size = 35
    maze = Maze.new(size)

    respond_to do |format|
      format.html
      format.json { render json: { maze: maze.grid.map { |row| row.map(&:to_s) } } }
    end
  end
end
