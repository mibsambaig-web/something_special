import { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';

// Change this to a future date/time if you want to see the countdown screen:
// e.g. new Date('2026-11-22T00:00:00+05:00') for midnight PKT
const BIRTHDAY = new Date('2026-11-22T00:00:00');
const NAME = 'Mina';

function getTimeLeft() {
  const diff = BIRTHDAY.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n) => String(n).padStart(2, '0');

export default function App() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft());

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return <Birthday />;

  return (
    <main className="screen">
      <p className="eyebrow">Counting down to</p>
      <h1 className="title">{NAME}'s Birthday</h1>
      <div className="timer">
        {Object.entries(timeLeft).map(([label, value]) => (
          <div className="box" key={label}>
            <span className="num">{pad(value)}</span>
            <span className="label">{label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

// ——— Your media ———
const photos = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'];
const videos = ['clip1.mp4', 'clip2.mp4', 'clip3.mp4'];

function Birthday() {
  const [showSecret, setShowSecret] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const hearts = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${10 + Math.random() * 12}s`,
        animationDelay: `${Math.random() * -20}s`,
        transform: `scale(${0.5 + Math.random() * 0.9})`,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.7;

    const tryPlay = () => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    tryPlay();

    // If browser blocked autoplay, start music on first tap anywhere
    const unlockAudio = () => {
      if (audio.paused) {
        tryPlay();
      }
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, []);

  const toggleMusic = (e) => {
    e.stopPropagation(); // prevents double-triggering unlockAudio
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <main className="screen birthday">
      {/* Top-right floating music button */}
      <button
        type="button"
        className={`music-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>

      {/* Floating hearts background */}
      <div className="hearts">
        {hearts.map((h) => (
          <span
            key={h.i}
            className="heart"
            style={{
              '--i': h.i,
              left: h.left,
              animationDuration: h.animationDuration,
              animationDelay: h.animationDelay,
              transform: h.transform,
              opacity: h.opacity,
            }}
          />
        ))}
      </div>

      <div className="content">
        <h1 className="title big">Happy Birthday, {NAME}</h1>

        <p className="message">
          My cutie patootie UMMMWAAHHHH,<br /><br />
          Every moment with you feels like a gift.
          Thank you for being with me even after so much happened between us
          I hope this year brings you as much happiness as you bring me every single day.
          <br /><br />
          I love you. ❤️
        </p>

        {/* Secret message button */}
        <button className="secret-btn" onClick={() => setShowSecret(!showSecret)}>
          {showSecret ? 'Hide message' : 'Tap the heart ❤️'}
        </button>

        {showSecret && (
          <div className="secret-message">
            Who is your daddy😔👉🏻👈🏻
          </div>
        )}

        {/* Audio element */}
        <audio
          ref={audioRef}
          src="/alfaaz.mp3"
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Media Card */}
        <div className="media-card">
          <h2 className="media-title">Our Moments</h2>

          <div className="gallery">
            {photos.map((name) => (
              <img
                key={name}
                src={`/photos/${name}`}
                alt="us"
                loading="lazy"
              />
            ))}

            {videos.map((name) => (
              <video
                key={name}
                src={`/videos/${name}`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controlsList="nofullscreen nodownload"
                className="video"
              />
            ))}
          </div>
        </div>

        <p className="footer">With all my love</p>
      </div>
    </main>
  );
}