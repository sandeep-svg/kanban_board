# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_04_16_141503) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "board_events", force: :cascade do |t|
    t.integer "card_id"
    t.string "card_title"
    t.datetime "created_at", null: false
    t.string "event_type"
    t.integer "from_column"
    t.float "from_position"
    t.json "metadata"
    t.integer "to_column"
    t.float "to_position"
    t.datetime "updated_at", null: false
    t.index ["card_id", "created_at"], name: "index_board_events_on_card_id_and_created_at"
    t.index ["created_at"], name: "index_board_events_on_created_at"
  end

  create_table "cards", force: :cascade do |t|
    t.integer "column", default: 0
    t.datetime "created_at", null: false
    t.text "description"
    t.float "position", default: 0.0
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["column", "position"], name: "index_cards_on_column_and_position"
  end
end
