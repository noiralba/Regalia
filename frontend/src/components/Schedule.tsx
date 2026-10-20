import { useState } from 'react'
import type { ScheduleDay } from '../types/types'

interface ScheduleProps {
  days: ScheduleDay[]
}

export default function Schedule({ days }: ScheduleProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeDay = days[activeIndex]

  // Gruppera visningar per film
  const showingsByMovie = new Map<string, NonNullable<typeof activeDay>['showings']>()
  activeDay?.showings.forEach((showing) => {
    const list = showingsByMovie.get(showing.movieTitle) ?? []
    list.push(showing)
    showingsByMovie.set(showing.movieTitle, list)
  })

  return (
    <section className="container schedule my-5">
      <h2 className="h5 text-uppercase mb-3">Visas idag</h2>

      <div className="schedule-box border rounded-2 p-3 p-md-4">
        {[...showingsByMovie.entries()].map(([title, showings]) => (
          <div
            key={title}
            className="row align-items-center g-3 py-2"
          >
            <div className="col-12 col-md-4">
              <div className="movie-info border-bottom pb-1">
                <div className="movie-title text-uppercase fw-bold fs-6">
                  {title}
                </div>
                <small>Genre | 15+ | 160min</small>
              </div>
            </div>

            <div className="col-12 col-md-8">
              <div className="d-flex flex-wrap gap-2">
                {showings.map((showing) => (
                  <button
                    key={showing.id}
                    type="button"
                    style={{flex: '1 1 0', minWidth: '100px'}}
                    className="time-btn btn border rounded-2 py-2 px-3 text-center"
                  >
                    <div className="fw-semibold">{showing.time}</div>
                    <small className="d-block">{showing.salong}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="row mt-3">
          <div className="col-12 col-md-8 offset-md-4">
            <button
              type="button"
              className="btn border rounded-2 w-100 py-2 text-uppercase fw-semibold"
              onClick={() => setActiveIndex((i) => (i + 1) % days.length)}
            >
              Se fler datum
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}