class Card < ApplicationRecord
  COLUMN_NAMES = {
    0 => "Backlog",
    1 => "To Do",
    2 => "In Progress",
    3 => "In Review",
    4 => "Done"
  }.freeze

  validates :title, presence: true
  validates :column, inclusion: { in: 0..4 }
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:column, :position) }

  after_create :record_creation
  after_update :record_changes
  after_destroy :record_deletion

  def column_name
    COLUMN_NAMES[column]
  end

  private

  def record_creation
    BoardEvent.create(
      event_type: "card_created",
      card_id: id,
      card_title: title,
      to_column: column,
      to_position: position,
      metadata: { description: description }
    )
  end

  def record_changes
    changes_to_record = saved_changes.slice(:title, :description, :column, :position)
    return if changes_to_record.empty?

    event_type = "card_updated"
    if changes_to_record.key?(:column)
      event_type = "card_moved"
    end

    attrs = {
      event_type: event_type,
      card_id: id,
      card_title: title,
      metadata: { description: description, position: position, column: column }
    }

    if changes_to_record.key?(:column)
      attrs[:from_column] = column_before_last_save
      attrs[:to_column] = column
    end

    if changes_to_record.key?(:position)
      attrs[:from_position] = position_before_last_save
      attrs[:to_position] = position
    end

    BoardEvent.create!(attrs)
  end

  def record_deletion
    BoardEvent.create!(
      event_type: "card_deleted",
      card_id: id,
      card_title: title,
      from_column: column,
      from_position: position
    )
  end
end
