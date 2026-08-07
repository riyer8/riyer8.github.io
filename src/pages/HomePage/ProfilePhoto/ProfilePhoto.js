import { useState, useEffect, useCallback, useRef } from "react";
import { PROFILE_PHOTOS } from "../../../assets/profilePhotos";
import "./ProfilePhoto.css";

const FADE_MS = 600;
const AUTO_CYCLE_MS = 15000;

const ProfilePhoto = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const fadeTimeoutRef = useRef(null);

  const clearFadeTimeout = () => {
    if (fadeTimeoutRef.current != null) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
  };

  const goToNext = useCallback(() => {
    if (isAnimatingRef.current || PROFILE_PHOTOS.length < 2) return;

    isAnimatingRef.current = true;
    clearFadeTimeout();

    const previous = currentIndexRef.current;
    const next = (previous + 1) % PROFILE_PHOTOS.length;
    currentIndexRef.current = next;

    setOutgoingIndex(previous);
    setCurrentIndex(next);

    fadeTimeoutRef.current = setTimeout(() => {
      setOutgoingIndex(null);
      isAnimatingRef.current = false;
      fadeTimeoutRef.current = null;
    }, FADE_MS);
  }, []);

  useEffect(() => {
    const interval = setInterval(goToNext, AUTO_CYCLE_MS);
    return () => {
      clearInterval(interval);
      clearFadeTimeout();
    };
  }, [goToNext]);

  return (
    <button
      type="button"
      className="profile-photo"
      onClick={goToNext}
      title="click to cycle!"
      aria-label="Show the next photo of Ramya Iyer"
    >
      <img
        className="profile-photo__img profile-photo__img--current"
        src={PROFILE_PHOTOS[currentIndex]}
        alt="Ramya Iyer"
        draggable={false}
      />
      {outgoingIndex != null && (
        <img
          key={outgoingIndex}
          className="profile-photo__img profile-photo__img--outgoing"
          src={PROFILE_PHOTOS[outgoingIndex]}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      )}
    </button>
  );
};

export default ProfilePhoto;
