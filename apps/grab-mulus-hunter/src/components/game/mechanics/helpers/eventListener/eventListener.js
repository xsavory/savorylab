import AudioManager from "../audio/audioManager";
import Timer from "../timer/timer";
import Animator from "../graphics/animator/animator";

export default class EventListener {
  static gamepadCache = null;
  static lastGamepadInput = "";
  static gamepadInputTime = 0;

  static addDirectionDetection(variables) {
    window.addEventListener(
      "keydown",
      (variables.directionEventListener = ({ key }) => {
        if (key === "ArrowUp") {
          variables.lastKeyPressed = "up";
        } else if (key === "ArrowLeft") {
          variables.lastKeyPressed = "left";
        } else if (key === "ArrowRight") {
          variables.lastKeyPressed = "right";
        } else if (key === "ArrowDown") {
          variables.lastKeyPressed = "down";
        }
      })
    );

    window.addEventListener("gamepadconnected", (e) => {
      console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length,
      );
      this.gamepadCache = e.gamepad;
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      console.log("Gamepad disconnected at index %d: %s.", e.gamepad.index, e.gamepad.id);
      this.gamepadCache = null;
    });
  }

  static checkGamepadInput(variables) {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];

    if (!gamepad) {
      this.gamepadCache = null;
      return;
    }

    const debounceTime = 100;
    const currentTime = performance.now();

    // D-pad buttons (standard gamepad mapping)
    const dpadUp = gamepad.buttons[12]?.pressed;
    const dpadDown = gamepad.buttons[13]?.pressed;
    const dpadLeft = gamepad.buttons[14]?.pressed;
    const dpadRight = gamepad.buttons[15]?.pressed;

    let newInput = "";

    // Check D-pad first (priority over analog stick)
    if (dpadUp) {
      newInput = "up";
    } else if (dpadDown) {
      newInput = "down";
    } else if (dpadLeft) {
      newInput = "left";
    } else if (dpadRight) {
      newInput = "right";
    } else {
      // Fallback to analog stick
      const deadzone = 0.3;
      const xAxis = gamepad.axes[0];
      const yAxis = gamepad.axes[1];

      if (Math.abs(xAxis) > deadzone || Math.abs(yAxis) > deadzone) {
        if (Math.abs(xAxis) > Math.abs(yAxis)) {
          if (xAxis > deadzone) {
            newInput = "right";
          } else if (xAxis < -deadzone) {
            newInput = "left";
          }
        } else {
          if (yAxis > deadzone) {
            newInput = "down";
          } else if (yAxis < -deadzone) {
            newInput = "up";
          }
        }
      }
    }

    // Apply debouncing to prevent input spam
    if (newInput && (newInput !== this.lastGamepadInput || currentTime - this.gamepadInputTime > debounceTime)) {
      variables.lastKeyPressed = newInput;
      this.lastGamepadInput = newInput;
      this.gamepadInputTime = currentTime;
    }
  }

  static addVisibilityDetection(variables, assets) {
    window.addEventListener(
      "visibilitychange",
      (variables.visibilityEventListener = () => {
        if (!variables.isGamePaused && variables.isWindowVisible) {
          variables.isWindowVisible = false;
          AudioManager.pauseAudio(assets.audioPlayer);
          Timer.pauseTimers(assets.timers);
        } else if (!variables.isGamePaused && !variables.isWindowVisible) {
          variables.isWindowVisible = true;
          AudioManager.resumeAudio(assets.audioPlayer);
          Timer.resumeTimers(assets.timers);
        }
      })
    );
  }

  static addPauseDetection(variables, assets, ctx) {
    window.addEventListener(
      "keydown",
      (variables.pauseEventListener = ({ key }) => {
        if (key === "Escape") {
          if (!variables.isGamePaused) {
            variables.isGamePaused = true;
            cancelAnimationFrame(variables.animationId);
            AudioManager.pauseAudio(assets.audioPlayer);
            Timer.pauseTimers(assets.timers);
            Animator.loadPauseOverlay(ctx, assets.pauseTextImage);
          } else {
            variables.isGamePaused = false;
            AudioManager.resumeAudio(assets.audioPlayer);
            Timer.resumeTimers(assets.timers);
            Animator.resumeAnimation(variables, ctx, assets);
          }
        }
      })
    );
  }
}
