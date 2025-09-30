import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import Game from "../game/game";
import { Howl } from "howler";
import UsernameModal from "./UsernameModal";

export default function Main({ reactRoot }) {
  const [theme] = useState(
    new Howl({
      src: ["./audio/title_theme.wav"],
      loop: true,
      volume: 0.3,
    })
  );
  const [showModal, setShowModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    theme.play();
    window.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown"].includes(event.code)) {
        event.preventDefault();
      }
    });

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      // Add/remove fullscreen class to body for CSS styling
      if (isNowFullscreen) {
        document.body.classList.add('fullscreen-mode');
      } else {
        document.body.classList.remove('fullscreen-mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Initialize fullscreen state on mount
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      // Clean up fullscreen class on unmount
      document.body.classList.remove('fullscreen-mode');
    };
  }, [theme]);

  const handlePlayClick = () => {
    setShowModal(true);
  };

  const handleUsernameSubmit = (username) => {
    // Save username to localStorage
    localStorage.setItem('pacman_username', username);

    // Create player object with username
    const player = { username: username };

    // Close modal and start game
    setShowModal(false);
    theme.pause();

    if (reactRoot) {
      reactRoot.render(<Game player={player} reactRoot={reactRoot} />);
    } else {
      const root = ReactDOM.createRoot(document.getElementById("subRoot"));
      root.render(<Game player={player} reactRoot={root} />);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <div className="container">
      <img src="/images/frame.png" alt="frame" className="frame" />
      <img src="/images/pinjam-tenang.png" alt="pinjam-tenang" className="pinjam-tenang-logo" />
      <div className="main" id="main">
        <button className="fullscreen-button" onClick={toggleFullscreen}>
          <span className="fullscreen-icon">{isFullscreen ? '⊡' : '⛶'}</span>
          <span className="fullscreen-text">Fullscreen</span>
        </button>

        <div>
          <img src="/images/grab-modal-logo.png" alt="Grab Modal Logo" className="grab-modal-logo-main" />
        </div>
        <div className="logo-container">
          <img src="/images/main-logo.png" alt="Mulus Hunter Logo" className="main-logo-main" />
        </div>
        <div className="register">
          <button className="play-button" id="play-button" onClick={handlePlayClick}>
            Mulai
          </button>
        </div>

        <UsernameModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSubmit={handleUsernameSubmit}
        />
      </div>
    </div>
  );
}
