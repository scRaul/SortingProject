class Bar{
    #obj; // holds screen obj 
    #posX;  // pos where its going to be // might not be current
    #targetQ; // list of targeted pos
    #targetX; // current target 
    #bMoving;  // keep track if its moving 
    #ogColor;
    #w;
    #h;
    #prevTime;
    constructor(w,h,pos,color){
        this.#w = w;
        this.#h = h;
        this.#obj = new ScreenObj(w,h,color); 
        this.#obj.teleport(pos); 
        this.#posX = pos.x;
        this.#targetQ = [];
        this.#bMoving = false;
        this.#targetX = null;
        this.#ogColor = color;
    }
    setColor(c){this.#obj.setColor(c);}
    getCopy(){
        return new Bar(this.#w,this.#h,this.#obj.getPos(),this.#ogColor);
    }
    getObj(){return this.#obj;}
    addTarget(x){
        this.#posX = x;
        this.#targetQ.push(x); 
    }
    isMoving(){return this.#bMoving;}
    getPos(){return this.#posX; }
    getNextPos(){
        if(this.#targetQ.length <= 0)
            this.#targetX = null;
        else{
            this.#targetX = this.#targetQ.shift();
            this.#bMoving = true;
        }
    }
    update(){
        if(this.#targetX == null ){
                this.#bMoving = false; // not target return 
                return; 
        }
        // get distance from target location 
        var dist = this.#targetX -  this.#obj.getPos().x; 
        // if within 1, teleport to it 
        if( Math.abs(dist) < 1 ){
            this.#obj.teleport(new Vec(this.#targetX,this.#obj.getPos().y));
            this.#bMoving = false; 
            this.#targetX = null;
        }else{ // move half the distance 
            this.#obj.translate(dist/2,0);
        }
    }
}
const SORT_TYPE ={NONE:0,QUICK:1,INSERT:2,BUBBLE: 3}
class BarSorter{
    //pass in height list + bar list, specify sorting type opt QUICK, INSERT, BUBBLE
    async sort(hList,barList,sortType){
        switch(sortType){
            case SORT_TYPE.QUICK:
                this.quickSortBars(hList,barList,0,hList.length-1)
                break;
            case SORT_TYPE.INSERT:
                this.insertSortBars(hList,barList);
                break;
            case SORT_TYPE.BUBBLE:
                this.bubbleSortBars(hList,barList);
                break;
        }
    }
    //takes in height list along with  a list of bar List ( in order to randomize the same )
    randomizeBars(hList,barList){
        var repeat =hList.length*2; 
        for(let i = 0; i < repeat;i++){
            let a = Math.floor(Math.random() * hList.length); 
            let b = Math.floor(Math.random() * hList.length);     
            this.swap(hList,a,b);
            this.swapBars(barList,a,b);
        }    
    }
    swap(list,a,b){
        var t = list[a];
        list[a] = list[b];
        list[b] = t; 
    }
    //swap bar a with b 
    swapBars(barList,a,b){
        let posA = barList[a].getPos();
        barList[a].addTarget(barList[b].getPos());
        barList[b].addTarget(posA);
        this.swap(barList,a,b);
    }
    async bubbleSortBars(hList,barList){
        for(let i = 0; i < hList.length-1;i++){
            for(let j = 0; j < hList.length-i-1;j++){
                if(hList[j] > hList[j+1]){
                    this.swap(hList,j,j+1);
                    this.swapBars(barList,j,j+1);
                    j  -= await incrementAfterDelay();
                }
            }

        }
    }
    async part(hList,barList,p,r){
        let i = p-1;
        for(let j = p; j < r; j++){
            if( hList[j] < hList[r]){
                i++;
                this.swap(hList,i,j);
                this.swapBars(barList,i,j);
                i += await incrementAfterDelay();
            }
        }
        this.swap(hList,i+1,r);
        this.swapBars(barList,i+1,r);
        i += await incrementAfterDelay();
        return i+1;
    }
    async quickSortBars(hList,barList,p,r){
        if ( p >= r) return;
        let q = await this.part(hList,barList,p,r);
        this.quickSortBars(hList,barList,p,q-1);
       this.quickSortBars(hList,barList,q+1,r);
    }
    async insertSortBars(hList,barList){
        for(let j = 1; j < hList.length;j++){
            let key = hList[j];
            //let bKey = barList[j].getCopy(); 
            let i = j-1;
            while( i >= 0 && hList[i] > key ){
                hList[i+1] =hList[i];
                this.swapBars(barList,i+1,i);
                i  += await incrementAfterDelay(); // adds 0 
                i--;
            }
            hList[i+1] = key;
        }
    }

}
//wait some time beofre continuing  // return 0 ;
function incrementAfterDelay() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0);
      },100);
    });
}