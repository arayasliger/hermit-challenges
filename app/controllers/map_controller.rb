class MapController < ApplicationController
  def index
    @coords = Coordinate.all
  end
end
