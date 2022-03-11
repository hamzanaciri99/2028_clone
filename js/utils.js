export default class Utils {

  static smallSquareWidth = 6;
  static gap = 0.75;

  static popElement() {
    let emptyElements = [];

    for(let i = 0; i < 4; ++i) {
      for(let j = 0; j < 4; ++j) {
        if(!this.exists(i, j)) {
          emptyElements.push([i, j]);
        }
      }
    }

    let index = Math.floor(Math.random() * emptyElements.length);
    let element = emptyElements[index];
    return element;
  }

  static createNode([x, y]) {
    let node = document.createElement('div');
    node.classList.add('small-square');
    node.classList.add('overlay-square');
    node.id = `square-${x}-${y}`;
    node.innerText = '2';

    let top = (x + 1) * this.gap + x * this.smallSquareWidth;
    let left = (y + 1) * this.gap + y * this.smallSquareWidth;
    node.style.setProperty('top', `${top}rem`);
    node.style.setProperty('left', `${left}rem`);

    return node;
  }

  static move(x, y) {
    const moveElementAt = (i, j) => {
      //delete element at (i + x, j + y)
      let oldNodeElement = document.querySelector(`#square-${i + x}-${j + y}`);
      let oldValue = parseInt(oldNodeElement?.innerHTML || 0);
      oldNodeElement?.remove();

      //move element at (i, j) to (i + x, j + y)
      let nodeElement = document.querySelector(`#square-${i}-${j}`);
      nodeElement.style.transform += `translateX(${(this.smallSquareWidth + this.gap) * y}rem)`;
      nodeElement.style.transform += `translateY(${(this.smallSquareWidth + this.gap) * x}rem)`;
      nodeElement.id = `square-${i + x}-${j + y}`;

      // update element value
      nodeElement.innerHTML = parseInt(nodeElement.innerHTML) + oldValue;
    };

    const loopVars = {
      start: {
        '-1': 0,
        0: 0,
        1: 3
      },
      end: {
        '-1': 4,
        0: 4,
        1: -1
      },
      step: {
        '-1': 1,
        0: 1,
        1: -1
      }
    };

    for (let i = loopVars.start[x]; i != loopVars.end[x]; i += loopVars.step[x]) {
      for (let j = loopVars.start[y]; j != loopVars.end[y]; j += loopVars.step[y]) {
        let _i = i, _j = j;
        while (this.isValidGridElement(_i, _j, x, y) && !this.exists(_i + x, _j + y)) {
          moveElementAt(_i, _j);
          _i += x;
          _j += y;
        }
        if (this.isValidGridElement(_i, _j, x, y) && this.equals(_i, _j, _i + x, _j + y)) {
          moveElementAt(_i, _j);
        }
      }
    }
  }

  static equals(i, j, _i, _j) {
    let content1 = document.querySelector(`#square-${i}-${j}`)?.innerHTML;
    let content2 = document.querySelector(`#square-${_i}-${_j}`)?.innerHTML;

    return this.exists(i, j) && this.exists(_i, _j) && content1 == content2;
  }

  static exists(i, j) {
    return document.querySelector(`#square-${i}-${j}`) !== null;
  }

  static isValidGridElement(i, j, x, y) {
    return document.querySelector(`#square-${i}-${j}`) !== null
      && i + x >= 0 && i + x < 4
      && j + y >= 0 && j + y < 4;
  }
}