document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let score = 0;
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platform = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isMovingLeft = false;
  let isMovingRight = false;
  let leftTimerId;
  let rightTimerId;

  function reset() {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    score = 0;
    doodlerLeftSpace = 50;
    startPoint = 150;
    doodlerBottomSpace = startPoint;
    isGameOver = false;
    platformCount = 5;
    platform = [];
    upTimerId;
    downTimerId;
    isJumping = true;
    isMovingLeft = false;
    isMovingRight = false;
    leftTimerId;
    rightTimerId;
  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount;
      let newPlatformBottom = 100 + i * platformGap;
      console.log(platformGap, newPlatformBottom);
      let newPlatform = new Platform(newPlatformBottom);
      platform.push(newPlatform);
      console.log(platform);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platform.forEach((p) => {
        p.bottom -= 4;
        let visual = p.visual;
        visual.style.bottom = p.bottom + 'px';

        if (p.bottom < 10) {
          let firstPlatform = platform[0].visual;
          firstPlatform.classList.remove('platform');
          platform.shift();
          score++;
          console.log(platform);
          let newPlatform = new Platform(600);
          platform.push(newPlatform);
          console.log('score', score);
        }
      });
    }
  }

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platform[0].left;
    doodler.style.left = `${doodlerLeftSpace}px`;
    doodler.style.bottom = `${doodlerBottomSpace}px`;
  }

  function fall() {
    isJumping = false;
    clearInterval(upTimerId);

    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platform.forEach((p) => {
        if (
          doodlerBottomSpace >= p.bottom &&
          doodlerBottomSpace <= p.bottom + 15 &&
          doodlerLeftSpace + 60 >= p.left &&
          doodlerLeftSpace <= p.left + 85 &&
          !isJumping
        ) {
          console.log('tick');
          startPoint = doodlerBottomSpace;
          jump();
          console.log('start', startPoint);
          isJumping = true;
        }
      });
    }, 20);
  }
  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 20;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      let a = startPoint + 200;
      if (doodlerBottomSpace > a) {
        fall();
        isJumping = false;
      }
    }, 20);
  }

  function gameOver() {
    console.log('game over');
    isGameOver = true;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    const scoreHtml = document.createElement('h1');
    scoreHtml.innerHTML = score;
    grid.appendChild(scoreHtml);
    const btnStart = document.createElement('button');
    btnStart.innerHTML = 'Start';
    btnStart.addEventListener('click', () => {
      reset();
      start();
    });
    grid.appendChild(btnStart);
  }

  function moveLeft() {
    if (!isMovingLeft) {
      console.log('left');
      isMovingLeft = true;
      if (isMovingRight) {
        isMovingRight = false;
        clearInterval(rightTimerId);
      }
      leftTimerId = setInterval(() => {
        if (doodlerLeftSpace >= 0) {
          doodlerLeftSpace -= 5;
          doodler.style.left = doodlerLeftSpace + 'px';
        } else {
          moveRight();
        }
      }, 30);
    }
  }

  function moveRight() {
    if (!isMovingRight) {
      isMovingRight = true;
      if (isMovingLeft) {
        isMovingLeft = false;
        clearInterval(leftTimerId);
      }
      rightTimerId = setInterval(() => {
        if (doodlerLeftSpace <= 340) {
          doodlerLeftSpace += 5;
          doodler.style.left = doodlerLeftSpace + 'px';
        } else {
          moveLeft();
        }
      }, 30);
    }
  }

  function moveStraight() {
    console.log('straight');
    isMovingRight = false;
    isMovingLeft = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function control(e) {
    if (e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveStraight();
    }
  }

  function start() {
    isGameOver = false;
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener('keyup', control);
    }
  }

  start();
});
