import React from 'react'

export default function KanbanCard({ card, onClick, onDelete, isDragging, isTimeTravel }) {
  const handleDelete = (e) => {
    e.stopPropagation()
    if (!isTimeTravel) {
      onDelete()
    }
  }

  return (
    <div
      className={`bg-board-card-bg border border-board-card-border rounded-lg p-3 mb-2 cursor-pointer
        ${isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-sm hover:shadow-md'}
        ${isTimeTravel ? 'cursor-default' : 'hover:border-blue-300'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium text-gray-900 text-sm break-words">{card.title}</h3>
        {!isTimeTravel && (
          <button
            onClick={handleDelete}
            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {card.description && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{card.description}</p>
      )}
      {card.created_at && (
        <p className="mt-2 text-xs text-gray-400">
          {new Date(card.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
