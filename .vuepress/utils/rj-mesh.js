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
  
  fadeOut(nextFunc) {
    console.log('fadeOut()');
    const that = this;
    const fadeIntervalId = window.setInterval(() => {
      that.opacity -= 0.1;
      that.mesh.material.opacity = this.opacity;
      if(that.opacity <= 0) {
        that.opacity = 0;
        window.clearInterval(fadeIntervalId);
        if(nextFunc) {
          nextFunc();
        }
      }
    }, 1000 / this.updatesPerSecond);
  }

  fadeIn(nextFunc) {
    console.log('fadeIn()');
    const that = this;
    const fadeIntervalId = window.setInterval(() => {
      that.opacity += 0.1;
      that.mesh.material.opacity = this.opacity;
      if(that.opacity >= 1) {
        that.opacity = 1;
        window.clearInterval(fadeIntervalId);
        if(nextFunc) {
          nextFunc();
        }
      }
    }, 1000 / this.updatesPerSecond);
  }

  setFadeInDelay(milliseconds) {
    window.setTimeout(() => {
      this.fadeIn();
    }, milliseconds);
  }

  setFadeOutDelay(milliseconds) {
    window.setTimeout(() => {
      this.fadeOut();
    }, milliseconds);
  }

  setFadeOutInDelay(msOut, msIn) {
    window.setTimeout(() => {
      this.fadeOut();
    }, msOut);

    window.setTimeout(() => {
      this.fadeIn();
    }, msIn);
  }
}

export default RjMesh;
