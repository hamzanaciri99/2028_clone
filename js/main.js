import Utils from './utils.js'; 

let gridElement = document.querySelector(".big-square");

createNewElement();

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'ArrowUp':
      Utils.move(-1, 0);
      setTimeout(() => createNewElement(), 200);
      break;
    case 'ArrowDown':
      Utils.move(1, 0);
      setTimeout(() => createNewElement(), 200);
      break;
    case 'ArrowRight':
      Utils.move(0, 1);
      setTimeout(() => createNewElement(), 200);
      break;
    case 'ArrowLeft':
      Utils.move(0, -1);
      setTimeout(() => createNewElement(), 200);
      break;
 };
});

function createNewElement() {
  let element = Utils.popElement();
  let node = Utils.createNode(element);
  gridElement.appendChild(node);
}

