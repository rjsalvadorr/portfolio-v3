import { Mesh } from 'three';
import utils from './three-utils';

class Box {
  constructor(length = 0, width = 0, x = 0, y = 0) {
    this.id = Math.random()
      .toString(36)
      .substring(7)
      .toUpperCase();
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
  }
}

class InfiniteBoxes {
  constructor(totalLength, numBoxes, width, y = 0, movePositive = false, gutter = 1) {
    this.totalLength = totalLength;
    this.boxes = [];
    this.gutter = gutter;
    this.movePos = movePositive;

    const min = totalLength / numBoxes * 0.66;
    const boxLengths = utils.splitRough(totalLength, numBoxes, min);
    let startingX = 0;
    for (let len of boxLengths) {
      this.boxes.push(new Box(len, width, startingX, y));
      startingX += len + this.gutter;
    }
  }

  moveBoxes() {
    let boxEdges;
    let sortedEdges;
    let maxX;
    let limitReached;
    for (let box of this.boxes) {
      box.x += this.movePos ? 3 : -3;
      if (this.movePos) {
        box.x += 3;
        limitReached =
          box.x > this.totalLength + this.gutter * this.boxes.length;
      } else {
        box.x -= 3;
        limitReached = box.x < 0;
      }

      if (limitReached) {
        if (this.movePos) {
          box.x = 0;
        } else {
          boxEdges = this.boxes.map(box => {
            return box.length + box.x;
          });
          sortedEdges = boxEdges.sort((a, b) => {
            return b - a;
          });
          maxX = sortedEdges[0];
          box.x = maxX + this.gutter;
        }
      }
    }
  }
}

export default InfiniteBoxes;