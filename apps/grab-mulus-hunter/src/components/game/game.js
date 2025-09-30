import React, { useEffect } from "react";
import "./game.css";
import playGame from "./mechanics/playGame";

export default function Game({ player, reactRoot, callback = playGame }) {
  useEffect(() => {
    callback(player, reactRoot);
  }, [callback, player, reactRoot]);

  return (
    <div className="container">
      <img src="/images/frame.png" alt="frame" className="frame" />
      <img src="/images/pinjam-tenang.png" alt="pinjam-tenang" className="pinjam-tenang-logo-game" />
      <div className="game">
        <canvas
          id="board"
          className="board"
          data-testid="board"
          width="896"
          height="992"
        ></canvas>
        <div className="sidebar">
          <div className="grab-modal-logo-game-container">
            <img src="/images/grab-modal-logo.png" alt="Grab Modal Logo" className="grab-modal-logo-game" />
          </div>
          <div className="logo-container">
            <img src="/images/main-logo.png" alt="Mulus Hunter Logo" className="game-logo" />
          </div>
          <div className="game-panel">
            <div className="score-panel">
              <div className="panel-header">SCORE</div>
              <div id="score-display" className="score-value">0</div>
            </div>
            <div className="timer-panel">
              <div className="panel-header">WAKTU</div>
              <div id="timer-display" className="timer-value">01:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
