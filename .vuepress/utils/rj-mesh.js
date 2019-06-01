import utils from './three-utils';

class RjMesh {
  constructor(mesh) {
    this.id = Math.random()
      .toString(36)
      .substring(7)
      .toUpperCase();
    this.x = 0;
    this.y = 0;
    this.mesh = mesh;
    this.opacity = 1;
    this.updatesPerSecond = 18;
  }

  fade(duration, fadeOut = false) {
    const that = this;
    const startTime = Date.now();
    const fadeIntervalId = window.setInterval(() => {
      const currentTime = Date.now() - startTime;
      if(fadeOut) {
        that.opacity = utils.easeOut(currentTime, duration);
      } else {
        that.opacity = utils.easeIn(currentTime, duration);
      }
      that.mesh.material.opacity = this.opacity;
      const finished = fadeOut ? that.opacity <= 0 : that.opacity >= 1;
      if (finished) {
        window.clearInterval(fadeIntervalId);
      }
    }, 1000 / this.updatesPerSecond);
  }

  fadeOut(duration) {
    this.fade(duration, true);
  }

  fadeIn(duration) {
    this.fade(duration);
  }

  setFadeInDelay(milliseconds) {
    window.setTimeout(() => {
      this.fadeIn(500);
    }, milliseconds);
  }

  setFadeOutDelay(milliseconds) {
    window.setTimeout(() => {
      this.fadeOut(500);
    }, milliseconds);
  }

  setFadeOutInDelay(msOut, msIn) {
    this.setFadeOutDelay(msOut);
    this.setFadeInDelay(msIn);
  }
}

export default RjMesh;
