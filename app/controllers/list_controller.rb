class ListController < ApplicationController
  def index
    @item = Item.new
    @items = Item.all
  end
end
