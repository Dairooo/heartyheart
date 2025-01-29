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
let showMessageDuration = 5000; // Time in milliseconds to show the message (5 seconds)
let showMessage = true; // Flag to control when the message is shown

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

  lines.forEach((line, index) => {
    ctx.fillText(line.trim(), width / 2, height / 2 + index * lineHeight);
  });

  // Redraw message on resize
  window.addEventListener('resize', function () {
    width = canvas.width = koef * innerWidth;
    height = canvas.height = koef * innerHeight;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    // Redraw message
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), width / 2, height / 2 + index * lineHeight);
    });
  });

  let heartPosition = function (rad) {
    return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
  };

  let scaleAndTranslate = function (pos, sx, sy, dx, dy) {
    return [dx + pos[0] * sx, dy + pos[1] * sy];
  };

  let traceCount = mobile ? 20 : 50;
  let pointsOrigin = [];
  let i;
  let dr = mobile ? 0.3 : 0.1;
  for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
  for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
  for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
  let heartPointsCount = pointsOrigin.length;

  let targetPoints = [];
  let pulse = function (kx, ky) {
    for (i = 0; i < pointsOrigin.length; i++) {
      targetPoints[i] = [];
      targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
      targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
    }
  };

  let e = [];
  for (i = 0; i < heartPointsCount; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    e[i] = {
      vx: 0,
      vy: 0,
      R: 2,
      speed: Math.random() + 5,
      q: ~~(Math.random() * heartPointsCount),
      D: 2 * (i % 2) - 1,
      force: 0.2 * Math.random() + 0.7,
      f: "hsla(0," + ~~(40 * Math.random() + 60) + "%," + ~~(60 * Math.random() + 20) + "%,.3)",
      trace: []
    };
    for (let k = 0; k < traceCount; k++) e[i].trace[k] = { x: x, y: y };
  }

  let config = {
    traceK: 0.4,
    timeDelta: 0.01
  };

  let time = 0;
  let loop = function () {
    if (showMessage) {
      return; // Don't run heart animation while the message is still showing
    }

    let n = -Math.cos(time);
    pulse((1 + n) * 0.5, (1 + n) * 0.5);
    time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;
    ctx.fillStyle = "rgba(0,0,0,.1)";
    ctx.fillRect(0, 0, width, height);

    for (i = e.length; i--;) {
      var u = e[i];
      var q = targetPoints[u.q];
      var dx = u.trace[0].x - q[0];
      var dy = u.trace[0].y - q[1];
      var length = Math.sqrt(dx * dx + dy * dy);
      if (10 > length) {
        if (0.95 < Math.random()) {
          u.q = ~~(Math.random() * heartPointsCount);
        } else {
          if (0.99 < Math.random()) {
            u.D *= -1;
          }
          u.q += u.D;
          u.q %= heartPointsCount;
          if (0 > u.q) {
            u.q += heartPointsCount;
          }
        }
      }
      u.vx += -dx / length * u.speed;
      u.vy += -dy / length * u.speed;
      u.trace[0].x += u.vx;
      u.trace[0].y += u.vy;
      u.vx *= u.force;
      u.vy *= u.force;
      for (k = 0; k < u.trace.length - 1;) {
        let T = u.trace[k];
        let N = u.trace[++k];
        N.x -= config.traceK * (N.x - T.x);
        N.y -= config.traceK * (N.y - T.y);
      }
      ctx.fillStyle = u.f;
      for (k = 0; k < u.trace.length; k++) {
        ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
      }
    }
    window.requestAnimationFrame(loop, canvas);
  };

  // Show the heart animation after the specified duration
  setTimeout(() => {
    showMessage = false; // Hide the message after the duration
    loop(); // Start heart animation
  }, showMessageDuration);
};

let s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);
              
