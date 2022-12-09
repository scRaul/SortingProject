function randomizeList(list){
    var repeat = Math.floor( Math.random() * list.length);
    for(let i = 0; i <  repeat; i++){
        let a = Math.floor( Math.random() * list.length);
        let b = Math.floor( Math.random() * list.length);
        swap(list,a,b);
    }
}
var swapList = [];
function swap(list,a,b){
    let temp = list[a];
    list[a] = list[b];
    list[b] = temp;
    swapList.push([a,b]);
}
function part(list,left,right){
    let i = left-1;
    for(let j = left; j < right; j++){
        if(list[j] < list[right]){
            i++;
            swap(list,i,j);
        }
    }
    swap(list,i+1,right); 
    return i+1;
}
function quickSort(list,left,right){
    if(left >= right) return;
    let pivot = part(list,left,right);
    quickSort(list,left,pivot-1);
    quickSort(list,pivot+1,right);
}