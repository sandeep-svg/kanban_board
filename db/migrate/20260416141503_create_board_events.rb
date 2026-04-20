class CreateBoardEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :board_events do |t|
      t.string :event_type
      t.integer :card_id
      t.string :card_title
      t.integer :from_column
      t.integer :to_column
      t.float :from_position
      t.float :to_position
      t.json :metadata

      t.timestamps
    end

    add_index :board_events, :created_at
    add_index :board_events, [:card_id, :created_at]
  end
end
