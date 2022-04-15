var screenW = 450;
var screen;
var delay = 1000/60;
var n;// dim of squared number of tile, total = n*n 
var tileW; //width to color each tile 

var positions = [];// constant center locations for tiles 
var colorOrder = [];// color to draw on a position 
var weights = [];//list to represent tile locations 



//set screen to correct dimension, fill in tiles 
function setUp(dimension){
    n = dimension;  
    screenW +=n;
    screen = new Screen('screen',screenW,screenW); 
    tileW = Math.floor((screenW-n)/n); 
    console.log(tileW);
    screen.init();
    generatePositions();
}
function colorInPositions(){
    for(i = 0; i < positions.length; i++){
        pos = positions[i];
        let range = Math.floor(tileW/2);
        for(let y = pos[1]-range; y <= pos[1]+range; y++)
            for(let x = pos[0]-range; x <= pos[0]+range; x++)
                screen.setPixelColor(x,y,colorOrder[i]);
    }
}

// generate n*n Tiles, evenly distrubted with a range of 
// red, green, and blue squares
function generatePositions(){
    let groups = (n*n) / 5;
    let firstGroup = Math.ceil(groups);
    groups = Math.floor(groups);
    
    let startX = -screenW/2 + tileW/2;
    let endX = screenW/2 - tileW/2-1;
    let X = startX;
    let Y = screenW/2 - tileW/2;
    let dir = 1;
    var step = (255*5) / (n*n);
    let r = 0, g = 0, b = 0;
    
    for( let i = 0; i < n*n; i++){
        colorOrder.push(new Color(r,g,b));
        positions.push([parseInt(screenW/2 + X),parseInt(screenW/2 -Y)]);
        weights.push(i);
        X += tileW*dir +1*dir;
        if(X > endX || X < startX ){
            dir *=-1;
            Y-= 1*tileW+1;
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
//by swaping colors,it essentially swaps the tile 
function swapColorOrder(i,j){
    let t = colorOrder[i];
    colorOrder[i] = colorOrder[j];
    colorOrder[j] = t; 
    let w = weights[i];
    weights[i] = weights[j];
    weights[j] = w;
}
//randomize Tile locations
function shuffleColorOrder(){
    for(k = 0; k < positions.length; k++){
        let j = Math.floor(Math.random() * positions.length);
        let i = Math.floor(Math.random() * positions.length);
        while(i == j)
        i = Math.floor(Math.random() * positions.length);
        swapColorOrder(i,j);
    }
}
//-------- Animation related Things ----------



//object to be animated
function Tile(x,y,w,color){
    this.x =x
    this.y =y
    this.w = parseInt(w/2);
    this.color = color;
}
function colorTile(sq){
    for(let y = sq.y-sq.w; y <= sq.y+sq.w; y++)
      for(let x = sq.x-sq.w; x <= sq.x+sq.w; x++)
        screen.setPixelColor(x,y,sq.color);
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}
function getDisp(sq,pos){
  let diffX = Math.abs(sq.x-pos[0]);
  let diffY = Math.abs(sq.y-pos[1]);
  let dist = Math.sqrt( (diffX*diffX) + (diffY*diffY) );
  return [diffX,diffY,dist];
}
function moveTile(sq,dist,diffX,diffY){
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
}

function AnimateQuickSort(){

async function moveTo(sqi,sqj,i,j){
    let start = new Date().getTime();
    
    let iDisp = getDisp(sqi,positions[j]);
    let jDisp = getDisp(sqj,positions[i]);
    
    moveTile(sqi,positions[j],iDisp[0],iDisp[1]);
    moveTile(sqj,positions[i],jDisp[0],jDisp[1]);
    
    colorInPositions();
    colorTile(sqi);
    colorTile(sqj);
    
    screen.render();
    
    await sleep(start + delay - new Date().getTime());
    
    if(iDisp[2]> 0 || jDisp[2] > 0 ){
        moveTo(sqi,sqj,i,j);
    }
    else if( P < swapOrder.length ){
    
        colorOrder[i] = sqj.color;
        colorOrder[j] = sqi.color;
        
        sortPair();
    }else{
        console.log("finished");
        P = 0;
    }
}

var P = 0;
function sortPair(){
    let i = swapOrder[P];
    let j = swapOrder[P+1];
   // console.log([i,j]);
    P +=2;
    if(i == j && P<swapOrder.length) sortPair();
    else{
        let xi = positions[i][0];
        let yi = positions[i][1];
        let xj = positions[j][0];
        let yj = positions[j][1];
    
        let ti = new Tile(xi,yi,tileW,colorOrder[i]);
        let tj = new Tile(xj,yj,tileW,colorOrder[j]);
        
        colorOrder[i] = new Color();
        colorOrder[j] = new Color();
        
        moveTo(ti,tj,i,j);
    }
}
var swapOrder =[];// order to swap tiles back in order 
quickSort(weights,0,n*n-1,swapOrder);
sortPair();

}


setUp(9);
shuffleColorOrder();
colorInPositions();
screen.render();
AnimateQuickSort();



