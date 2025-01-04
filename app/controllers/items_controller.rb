class ItemsController < ApplicationController
  def create
    list = List.first
    item = list.items.new(item_params)

    if item.save
      ActionCable.server.broadcast("todo_channel", { list_item: item_render(item) })
    end
  end

  def update
  end

  def destroy
    @item = Item.find(params[:id])
    if @item.destroy
      ActionCable.server.broadcast("todo_channel", { action: "delete", id: @item.id })
    end
  end

  private

  def item_params
    params.require(:item).permit(:item)
  end

  def item_render(item)
    render_to_string(partial: "items/item", locals: { item: item })
  end
end
