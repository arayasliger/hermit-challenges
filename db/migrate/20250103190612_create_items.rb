class CreateItems < ActiveRecord::Migration[8.0]
  def change
    create_table :items do |t|
      t.text "item"
      t.integer "list_id"
      t.timestamps
    end
  end
end
