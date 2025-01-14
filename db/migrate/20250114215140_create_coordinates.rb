class CreateCoordinates < ActiveRecord::Migration[8.0]
  def change
    create_table :coordinates do |t|
      t.string :label
      t.integer :x
      t.integer :y
      t.timestamps
    end
  end
end
