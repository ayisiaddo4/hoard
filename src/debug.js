/* eslint-disable immutable/no-mutation*/
/* eslint-disable no-undef*/
/* eslint-disable no-console*/

global.timer = 0;
global.timerStep = null;

function start(l) {
  const label = l || '';
  const now = performance.now();
  console.log(`${label + ' '}START: now`);
  global.timer = now;
}

function step(l) {
  const label = l || '';
  const now = performance.now();

  const duration = global.timerStep
    ? now - global.timerStep
    : now - global.timer;

  const durationInSec = duration / 1000;
  global.timerStep = now;
  console.log(`${label + ' '} STEP: ${durationInSec} sec, ${duration} ms`);
}

function stop(l) {
  const label = l || '';
  const now = performance.now();
  const duration = now - global.timer;
  const durationInSec = duration / 1000;
  console.log(`${label + ' '} DURATION: ${durationInSec} sec, ${duration} ms`);
  global.timer = 0;
  global.timerStep = null;
}

if (__DEV__) {
  console.timerStart = start;
  console.timerStop = stop;
  console.timerStep = step;
} else {
  console.timerStart = function() {};
  console.timerStop = function() {};
  console.timerStep = function() {};
}
