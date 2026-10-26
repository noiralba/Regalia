import { useEffect, useRef, useState } from "react";
import "./HeroSection.scss";
import { promoTrailers } from "../../data/promoTrailers";

export default function HeroSection() {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Öppna gardinerna
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurtainsOpen(true);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  // Starta trailern när gardinerna har öppnats.
  useEffect(() => {
    if (!curtainsOpen || !videoRef.current) return;

    void videoRef.current.play().catch(() => {
      // Autoplay kan blockeras av webbläsaren.
    });
  }, [curtainsOpen, activeTrailer]);

  // Spela nästa trailer utan att stänga gardinerna.
  const handleEnded = () => {
    setActiveTrailer((current) => (current + 1) % promoTrailers.length);
  };

  return (
    <section
      className={`hero ${curtainsOpen ? "hero--open" : ""}`}
      aria-label="Biografens trailers"
    >
      <section
        className="hero__curtain hero__curtain--top"
        aria-hidden="true"
      />

      <section className="hero__video-wrapper">
        <video
          ref={videoRef}
          className="hero__video"
          key={promoTrailers[activeTrailer]}
          src={promoTrailers[activeTrailer]}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
        >
          Din webbläsare stöder inte video.
        </video>
      </section>

      <section
        className="hero__curtain hero__curtain--left"
        aria-hidden="true"
      />

      <div className="hero__curtain hero__curtain--right" aria-hidden="true" />
    </section>
  );
}
