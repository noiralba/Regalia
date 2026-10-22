interface HeroProps {
  title: string
  tagline: string
  imageUrl: string
}

export default function Hero({ title, tagline, imageUrl }: HeroProps) {
  return (
    <section
      className="hero position-relative overflow-hidden text-white"
      style={{ height: '70vh', minHeight: '400px' }}
    >
      <img
        src={imageUrl}
        alt="Hero"
        className="hero-image position-absolute top-0 start-0 w-100 h-100"
        style={{ objectFit: 'cover' }}
      />

      <article
        className="hero-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center px-3"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
      >
        <h1 className="display-3 fw-bold text-uppercase mb-3">{title}</h1>
        <p className="lead fs-4 mb-0 col-12 col-md-8 col-lg-6">{tagline}</p>
      </article>
    </section>
  )
}