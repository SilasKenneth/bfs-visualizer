'use strict';

var canvas = document.getElementById("canvas");

var ctx = canvas.getContext('2d');
var thickness = 1;
var scale = thickness;
ctx.lineWidth = thickness;

// Wall

ctx.strokeStyle = "#f84343";
ctx.fillStyle = "#e84343";

var cells = 50;
let matrix = new Array(cells);
for(let i = 0; i < cells; i++){
   matrix[i] = new Array(cells);
}

// Data structures
function Cell(x, y, token){
   this.x = x;
   this.y = y;
   this.token = token;
   this.visited = false;
   this.blocked = false;
   this.neighbours = new Array();
   this.parent = undefined;
}

Cell.prototype.addNeighbours = function(){
     if(Number(this.x - 1) >= 0){
         if(!matrix[this.x - 1][this.y].blocked){
            this.neighbours.push(matrix[Number(this.x - 1)][this.y]);
         }
     }

     if(Number(this.x + 1) < cells){
         if(!matrix[this.x + 1][this.y].blocked){
             this.neighbours.push(matrix[this.x + 1][this.y]);
         }
     }

     if(Number(this.y - 1) >= 0){
        if(!matrix[this.x][this.y - 1].blocked){
            this.neighbours.push(matrix[this.x][Number(this.y - 1)]);
         }
     }
     if(Number(this.y + 1) < cells){
        if(!matrix[this.x][this.y + 1].blocked){
           this.neighbours.push(matrix[this.x][this.y + 1]);
        }
     }
}

Cell.prototype.block = function(){
  this.blocked = true;
  this.token = 1;
}

function Queue(){
   this.MAX_SIZE = cells * cells + 2;
   this.data = new Array(this.MAX_SIZE);
   this.topIndex = -1;
   this.currentInsert = 0;
   this.currentSize = 1;
}

Queue.prototype.enqueue = function(node){
    if(node.visited === false){
        this.data[this.currentInsert] = node;
        ++this.currentInsert;
        ++this.currentSize;
    }
}

Queue.prototype.deque = function(){
   if(this.currentSize <= 0){
      console.warn("The queue is empty");
      return;
   }
   ++this.topIndex;
   --this.currentSize;
   return this.data[this.topIndex];
}

Queue.prototype.isEmpty = function() {
   return this.currentSize <= 0;
}


for(let i = 0; i < cells; i++){
   for(let j = 0; j < cells; j++){
       let token = (Math.random() < 0.3000000000) ? 1 : 0;
       matrix[i][j] = new Cell(Number(i), Number(j), token);
       if(matrix[i][j].token === 1){
          matrix[i][j].block();
       }
   }
}

matrix[cells - 1][cells - 1].blocked = false;
for(let i = 0; i < cells; i++){
   for(let j = 0; j < cells; j++){
      matrix[i][j].addNeighbours();
   }
}

// End of Structures
var width = 10
var height = 10

var pathFound = false;
matrix[matrix.length - 1][matrix[0].length - 1].token = 2;

console.log(matrix);
var bfs = function(start){
   var Q = new Queue();
   start.token = 0;
   start.blocked = false;
   Q.enqueue(start);
   var visitedNodes = new Array();
   while(!Q.isEmpty()){
       var top = Q.deque();
       if(top === undefined){
//          console.log("CRAP!!!!!!", loops, Q);
          break;
       }
       top.visited = true;
       visitedNodes.push(top);
       if(top.token === 2){
          pathFound = true;
          break;
       }
       for(let neighbour of top.neighbours){
          if((!neighbour.visited) && (!neighbour.blocked)){
               Q.enqueue(neighbour);
               neighbour.parent = top;
               neighbour.visited = true;
          }
       }
       //loops--;
   }
   console.log(Q);
   console.log(visitedNodes);
}

bfs(matrix[0][0]);

var target = matrix[matrix.length - 1][matrix[0].length - 1];


while(target !== undefined){
   if(target.x === 0 && target.y === 0){
      target.token = 3;
      break;
   }
   target.token = 3;
   target = target.parent;
}

console.log(matrix);
for(let i = 0; i < cells; i++){
   for(let j = 0; j < cells; j++){
       if(matrix[i][j].token === 0){
          if(matrix[i][j].visited){
             ctx.fillStyle = "green";
             ctx.fillRect(width * i, height * j, width, height);
          } else{
                ctx.strokeRect(width * i, height * j, width, height);
          }
       } else if(matrix[i][j].token === 1){
          ctx.fillStyle = "#e84343";
          ctx.fillRect(width * i, height * j, width, height);
       } else if(matrix[i][j].token === 2){
          ctx.fillStyle = "#5c5";
          ctx.fillRect(width * i, height * j, width, height);
       } else if(matrix[i][j].token === 3){
          ctx.fillStyle = "#345";
          ctx.fillRect(width * i, height * j, width, height);
       }

   }
}