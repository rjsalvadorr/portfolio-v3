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

  ease(duration, easeOut = false) {
    const that = this;
    const startTime = Date.now();
    const easeIntervalId = window.setInterval(() => {
      const currentTime = Date.now() - startTime;
      if(easeOut) {
        that.opacity = utils.easeOut(currentTime, duration);
      } else {
        that.opacity = utils.easeIn(currentTime, duration);
      }
      that.mesh.material.opacity = this.opacity;
      const finished = easeOut ? that.opacity <= 0 : that.opacity >= 1;
      if (finished) {
        window.clearInterval(easeIntervalId);
      }
    }, 1000 / this.updatesPerSecond);
  }

  easeInOut(duration, flip = false) {
    const that = this;
    const startTime = Date.now();
    let calcTimer = 3; // hack for figuring out "finished" state easily
    const easeIntervalId = window.setInterval(() => {
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
        window.clearInterval(easeIntervalId);
      }
      if(calcTimer > 0) {
        calcTimer--;
      }
    }, 1000 / this.updatesPerSecond);
  }

  easeOut(duration) {
    this.ease(duration, true);
  }

  easeIn(duration) {
    this.ease(duration);
  }

  setEaseInDelay(milliseconds) {
    window.setTimeout(() => {
      this.easeIn(500);
    }, milliseconds);
  }

  setEaseOutDelay(milliseconds) {
    window.setTimeout(() => {
      this.easeOut(500);
    }, milliseconds);
  }

  setEaseInOutDelay(milliseconds, flip) {
    window.setTimeout(() => {
      this.easeInOut(500, flip);
    }, milliseconds);
  }
}

export default RjMesh;
