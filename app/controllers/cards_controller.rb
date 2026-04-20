class CardsController < ApplicationController
  def create
    card = Card.new(card_params)

    max_position = Card.where(column: card.column).maximum(:position) || 0
    card.position = max_position + 10

    if card.save
      render json: { success: true, card: card_as_json(card) }
    else
      render json: { success: false, errors: card.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    card = Card.find(params[:id])

    if card.update(card_params)
      render json: { success: true, card: card_as_json(card) }
    else
      render json: { success: false, errors: card.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    card = Card.find(params[:id])
    card.destroy

    render json: { success: true }
  end

  def move
    card = Card.find(params[:id])
    new_column = params[:card][:column].to_i
    new_position = params[:card][:position].to_f

    card.update!(column: new_column, position: new_position)

    render json: { success: true, card: card_as_json(card) }
  end

  def history
    at_time = Time.zone.parse(params[:timestamp]) if params[:timestamp].present?
    at_time ||= Time.current

    historical_cards = BoardEvent.reconstruct_board_state(at_time: at_time)
    current_cards = Card.pluck(:id, :description).to_h

    cards = historical_cards.map do |card|
      card[:description] ||= current_cards[card[:id]]
      card
    end

    render json: {
      cards: cards,
      timestamp: at_time.iso8601
    }
  end

  def events
    from_time = Time.zone.parse(params[:from]) if params[:from].present?
    from_time ||= 24.hours.ago

    events = BoardEvent.where("created_at > ?", from_time)
                       .order(created_at: :desc)
                       .limit(100)
                       .map { |e|
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

    render json: { events: events }
  end

  def time_range
    earliest = BoardEvent.minimum(:created_at)
    render json: {
      earliest: earliest&.iso8601,
      latest: Time.current.iso8601
    }
  end

  private

  def card_params
    params.require(:card).permit(:title, :description, :column, :position)
  end

  def card_as_json(card)
    {
      id: card.id,
      title: card.title,
      description: card.description,
      column: card.column,
      position: card.position,
      created_at: card.created_at,
      updated_at: card.updated_at
    }
  end
end
