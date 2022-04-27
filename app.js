var screenW = 450;
var screen;
var delay = 1000/100;
var n;// dim of squared number of tile, total = n*n 

var tiles = [];
var weights = [];

function setUp(dimension){
    n = dimension;  
    screenW +=n;
    screen = new Screen('screen',screenW,screenW); 
    screen.init();
    tiles = [];
    weights = [];
    tiles =  generateTiles(n,screenW,weights);
}
function render(){
    screen.clearColor(new Color());
    //color background tiles 
    tiles.forEach(tile => {
        colorTile(screen,tile);
    });
    //color forground tiles
    tiles.forEach(tile => {
        colorTile(screen,tile,true);
    });
    screen.render();
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}
//return diff in x and y direction and overall distance 
function getDisp(sq,pos){
    let diffX = Math.abs(sq.x - pos[0]);
    let diffY = Math.abs(sq.y - pos[1]);
    let dist = Math.sqrt( (diffX*diffX) + (diffY*diffY) );
    return [diffX,diffY,dist];
}
var borderC =new Color(156, 158, 108);
var stop = false;
function AnimateInsertSort(){
    var prevPos = []; 
    var swapOrder =[];// order to swap tiles back in order 
    insertSort(weights,swapOrder);
    var P = 0;
    async function moveTo(i,j,k,position){
        if(stop == true)return;
        let start = new Date().getTime();

        let jDisp = getDisp(tiles[i],position);
        moveTile(tiles[i],position,jDisp[0],jDisp[1]);

        tiles.push(new Tile(tiles[i].x,tiles[i].y,tiles[i].w*2.2,borderC));
        render();
        tiles.pop();
        await sleep(start + delay - new Date().getTime());
        if( jDisp[2] > 0 ){
            moveTo(i,j,k,position);
        }else{ 
            tiles[i].animate = false;
            if(j == k) prevPos = [];
            if( P < swapOrder.length ){
                sort();
            }else{
                render();
                console.log("finished");
            }
        }
    }
    function sort(){
       // if(P >= 3*15) return;
        if(prevPos.length == 0){
            tiles.forEach(t =>{
                prevPos.push([t.x,t.y]);
            });
        }
        let i = swapOrder[P];
        let j = swapOrder[P+1];
        let k = swapOrder[P+2];
        P +=3
        if(i == j && P < swapOrder.length ){
            if(j == k){ prevPos = [];}
            sort();
        }
        else{
           // console.log([i,j,k]);
            tiles[i].animate = true;
            let position = [prevPos[j][0],prevPos[j][1]];
            moveTo(i,j,k,position);
        }
    }
    sort();

}
function AnimateQuickSort(){
    var swapOrder =[];// order to swap tiles back in order 
    quickSort(weights,0,n*n-1,swapOrder);
    var P = 0;

    async function moveTo(i,j,positions){
        if(stop == true) return;
        let start = new Date().getTime();
      
        let iDisp = getDisp(tiles[i],positions[1]);
        let jDisp = getDisp(tiles[j],positions[0]);
        
        moveTile(tiles[i],positions[1],iDisp[0],iDisp[1]);
        moveTile(tiles[j],positions[0],jDisp[0],jDisp[1]);
        tiles.push(new Tile(tiles[i].x,tiles[i].y,tiles[i].w*2.2,borderC));
        tiles.push(new Tile(tiles[j].x,tiles[j].y,tiles[j].w*2.2,borderC));
        render();
        tiles.pop();
        tiles.pop();
        await sleep(start + delay - new Date().getTime());
        
        if(iDisp[2]> 0 || jDisp[2] > 0 ){
            moveTo(i,j,positions);
        }
        else{ 
            tiles[i].animate = false;
            tiles[j].animate = false;
            if( P < swapOrder.length ){
                sortPair();
            }else{
                render();
                console.log("finished");
            }
        }
    }
    function sortPair(){
       // if(P >= 2*1)return ;
        let i = swapOrder[P];
        let j = swapOrder[P+1];
        P +=2;
        if(i == j && P<swapOrder.length) sortPair();
        else{

            tiles[i].animate = true;
            tiles[j].animate = true; 
            let ipos = [tiles[i].x,tiles[i].y];
            let jpos = [tiles[j].x,tiles[j].y];
            let positions = [ipos,jpos];
           
            moveTo(i,j,positions);
        }
    }
    sortPair();
}


setUp(9);
render();

var shufbtn = document.getElementById("Shuffle");
var quickbtn = document.getElementById("Quick");
var insertbtn = document.getElementById("Insert");


shufbtn.addEventListener('click',reShuffle);
quickbtn.addEventListener('click',tryQuickSort);
insertbtn.addEventListener('click',tryInsert);

async function reShuffle(){
    await pause();
    setUp(9);
    screen.clearColor(new Color());
    shuffleTiles(tiles,weights);
    render();
    quickbtn.disabled=false;
    insertbtn.disabled=false;
    quickbtn.style.opacity="1";
    insertbtn.style.opacity="1";
}
function tryQuickSort(){
    quickbtn.disabled=true;
    insertbtn.disabled=true;
    quickbtn.style.opacity=".6";
    insertbtn.style.opacity=".6";
    AnimateQuickSort();
}
function tryInsert(){
    quickbtn.disabled=true;
    insertbtn.disabled=true;
    quickbtn.disabled=true;
    quickbtn.style.opacity=".6";
    insertbtn.style.opacity=".6";
    AnimateInsertSort();
}
async function pause(){
    console.log("Stoping");
    stop = true;
    await sleep(300);
    stop = false;
}






// swapTiles(1,5,tiles,weights);
// //swapTiles(0,15,tiles,weights);
// swapTiles(10,5,tiles,weights);
// swapTiles(9,4,tiles,weights);
// swapTiles(2,7,tiles,weights);