import "./leaderboard.css";
import Main from "../main/main";
import { useEffect, useState } from "react";
import { scoreAPI } from "../../appwrite/api";

export default function Leaderboard({ variables }) {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(false);

  const fetchScores = async () => {
    try {
      const result = await scoreAPI.getTopScores(5);

      if (result.success) {
        let scores = result.data.map(score => ({
          username: score.username,
          points: score.score
        }));

        // Fill remaining slots with placeholder data if less than 5 scores
        while (scores.length < 5) {
          scores.push({
            username: "",
            points: "--",
          });
        }

        setScores(scores);
      } else {
        console.error('Error fetching scores:', result.error);
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching scores:', err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const resetVariables = () => {
    variables.score = 0;
    variables.start = true;
  };

  const handleChangePlayer = () => {
    resetVariables();
    variables.reactRoot.render(
      <Main user={variables.player} reactRoot={variables.reactRoot} />
    );
  };

  return (
    <div className="container">
      <img src="/images/frame.png" alt="frame" className="frame" />
      <img src="/images/pinjam-tenang.png" alt="pinjam-tenang" className="pinjam-tenang-logo" />
      <div className="leaderboard">
        <div className="main-layout">
          <div className="left-column">
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <h1>SKOR TERTINGGI</h1>
            </div>
            {error ? (
              <p className="error" data-testid="error">
                Unable to load leaderboard. Please check your connection.
              </p>
            ) : (
              <div className="leaderboard-container">
                {scores.length !== 5 ? (
                  <div className="wait-message" data-testid="wait-message">
                    Please wait a moment...
                  </div>
                ) : (
                  <div className="scores-list">
                    {scores.map((score, index) => {
                      const isFirstPlace = index === 0;
                      return (
                        <div
                          className={`score-card ${isFirstPlace ? 'first-place' : ''}`}
                          key={index}
                          aria-label={index}
                        >
                          <div className="player-avatar">
                            <img src="/images/main-character.png" alt="Winner Avatar" className="winner-avatar" />
                          </div>
                          <div className="score-info">
                            <span className="rank-number">{index + 1}.</span>
                            <span className="player-name">{score.username}</span>
                          </div>
                          <div className="score-box">
                            {score.points}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="right-column">
            <div>
              <img src="/images/grab-modal-logo.png" alt="Grab Modal Logo" className="grab-modal-logo" />
            </div>
            <div className="logo-container">
              <img src="/images/main-logo.png" alt="Mulus Hunter Logo" className="main-logo" />
              <h4 className="your-score">You scored <span className="score-highlight">{variables.score}</span> points</h4>
            </div>
            <div className="buttons">
              <button className="home" onClick={handleChangePlayer}>
                Main Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
