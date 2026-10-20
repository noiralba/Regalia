import { useState } from 'react'
import type { ScheduleDay } from '../types/types'

interface ScheduleProps {
  days: ScheduleDay[]
}

export default function Schedule({ days }: ScheduleProps) {
  const [activeDayId, setActiveDayId] = useState(days[0]?.id)
  const activeDay = days.find((day) => day.id === activeDayId) ?? days[0]

  return (
    <section className="container schedule">
      <div className="section-label">Visas idag</div>

      <div className="day-tabs">
        {days.map((day) => (
          <button
            key={day.id}
            type="button"
            className={day.id === activeDayId ? 'active' : ''}
            onClick={() => setActiveDayId(day.id)}
          >
            {day.label}
          </button>
        ))}
      </div>

      {activeDay?.showings.map((showing) => (
        <div className="show-row" key={showing.id}>
          <div className="title">{showing.movieTitle}</div>
          <div className="times">
            <div className="time-btn">
              <b>{showing.time}</b>
              {showing.salong}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}