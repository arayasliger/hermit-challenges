class ItemsController < ApplicationController
  def create
    list = List.first
    item = list.items.new(item_params)

    if item.save
      ActionCable.server.broadcast("todo_channel", { list_item: item_render(item) })
    else
      render json: { error: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
  end

  def destroy
  end

  private

  def item_params
    params.require(:item).permit(:item)
  end

  def item_render(item)
    render_to_string(partial: "items/item", locals: { item: item })
  end
end
