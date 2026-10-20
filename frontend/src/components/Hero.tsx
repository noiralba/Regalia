interface HeroProps {
  title: string
  tagline: string
  imageUrl: string
}

export default function Hero({ title, tagline, imageUrl }: HeroProps) {
  return (
    <div className="hero">
      <img
        src={imageUrl}
        alt="Hero"
        className="hero-image"
      />
      <div className="hero-overlay">
        <h1>{title}</h1>
        <p>{tagline}</p>
      </div>
    </div>
  )
}