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

  applyEffect(effectType, input) {
    switch (effectType) {
      case 'opacity':
        this[effectType] = input;
        this.mesh.material.opacity = this.opacity;
        break;
      case 'glowIntensity':
        this[effectType] = input;
        break;
      default:
        console.warn('entered invalid effectType');
    }
  }

  ease(effectType, duration, easeOut = false) {
    const that = this;
    const startTime = Date.now();
    const easeIntervalId = window.setInterval(() => {
      const currentTime = Date.now() - startTime;
      let effectInput;
      if(easeOut) {
        effectInput = utils.easeOut(currentTime, duration);
      } else {
        effectInput = utils.easeIn(currentTime, duration);
      }
      this.applyEffect(effectType, effectInput);
      const finished = easeOut ? effectInput <= 0 : effectInput >= 1;
      if (finished) {
        window.clearInterval(easeIntervalId);
      }
    }, 1000 / this.updatesPerSecond);
  }

  easeInOut(effectType, duration, flip = false) {
    const that = this;
    const startTime = Date.now();
    let calcTimer = 3; // hack for figuring out "finished" state easily
    const easeIntervalId = window.setInterval(() => {
      const currentTime = Date.now() - startTime;
      let effectInput;
      if(flip) {
        effectInput = utils.easeOutIn(currentTime, duration);
      } else {
        effectInput = utils.easeInOut(currentTime, duration);
      }
      this.applyEffect(effectType, effectInput);
      let finished = false;
      if(calcTimer == 0) {
        finished = flip ? effectInput >= 1 : effectInput <= 0;
      }
      if (finished) {
        window.clearInterval(easeIntervalId);
      }
      if(calcTimer > 0) {
        calcTimer--;
      }
    }, 1000 / this.updatesPerSecond);
  }

  easeOut(effectType, duration) {
    this.ease(effectType, duration, true);
  }

  easeIn(effectType, duration) {
    this.ease(effectType, duration);
  }

  setEaseInDelay(effectType, milliseconds) {
    window.setTimeout(() => {
      this.easeIn(effectType, 500);
    }, milliseconds);
  }

  setEaseOutDelay(effectType, milliseconds) {
    window.setTimeout(() => {
      this.easeOut(effectType, 500);
    }, milliseconds);
  }

  setEaseInOutDelay(effectType, milliseconds, flip) {
    window.setTimeout(() => {
      this.easeInOut(effectType, 500, flip);
    }, milliseconds);
  }
}

export default RjMesh;
