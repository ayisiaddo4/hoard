/* eslint-disable immutable/no-mutation*/
/* eslint-disable no-undef*/
/* eslint-disable no-console*/

global.timer = {};

function start(key) {
  if (!key) {
    console.log('You must pass a timer key');
  }

  const now = performance.now();

  console.log(`${key}: START`);

  global.timer[key] = [now];
}

function step(key) {
  if (!key) {
    console.log('You must pass a timer key');
  }

  const now = performance.now();
  const prev = global.timer[key][global.timer[key].length - 1];
  global.timer[key].push(now);

  const duration = now - prev;

  global.timerStep = now;
  console.log(
    `${key + ' '} STEP ${global.timer[key].length - 1} to STEP ${
      global.timer[key].length
    }: ${duration} ms`
  );
}

function stop(key) {
  if (!key) {
    console.log('You must pass a timer key');
  }

  const now = performance.now();
  const prev = global.timer[key][global.timer[key].length - 1];
  global.timer[key].push(now);

  const duration = now - prev;

  global.timerStep = now;
  console.log(
    `${key + ' '} STEP ${global.timer[key].length - 1} to STEP ${
      global.timer[key].length
    }: ${duration} ms. DONE!`
  );

  delete global.timer[key];
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
