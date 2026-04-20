import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'

export default function TimelineSlider({ timeRange, isTimeTravel, onTimeTravel, isLive, onResetSlider }) {
  const [sliderValue, setSliderValue] = useState(100)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(null)

  const hasEvents = timeRange.earliest && timeRange.latest

  useEffect(() => {
    if (isLive) {
      setSliderValue(100)
    }
  }, [isLive])

  const getTimeFromValue = useCallback((value) => {
    if (!hasEvents) return null
    const earliest = new Date(timeRange.earliest).getTime()
    const latest = new Date(timeRange.latest).getTime()
    const range = latest - earliest
    const time = new Date(earliest + (range * value / 100))
    console.log('getTimeFromValue:', { value, earliest, latest, range, time: time.toISOString() })
    return time
  }, [timeRange, hasEvents])

  useEffect(() => {
    if (hasEvents) {
      setCurrentTime(getTimeFromValue(sliderValue))
    }
  }, [sliderValue, hasEvents, getTimeFromValue])

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value)
    setSliderValue(value)
  }

  const handleSliderCommit = () => {
    console.log('handleSliderCommit called, sliderValue:', sliderValue)
    if (sliderValue < 100) {
      const time = getTimeFromValue(sliderValue)
      console.log('Time calculated:', time?.toISOString())
      if (time) {
        onTimeTravel(time.toISOString())
      }
    } else if (sliderValue === 100) {
      onResetSlider?.()
    }
  }

  const handleLiveClick = () => {
    setSliderValue(100)
    onResetSlider?.()
  }

  if (!hasEvents) {
    return null
  }

  return (
    <div className={`absolute bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg transition-all ${isExpanded ? 'h-32' : 'h-16'}`}>
      <div className="px-4 py-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Time Travel</span>
          </div>

          {currentTime && sliderValue < 100 && (
            <span className="text-sm text-gray-500">
              Viewing: {format(currentTime, 'MMM d, yyyy HH:mm:ss')}
            </span>
          )}

          <div className="flex-1" />

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 w-32">
            {format(new Date(timeRange.earliest), 'MMM d, HH:mm')}
          </span>

          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              onMouseUp={handleSliderCommit}
              onTouchEnd={handleSliderCommit}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div
              className="absolute top-0 left-0 h-2 bg-blue-600 rounded-lg pointer-events-none"
              style={{ width: `${sliderValue}%` }}
            />
          </div>

          <span className="text-xs text-gray-400 w-32 text-right">
            {format(new Date(timeRange.latest), 'MMM d, HH:mm')}
          </span>

          <button
            onClick={handleLiveClick}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              sliderValue === 100
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Live
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 flex gap-2">
            {[0, 25, 50, 75].map((value) => (
              <button
                key={value}
                onClick={() => {
                  setSliderValue(value)
                  const time = getTimeFromValue(value)
                  if (time) {
                    onTimeTravel(time.toISOString())
                  }
                }}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition-colors"
              >
                {value === 0 ? 'Start' : `${value}%`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
