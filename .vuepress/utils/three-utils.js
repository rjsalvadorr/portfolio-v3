///////////////////////////////////////////////////////////////////////////////
//   UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
* Returns a value between minValue and maxValue (both inclusive), where 
* x = minValue returns minValue
* x = (period / 2) returns maxValue
* x = (period * 2) returns minValue
* x = (period * 2.5) returns maxValue
* x = (period * 3) returns minValue
* etc...
*/
const periodicFunction = (x, period, minValue, maxValue) => {
  const cosArg = x * Math.PI / (period / 2);
  const amplitude = (maxValue - minValue) / 2;
  return Math.cos(cosArg) * -amplitude + (amplitude + minValue);
};

/**
* Returns a set of coords (x, y) tracing a circle
* where period == time of cycle, and radius ==
* radius of the circle. The circle is centred at (0, 0)
*/
const circleFunction = (input, period, radius) => {
  const inputArg = input * Math.PI / (period / 2);
  const yCoord = Math.sin(inputArg) * radius;
  const xCoord = Math.cos(inputArg) * radius;
  return {
    x: xCoord,
    y: yCoord,
  }
};

/**
* Returns a set of coords (x, y, z) representing a point on a sphere
* with the given radius. The sphere is centered at (0, 0, 0)
*/
const getRandomSphereCoordinate = (radius) => {
  const xyCoords = circleFunction(getRandomInt(50, 1000), 100, radius);
  const xRadius = Math.abs(xyCoords.x);
  const xzCoords = circleFunction(getRandomInt(50, 1000), 100, xRadius);
  return {
    x: xzCoords.x,
    y: xyCoords.y,
    z: xzCoords.y,
  }
};

/**
* Returns a set of coords (x, y, z) representing a point on a cylinder
* with the given radius. The cylinder is centered at (0, 0, 0)
*/
const getRandomCylinderCoordinate = (radius, height) => {
  const xzCoords = circleFunction(getRandomInt(50, 1000), 100, radius);
  const halfHeight = height / 2
  const yCoord = getRandomInt(-halfHeight, halfHeight);
  return {
    x: xzCoords.x,
    y: yCoord,
    z: xzCoords.y,
  }
};

/**
* Returns a random normalized vector.
*/
const getRandomVector = () => {
  const newVector = new THREE.Vector3(
    getRandomInt(-5, 5),
    getRandomInt(-5, 5),
    getRandomInt(-5, 5),
  );
  return newVector.normalize();
};

/**
* Returns a sorted set of floats between
* the given min and max.
*/
const getNumberSet = (min, max, num) => {
  const numOfNums = num || 10;
  const returnArr = [];
  const abs = max - min;
  let currentVal;
  for(let i = 0; i < numOfNums; i++) {
    currentVal = Math.random();
    returnArr.push(abs * currentVal + min);
  }
  return returnArr.sort();
};

/**
* Returns a set of points tracing a circle.
* The circle is centred at (0, 0)
*/
const getPointsFromCircle = (numPoints, radius) => {
  console.log(this);
  const points = [];
  const period = 1;
  const maxVal = 1;
  const inputs = getNumberSet(0, maxVal, numPoints);
  let currentPt;
  for(let i = 0; i < inputs.length; i++) {
    currentPt = circleFunction(inputs[i], period, radius);
    points.push(currentPt);
  }
  return points;
};

/**
* Returns a set of points tracing a vertical spiral.
* The starting circle is centred at (0, 0)
*/
const getPointsFromSpiral = (numPoints, radius, maxHeight) => {
  const points = [];
  const period = 1;
  const maxVal = 1;
  const inputs = getNumberSet(0, maxVal, numPoints);
  let currentPt;
  for(let i = 0; i < inputs.length; i++) {
    currentPt = circleFunction(inputs[i], period, radius);
    currentPt.z = inputs[i] * maxHeight;
    points.push(currentPt);
  }
  return points;
}

const threeUtils = {
  getRandomInt: getRandomInt,
  periodicFunction: periodicFunction,
  circleFunction: circleFunction,
  getRandomSphereCoordinate: getRandomSphereCoordinate,
  getRandomCylinderCoordinate: getRandomCylinderCoordinate,
  getRandomVector: getRandomVector,
  getNumberSet: getNumberSet,
  getPointsFromCircle: getPointsFromCircle,
  getPointsFromSpiral: getPointsFromSpiral,
}

export default threeUtils;
