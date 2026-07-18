const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas(){
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function drawHeart(x, y, size, rotation, color){
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(0, -4, -10, -6, -10, 2);
  ctx.bezierCurveTo(-10, 9, -3, 12, 0, 16);
  ctx.bezierCurveTo(3, 12, 10, 9, 10, 2);
  ctx.bezierCurveTo(10, -6, 0, -4, 0, 4);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

class AmbientHeart{
  constructor(){ this.reset(true); }
  reset(initial){
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 20;
    this.size = 8 + Math.random() * 14;
    this.speed = 0.25 + Math.random() * 0.5;
    this.drift = (Math.random() - 0.5) * 0.4;
    this.alpha = 0.18 + Math.random() * 0.28;
    this.rotation = (Math.random() - 0.5) * 0.6;
    this.rotSpeed = (Math.random() - 0.5) * 0.004;
    this.rgb = Math.random() < 0.5 ? '255,95,150' : '255,255,255';
  }
  update(){
    this.y -= this.speed;
    this.x += this.drift;
    this.rotation += this.rotSpeed;
    if (this.y < -20) this.reset(false);
  }
  draw(){
    drawHeart(this.x, this.y, this.size, this.rotation, `rgba(${this.rgb},${this.alpha})`);
  }
}

const HEART_COUNT = 26;
const ambientHearts = Array.from({ length: HEART_COUNT }, () => new AmbientHeart());

function animate(){
  ctx.clearRect(0, 0, width, height);
  ambientHearts.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(animate);
}

if (!reducedMotion){
  animate();
} else {
  ambientHearts.forEach(h => h.draw());
}
