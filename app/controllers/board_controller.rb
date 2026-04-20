class BoardController < ApplicationController
  def show
    cards = Card.ordered.map { |card|
      {
        id: card.id,
        title: card.title,
        description: card.description,
        column: card.column,
        position: card.position,
        created_at: card.created_at,
        updated_at: card.updated_at
      }
    }

    time_range = BoardEvent.time_range
    recent_events = BoardEvent.chronological.last(100)

    render json: {
      columns: Card::COLUMN_NAMES,
      cards: cards,
      timeRange: {
        earliest: time_range[:earliest]&.iso8601,
        latest: Time.current.iso8601
      },
      recentEvents: recent_events.map { |e|
        {
          id: e.id,
          type: e.event_type,
          cardTitle: e.card_title,
          fromColumn: e.from_column,
          toColumn: e.to_column,
          createdAt: e.created_at.iso8601,
          humanReadable: e.human_readable
        }
      }
    }
  end
end
