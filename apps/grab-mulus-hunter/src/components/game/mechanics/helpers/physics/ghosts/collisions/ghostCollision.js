import Graphics from "../../../graphics/graphics";
import Leaderboard from "../../../../../../leaderboard/leaderboard";
import Animator from "../../../graphics/animator/animator";
import playGame from "../../../../playGame";
import { scoreAPI } from "../../../../../../../appwrite/api";

export default class GhostCollision {
  static collisionConditional(ghost, pacman) {
    return (
      ghost.position.y - ghost.radius <= pacman.position.y + pacman.radius &&
      ghost.position.y + ghost.radius >= pacman.position.y - pacman.radius &&
      ghost.position.x + ghost.radius >= pacman.position.x - pacman.radius &&
      ghost.position.x - ghost.radius <= pacman.position.x + pacman.radius
    );
  }

  static dealWithCollision(ghost, assets, variables, ctx) {
    if (!ghost.isScared && !ghost.isRetreating) {
      assets.characters.pacman.radians = Math.PI / 4;
      cancelAnimationFrame(variables.animationId);
      assets.audioPlayer.stopGhostAudio();
      assets.audioPlayer.playPacmanDeath();
      assets.characters.pacman.isShrinking = true;
      Graphics.runDeathAnimation(variables, ctx, assets);
    } else if (ghost.isScared) {
      variables.score += 200 * Math.pow(2, variables.killCount);
      variables.killCount++;
      ghost.changeRetreatingState();
      ghost.retreatingTimer.start();
      ghost.changeScaredState();
      ghost.assignSprite();
      ghost.checkSpeedMatchesState();
    }
  }

  static checkPacmanLives(
    assets,
    variables,
    ctx,
    endGame = GhostCollision.endGame,
    resetAfterDeath = GhostCollision.resetAfterDeath
  ) {
    endGame(variables, assets, ctx);
  }

  static async endGame(
    variables,
    assets,
    ctx,
    saveScore = GhostCollision.saveScore,
    resetAfterGameOver = GhostCollision.resetAfterGameOver
  ) {
    cancelAnimationFrame(variables.animationId);
    Animator.displayPleaseWait(ctx);

    // Always try to save score if we have a username
    const username = variables.player?.username || localStorage.getItem('pacman_username');
    if (username && variables.score > 0) {
      await saveScore(variables);
    }

    resetAfterGameOver(assets, variables);
    variables.reactRoot.render(<Leaderboard variables={variables} />);
  }

  static async saveScore(variables) {
    try {
      // Get username from localStorage or player object
      const username = variables.player?.username || localStorage.getItem('pacman_username');

      if (!username) {
        console.warn('No username found for saving score');
        return 'Error: No username found';
      }

      const result = await scoreAPI.saveScore(username, variables.score);

      if (result.success) {
        return `Success: Score saved successfully`;
      } else {
        console.error('Error saving score:', result.error);
        return `Error: ${result.error}`;
      }
    } catch (err) {
      console.error('Error saving score:', err);
      return `Error: ${err.message}`;
    }
  }


  static resetAfterGameOver(assets, variables) {
    assets.props.pellets.forEach((pellet) => {
      if (pellet.hasBeenEaten) pellet.changeEatenState();
    });
    assets.props.powerUps.forEach((powerUp) => {
      if (powerUp.hasBeenEaten) powerUp.changeEatenState();
    });
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();
    assets.timers.scaredTimer.duration = 7000;
    if (assets.timers.gameTimer) {
      assets.timers.gameTimer.reset();
    }
    Object.values(assets.characters.ghosts).forEach((ghost) => {
      ghost.reset();
    });
    assets.characters.pacman.reset();
    assets.characters.pacman.lives = 0;
    variables.lastKeyPressed = "";
    window.removeEventListener("keydown", variables.directionEventListener);
    window.removeEventListener(
      "visibilitychange",
      variables.visibilityEventListener
    );
    window.removeEventListener("keydown", variables.pauseEventListener);
  }

  static resetAfterDeath(assets, variables, callbackOne = playGame) {
    assets.characters.pacman.reset();
    variables.lastKeyPressed = "";
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();
    Object.values(assets.characters.ghosts).forEach((ghost) => {
      ghost.reset();
    });
    assets.timers.cycleTimer.start();
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    callbackOne(variables.player, variables.reactRoot);
  }
}
