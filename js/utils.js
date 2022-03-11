export default class Utils {

  static COLORS = ['#fff600', '#ffc302', '#ff8f00', '#ff5b00', '#ff0505'];

  static smallSquareWidth = 6;
  static gap = 0.75;

  static allowCreateNewElement = false;

  static isWin() {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (document.querySelector(`#square-${i}-${j}`)?.innerHTML === '2048') {
          return true;
        }
      }
    }
    return false;
  }

  static isGameOver() {
    let emptyElements = this.getEmptyElements();
    if (emptyElements.length !== 0) return false;

    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (this.equals(i, j, i + 1, j) || this.equals(i, j, i - 1, j) ||
          this.equals(i, j, i, j + 1) || this.equals(i, j, i, j - 1)) {
          return false;
        }
      }
    }
    return true;
  }

  static popElement() {
    let emptyElements = this.getEmptyElements();

    let index = Math.floor(Math.random() * emptyElements.length);
    let element = emptyElements[index];
    return element;
  }

  static getEmptyElements() {
    let emptyElements = [];

    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (!this.exists(i, j)) {
          emptyElements.push([i, j]);
        }
      }
    }
    return emptyElements;
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

    let score = 0;

    const moveElementAt = (i, j) => {
      this.allowCreateNewElement = true;

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
      this.changeBackgroundColor(nodeElement);

      //update score
      score += (oldValue > 0) ? parseInt(nodeElement.innerHTML) : 0;
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

    if (score > 0) {
      const bestScore = parseInt(localStorage.getItem('bestScore'));
      const newScore = parseInt(document.querySelector('#actual-score .score').innerHTML) + score;
      document.querySelector(`#actual-score .score`).innerHTML = newScore;

      if(bestScore < newScore) {
        localStorage.setItem('bestScore', newScore);
        document.querySelector('#best-score .score').innerHTML = newScore;
      }
      this.displayAddedScore(score);
    }
  }

  static changeBackgroundColor(nodeElement) {
    const value = parseInt(nodeElement.innerHTML);
    if (value >= 1024) {
      nodeElement.style.backgroundColor = this.COLORS[4];
    } else if(value >= 512) {
      nodeElement.style.backgroundColor = this.COLORS[3];
    } else if(value >= 256) {
      nodeElement.style.backgroundColor = this.COLORS[2];
    } else if(value >= 64) {
      nodeElement.style.backgroundColor = this.COLORS[1];
    } else if(value >= 32) {
      console.log(this.COLORS[0]);
      nodeElement.style.backgroundColor = this.COLORS[0];
    }
  }

  static displayAddedScore(score) {
    const element = document.querySelector(`#actual-score .score-plus`);
    element.innerHTML = `+${score}`;
    element.style.animation = 'none';
    setTimeout(function() {
        element.style.animation = '';
    }, 10);
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
    return this.exists(i, j)
      && i + x >= 0 && i + x < 4
      && j + y >= 0 && j + y < 4;
  }
}