class ListController < ApplicationController
  def index
    @item = Item.new
    @items = Item.all
    render json: @items, status: :ok
  end
end
