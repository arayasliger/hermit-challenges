class ItemsController < ApplicationController
  before_action :set_item, only: [ :update, :destroy ]
  def create
    list = List.first
    item = list.items.new(item_params)

    if item.save
      ActionCable.server.broadcast("todo_channel", { list_item: item_render(item) })
    end
  end

  def update
    if @item.update(item_params)
      ActionCable.server.broadcast("todo_channel", { action: "update", id: @item.id, content: @item.item })
      head :ok
    end
  end

  def destroy
    if @item.destroy
      ActionCable.server.broadcast("todo_channel", { action: "delete", id: @item.id })
    end
  end

  private

  def set_item
    @item = Item.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:item)
  end

  def item_render(item)
    render_to_string(partial: "items/item", locals: { item: item })
  end
end
