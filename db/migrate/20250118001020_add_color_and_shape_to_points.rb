class AddColorAndShapeToPoints < ActiveRecord::Migration[8.0]
  def change
    add_column :coordinates, :color, :string
    add_column :coordinates, :shape, :string
  end
end
