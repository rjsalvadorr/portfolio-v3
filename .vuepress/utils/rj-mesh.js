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
    this.glowIntensity = 1;
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

  fadeInOut(duration, flip = false) {
    const that = this;
    const startTime = Date.now();
    let calcTimer = 3; // hack for figuring out "finished" state easily
    const fadeIntervalId = window.setInterval(() => {
      const currentTime = Date.now() - startTime;
      if(flip) {
        that.opacity = utils.easeOutIn(currentTime, duration);
      } else {
        that.opacity = utils.easeInOut(currentTime, duration);
      }
      that.mesh.material.opacity = this.opacity;
      let finished = false;
      if(calcTimer == 0) {
        finished = flip ? that.opacity >= 1 : that.opacity <= 0;
      }
      if (finished) {
        console.log(that.opacity);
        window.clearInterval(fadeIntervalId);
      }
      if(calcTimer > 0) {
        calcTimer--;
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

  setFadeOutInDelay(milliseconds, flip) {
    window.setTimeout(() => {
      this.fadeInOut(500, flip);
    }, milliseconds);
  }
}

export default RjMesh;
