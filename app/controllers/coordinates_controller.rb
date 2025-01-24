class CoordinatesController < ApplicationController
  def create
    @coord = Coordinate.new(coordinate_params)

    @coord.color = "black" if @coord.color.blank?
    @coord.shape = "circle" if @coord.shape.blank?

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
    params.require(:coordinate).permit(:label, :x, :y, :color, :shape)
  end
end
