import { useEffect, useRef, useState } from "react";
import "./HeroSection.scss";
import { promoTrailers } from "../../data/promoTrailers";

function shouldSkipVideo(): boolean {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;

  return prefersReducedMotion || connection?.saveData === true;
}

export default function HeroSection() {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [skipVideo] = useState(shouldSkipVideo);

  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentTrailer = promoTrailers[activeTrailer];
  const showVideo = !skipVideo && !!currentTrailer;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurtainsOpen(true);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  // Håll koll på om hero-sektionen syns på skärmen
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !curtainsOpen) return;

    if (isVisible) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [curtainsOpen, isVisible, activeTrailer]);

  // Spela nästa trailer utan att stänga gardinerna.
  const handleEnded = () => {
    setActiveTrailer((current) => (current + 1) % promoTrailers.length);
  };

  return (
    <section
      ref={heroRef}
      className={`hero ${curtainsOpen ? "hero--open" : ""}`}
      aria-label={
        showVideo
          ? `Biografens trailers: ${currentTrailer.title}`
          : "Biografens trailers"
      }
    >
      <section
        className="hero__curtain hero__curtain--top"
        aria-hidden="true"
      />

      {showVideo && (
        <section className="hero__video-wrapper">
          <video
            ref={videoRef}
            className="hero__video"
            key={currentTrailer.src}
            src={currentTrailer.src}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleEnded}
          >
            Din webbläsare stöder inte video.
          </video>
        </section>
      )}

      {showVideo && <h2 className="hero__title">{currentTrailer.title}</h2>}

      <section
        className="hero__curtain hero__curtain--left"
        aria-hidden="true"
      />

      <div className="hero__curtain hero__curtain--right" aria-hidden="true" />
    </section>
  );
}
