class CoordinatesController < ApplicationController
  def create
    @coord = Coordinate.new(coordinate_params)
    if @coord.save
      redirect_to map_path
    end
  end

  def update
    @coord = Coordinate.find(params[:id])
    if @coord.update(coordinate_params)
      redirect_to map_path
    end
  end

  def destroy
    @coord = Coordinate.find(params[:id])
    @coord.destroy
    redirect_to map_path
  end

  private

  def coordinate_params
    params.require(:coordinate).permit(:label, :x, :y)
  end
end
