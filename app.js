var barCountInput = document.getElementById('barCount');
barCountInput.addEventListener('change',adjustBarCount);


const incrementsX = 500;
const yDiff = 2; 

const debugging = true; 

var screenW = 501; 
var screenH = screenW / yDiff; 
const incrementsY = incrementsX / yDiff;

var screen = new Screen(screenW,screenH,incrementsX,'screenA');

var input = new Input();
var sorter = new BarSorter(); 

const fastFPS = 120; 
const slowFPS = 10; 
var fps = slowFPS; 



var barList = [];
var hList = []; // going to use to sort



adjustBarCount();


var dynamic = [];
var static = [];
var animiating = false;
var active  = 0; 
loop();
async function loop(){
    var startTime = Date.now();
    var delay = 1000/ fps; 
    screen.clearColor();
    handleInput(); 
    updateList();
    screen.draw(static,DRAW_MODE.SCREENOBJ);
    screen.draw(dynamic,DRAW_MODE.SCREENOBJ);
    screen.render();
    await new Promise(r => setTimeout(r,(startTime+delay)-Date.now() ));
    loop(); 
}
function generateBars(bars=10){
    barList = [];
    hList = [];
    var barW = (screenW) / bars; 
    var startX = -incrementsX/2 + barW/2;
    for(let i = 1; i <= bars; i++){
        var barH = (i / bars) * screenH;
        var pos = new Vec(startX + (i-1)*barW,(-incrementsY/2) + barH/2  );
        var color = new Color(0,255-bars+i,255-bars+i); 
        var bar = new Bar(barW,barH,pos, color);
        barList.push(bar);
        hList.push(i);
    }
}
function updateTimer(){
    if(timer.getMsLeft() > 0)
        console.log(timer.getMsLeft());
}
function handleInput(){
    if(!debugging) return;
    if(input.keys.one){
        input.keys.one = false;
        if(animiating) return;
        sorter.randomizeBars(hList,barList);
        animiating  = true; 
    }
    if(input.keys.two){
        input.keys.two = false;
        if(animiating) return;
        sorter.sort(hList,barList,SORT_TYPE.QUICK);
    }
    if(input.keys.three){
        input.keys.two = false;
        if(animiating) return;
        sorter.sort(hList,barList,SORT_TYPE.INSERT);
    }
    if(input.keys.four){
        input.keys.two = false;
        if(animiating) return;
        sorter.sort(hList,barList,SORT_TYPE.BUBBLE);
    }
}
function updateList(){
    static = [];
    dynamic = [];
    active = 0;
    for(let i = 0; i < barList.length;i++){ 
        if(barList[i].isMoving()==true){
            active++;
            dynamic.push(barList[i].getObj());
            barList[i].update();
        }else{
            barList[i].getNextPos();
            static.push(barList[i].getObj());
        }
    }
    if(active > 0){
        fps = fastFPS;
    }else{
        fps = slowFPS;
        animiating = false;
        timer.reset();
    }
}
function adjustBarCount(){
    animiating =false;
    let n = parseInt(barCountInput.value);
    if(n < 5) return; 
    if(n > 254) 
    n = 255; 
    generateBars(n);
}
function makeRandom(){
    if(animiating) return;
    adjustBarCount();
    sorter.randomizeBars(hList,barList);
    animiating = true;
    document.getElementById('quickSort').style.display = 'none';
    document.getElementById('insertSort').style.display = 'none';
    document.getElementById('bubbleSort').style.display = 'none';
}
function Quick(){
    if(animiating) return;
    sorter.sort(hList,barList,SORT_TYPE.QUICK);
    animiating = true;
    document.getElementById('quickSort').style.display = 'block';
    document.getElementById('insertSort').style.display = 'none';
    document.getElementById('bubbleSort').style.display = 'none';
}
function Insert(){
    if(animiating) return;
    sorter.sort(hList,barList,SORT_TYPE.INSERT);
    animiating = true;
    document.getElementById('quickSort').style.display = 'none';
    document.getElementById('insertSort').style.display = 'block';
    document.getElementById('bubbleSort').style.display = 'none';
}
function Bubble(){
    if(animiating) return;
    sorter.sort(hList,barList,SORT_TYPE.BUBBLE);
    animiating = true;
    document.getElementById('quickSort').style.display = 'none';
    document.getElementById('insertSort').style.display = 'none';
    document.getElementById('bubbleSort').style.display = 'block';
}

