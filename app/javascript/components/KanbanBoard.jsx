import React from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import KanbanCard from './KanbanCard'
import CardModal from './CardModal'
import { useState } from 'react'

export default function KanbanBoard({
  cards,
  columns,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  isTimeTravel
}) {
  const [editingCard, setEditingCard] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const columnOrder = Object.entries(columns).map(([id, name]) => ({
    id: parseInt(id),
    name
  }))

  const getCardsByColumn = (columnId) => {
    return cards
      .filter(card => card.column === columnId)
      .sort((a, b) => a.position - b.position)
  }

  const handleDragEnd = (result) => {
    if (!result.destination || isTimeTravel) return

    const { draggableId, source, destination } = result

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    onMoveCard(
      parseInt(draggableId),
      parseInt(source.droppableId),
      parseInt(destination.droppableId),
      source.index,
      destination.index
    )
  }

  const handleCardClick = (card) => {
    if (!isTimeTravel) {
      setEditingCard(card)
      setShowModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCard(null)
  }

  const handleSaveCard = (updates) => {
    if (editingCard) {
      onUpdateCard(editingCard.id, updates)
    }
    handleCloseModal()
  }

  const handleAddCard = (columnId) => {
    if (!isTimeTravel) {
      onCreateCard(columnId)
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-2 pb-2 overflow-x-auto">
          {columnOrder.map((column) => (
            <div
              key={column.id}
              className="flex-1 min-w-[180px] max-w-[280px] bg-board-column rounded-lg flex flex-col max-h-[calc(100vh-220px)]"
            >
              <div className="px-4 py-3 bg-board-column-header rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-700">{column.name}</h2>
                  <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {getCardsByColumn(column.id).length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id.toString()}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 overflow-y-auto min-h-[100px] ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    {getCardsByColumn(column.id).map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id.toString()}
                        index={index}
                        isDragDisabled={isTimeTravel}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'opacity-75' : ''}
                          >
                            <KanbanCard
                              card={card}
                              onClick={() => handleCardClick(card)}
                              onDelete={() => onDeleteCard(card.id)}
                              isDragging={snapshot.isDragging}
                              isTimeTravel={isTimeTravel}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {!isTimeTravel && (
                      <button
                        onClick={() => handleAddCard(column.id)}
                        className="w-full mt-2 p-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Card
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <CardModal
          card={editingCard}
          onSave={handleSaveCard}
          onClose={handleCloseModal}
          onDelete={editingCard ? () => { onDeleteCard(editingCard.id); handleCloseModal(); } : null}
        />
      )}
    </>
  )
}
