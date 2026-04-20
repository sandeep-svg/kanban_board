import React, { useState, useEffect, useCallback } from 'react'
import KanbanBoard from '../../components/KanbanBoard'
import TimelineSlider from '../../components/TimelineSlider'
import ActivityLog from '../../components/ActivityLog'

export default function BoardApp() {
  const [cards, setCards] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [isTimeTravel, setIsTimeTravel] = useState(false)
  const [historyTimestamp, setHistoryTimestamp] = useState(null)
  const [timeRange, setTimeRange] = useState({ earliest: null, latest: null })
  const [showActivityLog, setShowActivityLog] = useState(false)

  const columns = {
    0: "Backlog",
    1: "To Do",
    2: "In Progress",
    3: "In Review",
    4: "Done"
  }

  useEffect(() => {
    fetchBoardState()
  }, [])

  const fetchBoardState = useCallback(async () => {
    try {
      const [eventsRes, historyRes, timeRangeRes] = await Promise.all([
        fetch('/board/events'),
        fetch('/board/history'),
        fetch('/board/time_range')
      ])
      const eventsData = await eventsRes.json()
      const historyData = await historyRes.json()
      const timeRangeData = await timeRangeRes.json()

      setCards(historyData.cards || [])
      setRecentEvents(eventsData.events || [])
      setTimeRange(timeRangeData)
    } catch (error) {
      console.error('Failed to fetch board state:', error)
    }
  }, [])

  const handleCreateCard = async (column) => {
    const title = prompt('Enter card title:')
    if (!title) return

    const description = prompt('Enter card description (optional):')

    try {
      const response = await fetch('/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card: { title, description: description || '', column, position: 0 }
        })
      })
      const data = await response.json()
      if (data.success) {
        fetchBoardState()
      }
    } catch (error) {
      console.error('Failed to create card:', error)
    }
  }

  const handleUpdateCard = async (cardId, updates) => {
    try {
      const response = await fetch(`/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card: updates })
      })
      const data = await response.json()
      if (data.success) {
        fetchBoardState()
      }
    } catch (error) {
      console.error('Failed to update card:', error)
    }
  }

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Are you sure you want to delete this card?')) return

    try {
      const response = await fetch(`/cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (data.success) {
        fetchBoardState()
      }
    } catch (error) {
      console.error('Failed to delete card:', error)
    }
  }

  const handleMoveCard = async (cardId, sourceCol, destCol, sourceIndex, destIndex) => {
    const destCards = cards.filter(c => c.column === destCol && c.id !== cardId)
      .sort((a, b) => a.position - b.position)
    
    const targetIdx = destIndex
    let newPosition
    
    if (destCards.length === 0) {
      newPosition = 10
    } else if (targetIdx <= 0) {
      newPosition = destCards[0].position - 10
    } else if (targetIdx >= destCards.length) {
      newPosition = destCards[destCards.length - 1].position + 10
    } else {
      newPosition = (destCards[targetIdx - 1].position + destCards[targetIdx].position) / 2
    }

    newPosition = Math.max(1, newPosition)

    try {
      const response = await fetch(`/cards/${cardId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card: { column: destCol, position: newPosition }
        })
      })
      const data = await response.json()
      if (data.success) {
        fetchBoardState()
      }
    } catch (error) {
      console.error('Failed to move card:', error)
    }
  }

  const handleTimeTravel = async (timestamp) => {
    console.log('handleTimeTravel called with:', timestamp)
    try {
      const response = await fetch(`/board/history?timestamp=${encodeURIComponent(timestamp)}`)
      const data = await response.json()
      console.log('Historical data received:', data)
      setCards(data.cards)
      setHistoryTimestamp(data.timestamp)
      setIsTimeTravel(true)
    } catch (error) {
      console.error('Failed to fetch historical state:', error)
    }
  }

  const handleReturnToLive = () => {
    setIsTimeTravel(false)
    setHistoryTimestamp(null)
    fetchBoardState()
  }

  const refreshRecentEvents = useCallback(() => {
    fetchBoardState()
  }, [fetchBoardState])

  return (
    <div className="min-h-screen bg-board-backdrop">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
            {isTimeTravel && (
              <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Historical View</span>
                <span className="text-xs">({new Date(historyTimestamp).toLocaleString()})</span>
                <button
                  onClick={handleReturnToLive}
                  className="ml-2 px-2 py-0.5 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors"
                >
                  Return to Live
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowActivityLog(!showActivityLog)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showActivityLog ? 'Hide' : 'Show'} Activity Log
            </button>
          </div>
        </div>
      </header>

      {isTimeTravel && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <p className="text-sm text-amber-800">
            You are viewing the board as it was at <strong>{new Date(historyTimestamp).toLocaleString()}</strong>.
            This view is read-only. Drag-and-drop is disabled.
          </p>
        </div>
      )}

      <div className="relative flex h-[calc(100vh-100px)]">
        <KanbanBoard
          cards={cards}
          columns={columns}
          onCreateCard={handleCreateCard}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          onMoveCard={handleMoveCard}
          isTimeTravel={isTimeTravel}
        />

        {showActivityLog && (
          <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Activity Log</h3>
              <button
                onClick={() => setShowActivityLog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <ActivityLog
              events={recentEvents}
              onRefresh={refreshRecentEvents}
            />
          </div>
        )}
      </div>

      <TimelineSlider
        timeRange={timeRange}
        isTimeTravel={isTimeTravel}
        onTimeTravel={handleTimeTravel}
        isLive={!isTimeTravel}
        onResetSlider={handleReturnToLive}
      />
    </div>
  )
}
