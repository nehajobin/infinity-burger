const canvas = document.getElementById('burgerCanvas');
const ctx = canvas.getContext('2d');
const burger = new Image();
burger.src = 'burger-removebg-preview.png'; // Update path if needed

const biteSound = document.getElementById('biteSound');
biteSound.volume = 1.0;

const burpSound = document.getElementById('burpSound');
burpSound.volume = 1.0;

const dudeImage = document.getElementById('dudeImage');
const funnyMessage = document.getElementById('funnyMessage');
const messageBox = document.getElementById("bitemessage");

const biteMessages = [
  "Mmm... juicy!",
  "Again?! Slow down!",
  "Bite #??, still hungry?",
  "Who hurt you?",
  "This burger has rights!",
  "Calories? Never heard of them.",
  "Ever considered a salad?",
  "You'll turn into a burger at this rate!",
  "Burger bites back soon..."
];

let biteCount = 0;
const biteThreshold = 10;

burger.onload = () => {
  canvas.width = burger.width;
  canvas.height = burger.height;
  drawBurger();
};

function drawBurger() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(burger, 0, 0);
}

function bite(x, y) {
  const radius = 40;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  
  biteSound.currentTime = 0;
  biteSound.play();

  
  const msg = biteMessages[biteCount % biteMessages.length];
  messageBox.innerText = msg;
  messageBox.style.display = "block";
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 1500);

  biteCount++;

  
  if (biteCount === biteThreshold || (biteCount > biteThreshold && biteCount % 5 === 0)) {
    burpSound.currentTime = 0;
    burpSound.play();
    showFunnyDude();
  }

  if (biteCount >= 15) {
    biteCount = 0;
    setTimeout(drawBurger, 1000);
  }
}

function showFunnyDude() {
  dudeImage.style.display = 'block';
  funnyMessage.style.display = 'block';

  let pos = -200;
  const interval = setInterval(() => {
    if (pos < 20) {
      pos += 5;
      dudeImage.style.left = pos + 'px';
    } else {
      clearInterval(interval);
      setTimeout(() => {
        dudeImage.style.display = 'none';
        funnyMessage.style.display = 'none';
        dudeImage.style.left = '-200px';
      }, 3000);
    }
  }, 30);
}

function getPos(evt) {
  const rect = canvas.getBoundingClientRect();
  if (evt.touches) {
    return {
      x: evt.touches[0].clientX - rect.left,
      y: evt.touches[0].clientY - rect.top
    };
  } else {
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}

canvas.addEventListener('click', (e) => {
  const { x, y } = getPos(e);
  bite(x, y);
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const { x, y } = getPos(e);
  bite(x, y);
});
