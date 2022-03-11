import Utils from './utils.js'; 

if(localStorage.getItem('bestScore') == null) {
  localStorage.setItem('bestScore', 0);
} 
document.querySelector('#best-score .score').innerHTML = parseInt(localStorage.getItem('bestScore'));

let gridElement = document.querySelector(".big-square");

initGrid();

document.addEventListener('keyup', (event) => {
  if(event.code !== 'ArrowUp' && event.code !== 'ArrowDown' && 
      event.code !== 'ArrowRight' && event.code !== 'ArrowLeft')
    return;

  switch (event.code) {
    case 'ArrowUp':
      Utils.move(-1, 0);
      break;
    case 'ArrowDown':
      Utils.move(1, 0);
      break;
    case 'ArrowRight':
      Utils.move(0, 1);
      break;
    case 'ArrowLeft':
      Utils.move(0, -1);
      break;
  };

  if(Utils.isWin()) {
    document.querySelector('.game-over h1').innerHTML = 'You won!';
    document.querySelector('.game-over').style.display = 'flex';
  }
  else if(Utils.isGameOver()) {
    document.querySelector('.game-over h1').innerHTML = 'Game over!';
    document.querySelector('.game-over').style.display = 'flex';
  } else {
    setTimeout(() => createNewElement(), 200);
  }
});

document.querySelector('.try-again').addEventListener('click', () => {
  initGrid();
  document.querySelector('.game-over').style.display = 'none';
});

function initGrid() {
  // init score
  document.querySelector(`#actual-score .score`).innerHTML = 0;

  // clear the grid
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      document.querySelector(`#square-${i}-${j}`)?.remove();
    }
  }
  // initialize two elements
  Utils.allowCreateNewElement = true;
  createNewElement();
  Utils.allowCreateNewElement = true;
  createNewElement();
}

function createNewElement() {
  if(!Utils.allowCreateNewElement) return;

  let element = Utils.popElement();
  let node = Utils.createNode(element);
  gridElement.appendChild(node);
  Utils.allowCreateNewElement = false;
}