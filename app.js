var n = 10;
var groups = (n*n) / 5;
var firstGroup = Math.ceil(groups);
groups = Math.floor(groups);
var screenW = 450;
var screenH = 450; 
screenH+=n;
screenW+=n;
var screen = new Screen('screen',screenW,screenH); 

var tile= [];//hold all tiles 
var weights = []; // hold tile locations during shuffle
var swapOrder =[];

function Rect(x,y,w,h,color){
    this.x = parseInt(screenW/2 + x);
    this.y = parseInt(screenH/2 -y); 
    this.w = parseInt(w/2);
    this.h = parseInt(h/2); 
    this.color = color;
}
function colorRect(sq){
    for(let y = sq.y-sq.h; y <= sq.y+sq.h; y++)
      for(let x = sq.x-sq.w; x <= sq.x+sq.w; x++)
        screen.setPixelColor(x,y,sq.color);
}
// generate 81 squares, evenly distrubted with a range of 
// red, green, and blue squares
//17 steps  from 0,0,0 -> 255,0,0       R
//16 steps  from 255,0,0 -> 255,255,0
//16 steps  from 255,255,0 -> 0,255,0   G
//16 steps  from 0,255,0 ->  0,255,255
//16 steps  from 0,255,255 -> 0,0,255   B
function generatetiles(){
    let boxW = (screenW-n) /n; 
    let boxH = (screenH-n) /n; 
    let startX = -screenW/2 + boxW/2;
    let endX = screenW/2 - boxW/2-1;
    let X = startX;
    let Y = screenH/2 - boxH/2;
    let weight = 0; 
    let dir = 1;
    var step = (255*5) / (n*n);
    let r = 0, g = 0, b = 0;

    for( let i = 0; i < n*n; i++){
        let color = new Color(r,g,b);
        tile.push( new Rect(X,Y,boxW,boxH,color));
        weights.push(weight);
        weight++;
        X += boxW*dir +1*dir;
        if(X > endX || X < startX ){
            dir *=-1;
            Y-= 1*boxH+1;
            if(X>endX ) X = endX;
            else X = startX;
        }
        if(i < firstGroup)r += step;
        else if(i < (firstGroup+groups)) g += step;
        else if(i < (firstGroup+2*groups)) r -= step;
        else if(i < (firstGroup+3*groups)) b += step;
        else if(i < (firstGroup+4*groups)) g -= step;
    }
}
function swapTiles(i,j){
    let x = tile[i].x;
    let y = tile[i].y;

    tile[i].x = tile[j].x;
    tile[i].y = tile[j].y;

    tile[j].x = x;
    tile[j].y = y;

    let w = weights[i];
    weights[i] = weights[j];
    weights[j] = w;
}
function shuffleTiles(){
    for(k = 0; k < tile.length; k++){
        let j = Math.floor(Math.random() * tile.length);
        let i = Math.floor(Math.random() * tile.length);
        while(i == j)
        i = Math.floor(Math.random() * tile.length);
        swapTiles(i,j);
    }
}


function render(){
    screen.clearColor(new Color());
    tile.forEach(ele => colorRect(ele));
    screen.render();
}
function print(list){
    let string = "";
    for(i = 0; i < list.length;i++){
        string += list[i] + ", ";
    }
    console.log(string);
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}
var delay = 1000/500;
var count = 0;
async function moveTo(sq,dist,i,j){
    let start = new Date().getTime();
    let diffX = Math.abs(sq.x-dist[0]);
    let diffY = Math.abs(sq.y-dist[1]);
    if(sq.x < dist[0]){
        if(diffX > sq.w)
            sq.x += Math.floor(sq.w/2);
        else if(diffX > 3)
            sq.x +=2;
        else
            sq.x +=1;
    }
    if(sq.x > dist[0]){
        if(diffX > sq.w)
            sq.x -=  Math.floor(sq.w/2);
        else if(diffX > 3)
            sq.x -=2;
        else
            sq.x -=1;
    }
    if(sq.y < dist[1]){
        if(diffY > sq.h)
            sq.y += Math.floor(sq.w/2);
        else if(diffY > 3)
            sq.y +=2;
        else
            sq.y +=1;
    }
    if(sq.y > dist[1]){
        if(diffY > sq.h)
            sq.y -= Math.floor(sq.w/2);
        else if(diffY > 3)
            sq.y -=2;
        else
            sq.y -=1;
    }
    render();
    await sleep(start + delay - new Date().getTime());
    if(diffX> 0 || diffY> 0 ){
        moveTo(sq,dist,i,j);
    }
    else if( P < swapOrder.length ){
        count++;
        if(count == 2){
            count = 0;
            tile[j].color = tile[tile.length-1].color;
            tile[i].color = tile[tile.length-2].color;
            tile.pop();
            tile.pop();
            sortPair();
        }
    }else
    console.log("finished");
}
function copy(sq){
    let temp = new Rect(sq.x,sq.y,2*sq.w,2*sq.h,sq.color);
    temp.x = sq.x;
    temp.y = sq.y;
    return temp;
}
var P = 0;
function sortPair(){
    let i = swapOrder[P];
    let j = swapOrder[P+1];
    P +=2;
    let sqI = copy(tile[i]);
    let sqJ = copy(tile[j]);
    tile[i].color = new Color();
    tile[j].color = new Color();
    let iDist = [sqJ.x,sqJ.y];
    let jDist = [sqI.x,sqI.y];
    swapTiles(i,j);
    tile.push(sqI);
    tile.push(sqJ);
    moveTo(sqI,iDist,i,j);
    moveTo(sqJ,jDist,i,j);
}

screen.init();
generatetiles();
shuffleTiles();
quickSort(weights,0,n*n-1,swapOrder);

render();
sortPair();
