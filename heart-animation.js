let showMessageDuration = 5000; // Duration in milliseconds (5 seconds)
let showMessage = true; // Flag to determine if the message should be shown

window.requestAnimationFrame =
  window.__requestAnimationFrame ||
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (function () {
    return function (callback, element) {
      let lastTime = element.__lastTime;
      if (lastTime === undefined) {
        lastTime = 0;
      }
      let currTime = Date.now();
      let timeToCall = Math.max(1, 33 - (currTime - lastTime));
      window.setTimeout(callback, timeToCall);
      element.__lastTime = currTime + timeToCall;
    };
  })();

window.isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));

let loaded = false;
let init = function () {
  if (loaded) return;
  loaded = true;

  let mobile = window.isDevice;
  let koef = mobile ? 0.5 : 1;
  let canvas = document.getElementById('heart');
  let ctx = canvas.getContext('2d');
  let width = canvas.width = koef * innerWidth;
  let height = canvas.height = koef * innerHeight;

  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, width, height);

  // Display birthday message
  const message = `Hi Ash, Happy Birthday!! Wishing you nothing but the absolute best in your life. 
  I wish for everything that u wanna happen, to happen. Be it you mahimog but an, mo taas ang height, 
  or unsa paman na. I wish you nothing but the absolute best gud, I'll be forever supporting you here. 
  Once again, Happy Birthday Ashlynn!! Enjoy your most memorable day.\n\nSincerely yours, Nathan.`;

  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  const lines = message.split("\n");
  const lineHeight = 20;

  let drawMessage = function () {
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), width / 2, height / 2 + index * lineHeight);
    });
  };

  // Redraw message on resize
  window.addEventListener('resize', function () {
    width = canvas.width = koef * innerWidth;
    height = canvas.height = koef * innerHeight;
    if (showMessage) drawMessage();
  });

  // Heart animation logic
  let heartPosition = function (rad) {
    return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
  };
  
  let scaleAndTranslate = function (pos, sx, sy, dx, dy) {
    return [dx + pos[0] * sx, dy + pos[1] * sy];
  };

  let points = [];
  let dr = 0.1;
  for (let i = 0; i < Math.PI * 2; i += dr) {
    points.push(scaleAndTranslate(heartPosition(i), 210, 13, width / 2, height / 2));
  }

  let time = 0;
  let loop = function () {
    if (showMessage) {
      drawMessage(); // Keep drawing the message while it's showing
      return;
    }

    let n = -Math.cos(time);
    let scale = (1 + n) * 0.5;
    ctx.fillStyle = "rgba(0,0,0,.1)";
    ctx.fillRect(0, 0, width, height);

    // Animate the heart shape with scaling
    let scaledPoints = [];
    for (let i = 0; i < Math.PI * 2; i += dr) {
      scaledPoints.push(scaleAndTranslate(heartPosition(i), 210 * scale, 13 * scale, width / 2, height / 2));
    }

    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    scaledPoints.forEach(([x, y]) => {
      ctx.fillRect(x, y, 2, 2);
    });

    time += 0.02;
    window.requestAnimationFrame(loop, canvas);
  };

  // Display the message initially
  drawMessage();

  // Hide the message after the specified duration
  setTimeout(() => {
    showMessage = false;
    loop(); // Start the heart animation loop
  }, showMessageDuration);
};

let s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);
