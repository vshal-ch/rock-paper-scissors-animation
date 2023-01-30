const canvas = document.getElementById("canvas");
const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissors = document.getElementById("scissors");

const img = { rock, paper, scissors };

class App {
  items = [];
  backcolor = "#000000";
  textcolor = "#ff0000";
  #boundaryLength = 30;
  #animObject;
  temp = true;

  constructor(canvas) {
    this.canvas = canvas;
    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  init() {
    this.setwidth();
    this.#draw();
  }

  setwidth() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * @param {{ type: any; x: any; y: any; moveX: any; moveY: any; }} item
   */
  set addItem(item) {
    this.items.push(item);
  }

  #draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.items.length; i++) {
      this.#changeDirection(this.items[i]);
      this.#changePosition(this.items[i]);
    }
    this.#detectCollision();
    this.ctx.fillStyle = this.backcolor;
    if (this.temp) {
      this.#animObject = requestAnimationFrame(() => {
        this.#draw();
      });
    }
  }

  #detectCollision() {
    for (let i = 0; i < this.items.length; i++) {
      for (let j = i + 1; j < this.items.length; j++) {
        let distance = Math.sqrt(
          Math.pow(this.items[i].x - this.items[j].x, 2) +
            Math.pow(this.items[i].y - this.items[j].y, 2)
        );
        if (distance <= this.#boundaryLength) {
          this.#handleCollision(this.items[i], this.items[j]);
        }
      }
    }
  }

  #angleBetweenTwoPoints(x1, y1, x2, y2) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    return -1 * angle;
  }

  #handleCollision(item1, item2) {
    this.#decideDuel(item1, item2);
    let angle = this.#angleBetweenTwoPoints(item1.x, item1.y, item2.x, item2.y);
    if (angle > 0 && angle < 90) {
      item1.moveX = -1 * Math.abs(item1.moveX);
      item1.moveY = Math.abs(item1.moveY);
      item2.moveX = Math.abs(item2.moveX);
      item2.moveY = -1 * Math.abs(item2.moveY);
    } else if (angle > 90 && angle < 180) {
      item1.moveX = Math.abs(item1.moveX);
      item1.moveY = Math.abs(item1.moveY);
      item2.moveX = -1 * Math.abs(item2.moveX);
      item2.moveY = -1 * Math.abs(item2.moveY);
    } else if (angle < 0 && angle > -1 * 90) {
      item1.moveX = -1 * Math.abs(item1.moveX);
      item1.moveY = -1 * Math.abs(item1.moveY);
      item2.moveX = Math.abs(item2.moveX);
      item2.moveY = Math.abs(item2.moveY);
    } else if (angle < -1 * 90 && angle > -1 * 180) {
      item1.moveX = Math.abs(item1.moveX);
      item1.moveY = -1 * Math.abs(item1.moveY);
      item2.moveX = -1 * Math.abs(item2.moveX);
      item2.moveY = Math.abs(item2.moveY);
    } else if (angle == 0) {
      item1.moveX = -1 * Math.abs(item1.moveX);
      item2.moveX = Math.abs(item2.moveX);
    } else if (angle == 90) {
      item1.moveY = Math.abs(item1.moveY);
      item2.moveY = -1 * Math.abs(item2.moveY);
    } else if (angle == 180) {
      item1.moveX = Math.abs(item1.moveX);
      item2.moveX = -1 * Math.abs(item2.moveX);
    } else if (angle == -90) {
      item1.moveX = Math.abs(item1.moveX);
      item2.moveX = -1 * Math.abs(item2.moveX);
    }
  }

  #decideDuel(item1, item2) {
    if (item1.type === item2.type) {
      return;
    }
    if (
      (item1.type === "paper" && item2.type === "rock") ||
      (item1.type === "rock" && item2.type === "scissors") ||
      (item1.type === "scissors" && item2.type === "paper")
    ) {
      item2.type = item1.type;
      return;
    } else {
      item1.type = item2.type;
    }
  }

  #changePosition(item) {
    let { type, moveX, moveY, x, y } = item;
    this.ctx.fillStyle = this.textcolor;
    this.ctx.drawImage(img[type], x, y,30,30);
    item.x += moveX;
    item.y += moveY;
  }

  #changeDirection(item) {
    let padding = 100;
    if (item.x < padding + 0 || item.x > this.width - padding) {
      item.moveX = -item.moveX;
    } else if (item.y < padding + 0 || item.y > this.height - padding) {
      item.moveY = -item.moveY;
    }
  }

  generateRandom(count) {
    let padding = 100;
    for (let i = 0; i < count; i++) {
      let flag1 = Math.random();
      let flag2 = Math.random();
      let randX =
        Math.floor(Math.random() * (this.width - 2 * padding)) + padding;
      let randY =
        Math.floor(Math.random() * (this.height - 2 * padding)) + padding;
      let randMoveX = Math.random();
      let randMoveY = 1 - randMoveX;
      let randType = Math.floor(Math.random() * 3) + 1;
      this.addItem = createItem(
        i,
        randType,
        randX,
        randY,
        flag1 < 0.5 ? randMoveX : -randMoveX,
        flag2 < 0.5 ? -randMoveY : randMoveY
      );
    }
  }
}

function createItem(id, type, x, y, moveX, moveY) {
  if (type == 1) {
    type = "rock";
  } else if (type == 2) {
    type = "paper";
  } else {
    type = "scissors";
  }
  return {
    id,
    type,
    x,
    y,
    moveX,
    moveY,
  };
}

let app = new App(canvas);
app.generateRandom(20);
app.init();
