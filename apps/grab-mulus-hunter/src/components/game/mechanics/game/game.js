import EventListener from "../helpers/eventListener/eventListener";
import Physics from "../helpers/physics/physics";
import AudioManager from "../helpers/audio/audioManager";
import GhostCollision from "../helpers/physics/ghosts/collisions/ghostCollision";

export default class Game {
  static finishSetup(variables, player, reactRoot, assets, ctx) {
    variables.player = player;
    variables.reactRoot = reactRoot;
    assets.timers.cycleTimer.start();

    // Set up game timer callback and start it
    if (assets.timers.gameTimer) {
      assets.timers.gameTimer.setOnExpired(() => {
        GhostCollision.endGame(variables, assets, ctx);
      });
      assets.timers.gameTimer.start();
    }

    EventListener.addDirectionDetection(variables);
    EventListener.addVisibilityDetection(variables, assets);
    EventListener.addPauseDetection(variables, assets, ctx);
    variables.start = false;
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    variables.startTime = performance.now();
  }

  static implementPhysics(assets, ctx, variables) {
    Physics.implementBoundaries(assets, ctx);
    Physics.implementPellets(assets, ctx, variables);
    Physics.implementPowerUps(assets, ctx, variables);
    Physics.implementGhosts(assets, ctx, variables);
    Physics.implementPacman(variables, assets, ctx);
  }

  static implementGraphics(variables, pacman, assets) {
    // Update sidebar elements directly
    const scoreElement = document.getElementById('score-display');
    const timerElement = document.getElementById('timer-display');
    const timerPanel = document.querySelector('.timer-panel');

    if (scoreElement) {
      scoreElement.textContent = variables.score.toLocaleString();
    }

    if (timerElement && assets && assets.timers && assets.timers.gameTimer) {
      const timeString = assets.timers.gameTimer.getFormattedTime();
      timerElement.textContent = timeString;

      // Add urgent class when time is low (less than 10 seconds)
      const remainingTime = assets.timers.gameTimer.getRemainingTime();
      if (remainingTime <= 10000) { // 10 seconds
        timerPanel?.classList.add('urgent');
      } else {
        timerPanel?.classList.remove('urgent');
      }
    }
  }

  static manageGhostAudio(assets) {
    if (assets.audioPlayer.ghostAudioWantsToPlay)
      AudioManager.playGhostAudio(assets);
  }
}
