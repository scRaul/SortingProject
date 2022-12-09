var timer = new Timer(); 
timer.setToCountUp(); 

var list = []; 
var copy = [];
for(let i = 0; i < 100; i++){
    list[i] = i;
    copy[i] = i;
}
randomizeList(list);
swapList = []
quickSort(list,0,list.length-1);

var index = -1; 
console.log(copy);
SortNext();
function SortNext(){
    if(swapList.length <= 0 ) return; 
    if(index >= swapList.length){
        console.log(copy);
        return;
    } 
    index++;
    var a = swapList[index][0];
    var b = swapList[index][1];
    AnimateSwap(a,b);
}
async function AnimateSwap(a,b){
    console.log("swapping"+a+','+b);
    swap(copy,a,b);
    await new Promise(r => setTimeout(r,50));
    SortNext();
}