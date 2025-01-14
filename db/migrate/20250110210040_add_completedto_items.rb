class AddCompletedtoItems < ActiveRecord::Migration[8.0]
  def change
    add_column :items, :completed, :boolean, default: false
  end
end
