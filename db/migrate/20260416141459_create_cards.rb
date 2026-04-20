class CreateCards < ActiveRecord::Migration[8.1]
  def change
    create_table :cards do |t|
      t.string :title
      t.text :description
      t.integer :column, default: 0
      t.float :position, default: 0

      t.timestamps
    end

    add_index :cards, [:column, :position]
  end
end
