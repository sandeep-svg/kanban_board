import React, { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'

export default function ActivityLog({ events, onRefresh }) {
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const prevEventsLength = useRef(events.length)

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      onRefresh()
    }, 10000)
    return () => clearInterval(interval)
  }, [autoRefresh, onRefresh])

  useEffect(() => {
    if (events.length !== prevEventsLength.current) {
      prevEventsLength.current = events.length
      setRefreshKey(k => k + 1)
    }
  }, [events.length])

  const getEventIcon = (type) => {
    switch (type) {
      case 'card_created':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )
      case 'card_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        )
      case 'card_moved':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        )
      case 'card_deleted':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
          </div>
        )
    }
  }

  return (
    <div key={refreshKey}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Activity Log</h2>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto
          </label>
          <button
            type="button"
            onClick={onRefresh}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex gap-3">
              {getEventIcon(event.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{event.humanReadable}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {format(new Date(event.createdAt), 'MMM d, HH:mm:ss')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
