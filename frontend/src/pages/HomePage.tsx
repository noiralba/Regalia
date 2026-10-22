import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import VipBanner from '../components/VipBanner'
import Schedule from '../components/Schedule'

import { useEffect, useState } from 'react'
import type { Movies, ScheduleDay } from '../types/types'
import { get } from '../api/api'
import Calendar from '../components/Calender';


const scheduleDays: ScheduleDay[] = [
  {
    id: 'idag',
    label: 'Idag 18',
    showings: [
      { id: 's1', movieTitle: 'The Odyssey', time: '19:00', salong: 'Salong 1' },
      { id: 's2', movieTitle: 'Anora', time: '20:00', salong: 'Salong 2' },
    ],
  },
  { id: 'lor', label: 'Lör 19', showings: [] },
  { id: 'son', label: 'Sön 20', showings: [] },
  { id: 'man', label: 'Mån 21', showings: [] },
  { id: 'tis', label: 'Tis 22', showings: [] },
]

function HomePage() {

  const [movies, setMovies] = useState<Movies[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await get<Movies[]>('/api/movies')
        setMovies(data)
      } catch (err) {
        console.error('Kunde inte hämta filmer:', err)
        setError('Filmerna kunde inte laddas.')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) return <p>Laddar...</p>
  if (error) return <p>{ error }</p>

  return (
    <>
      <Hero
        title="The Odyssey"
        tagline="En resa genom stjärnorna. Nu på bio."
        imageUrl="https://placehold.co/1400x800"
      />
      <MovieRow label="Alla filmer" movies={movies} />
      <VipBanner />
      {/* <MovieRow label="Kommer snart" movies={comingSoon} /> */}
      <Schedule days={scheduleDays} />
      <Calendar />
    </>
  )
}

export default HomePage