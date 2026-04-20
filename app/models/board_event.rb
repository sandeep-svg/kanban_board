class BoardEvent < ApplicationRecord
  validates :event_type, presence: true

  scope :chronological, -> { order(:created_at, :id) }

  def self.reconstruct_board_state(at_time:)
    cards = {}

    events = where("created_at <= ?", at_time).order(:created_at, :id)

    events.each do |event|
      case event.event_type
      when "card_created"
        new_column = event.to_column || event.metadata&.dig("column")
        new_position = event.to_position || event.metadata&.dig("position")
        cards[event.card_id] = {
          id: event.card_id,
          title: event.card_title,
          description: event.metadata&.dig("description"),
          column: new_column,
          position: new_position,
          created_at: event.created_at
        }
      when "card_updated"
        if cards[event.card_id]
          cards[event.card_id][:title] = event.card_title
          cards[event.card_id][:description] = event.metadata&.dig("description")
          cards[event.card_id][:position] = event.metadata&.dig("position") if event.metadata&.dig("position")
          cards[event.card_id][:column] = event.metadata&.dig("column") if event.metadata&.dig("column")
        end
      when "card_moved"
        if cards[event.card_id]
          new_column = event.to_column || event.metadata&.dig("column")
          new_position = event.to_position || event.metadata&.dig("position")
          cards[event.card_id][:column] = new_column if new_column
          cards[event.card_id][:position] = new_position if new_position
        end
      when "card_deleted"
        cards.delete(event.card_id)
      end
    end

    cards.values.sort_by { |c| [ c[:column] || 0, c[:position] || 0 ] }
  end

  def self.time_range
    { earliest: minimum(:created_at), latest: maximum(:created_at) }
  end

  def human_readable
    case event_type
    when "card_created"
      "Card '#{card_title}' created"
    when "card_updated"
      "Card '#{card_title}' updated"
    when "card_moved"
      from = Card::COLUMN_NAMES[from_column]
      to = Card::COLUMN_NAMES[to_column]
      "Card '#{card_title}' moved from #{from} to #{to}"
    when "card_deleted"
      "Card '#{card_title}' deleted"
    end
  end
end
