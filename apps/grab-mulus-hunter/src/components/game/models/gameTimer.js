export default class GameTimer {
  constructor(duration = 60000, onExpired = null) {
    this.duration = duration;
    this.timeout = null;
    this.startTime = null;
    this.timeRemaining = duration;
    this.isRunning = false;
    this.onExpired = onExpired;
  }

  start(dateNow = Date.now()) {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      this.#handleExpired();
    }, this.timeRemaining);
    this.isRunning = true;
  }

  pause(dateNow = Date.now()) {
    if (!this.isRunning) return;
    clearTimeout(this.timeout);
    const timeElapsed = dateNow - this.startTime;
    this.timeRemaining = Math.max(0, this.timeRemaining - timeElapsed);
    this.isRunning = false;
  }

  resume(dateNow = Date.now()) {
    if (this.isRunning || this.timeRemaining <= 0) return;
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      this.#handleExpired();
    }, this.timeRemaining);
    this.isRunning = true;
  }

  reset() {
    clearTimeout(this.timeout);
    this.timeRemaining = this.duration;
    this.isRunning = false;
    this.startTime = null;
  }

  getRemainingTime(dateNow = Date.now()) {
    if (!this.isRunning) {
      return this.timeRemaining;
    }
    const timeElapsed = dateNow - this.startTime;
    return Math.max(0, this.timeRemaining - timeElapsed);
  }

  getFormattedTime(dateNow = Date.now()) {
    const remaining = this.getRemainingTime(dateNow);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  setOnExpired(callback) {
    this.onExpired = callback;
  }

  // private

  #handleExpired() {
    this.timeRemaining = 0;
    this.isRunning = false;
    if (this.onExpired) {
      this.onExpired();
    }
  }
}