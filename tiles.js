function Tile(x,y,w,color){
    this.x =x
    this.y =y
    this.w = parseInt(w/2);
    this.color = color;
    this.animate = false; 
}
function colorTile(screen,sq,anim=false){
    for(let y = sq.y-sq.w; y <= sq.y+sq.w; y++)
      for(let x = sq.x-sq.w; x <= sq.x+sq.w; x++)
        if(sq.animate == anim)
            screen.setPixelColor(x,y,sq.color);
}
function generateTiles(n,screenW,weights){
    var  tile = []
    let groups = (n*n) / 5;
    let firstGroup = Math.ceil(groups);
    groups = Math.floor(groups);
    
    let  tileW = Math.floor((screenW-n)/n); 
    let startX = -screenW/2 + tileW/2;
    let endX = screenW/2 - tileW/2-1;
    let X = startX;
    let Y = screenW/2 - tileW/2;
    let dir = 1;
    var step = (255*5) / (n*n);
    let r = 0, g = 0, b = 0;
    
    for( let i = 0; i < n*n; i++){
        let color = new Color(r,g,b);
        let x = parseInt(screenW/2 + X);
        let y = parseInt(screenW/2 -Y);
        tile.push(new Tile(x,y,tileW,color));
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
    return tile; 
}

function swapTiles(i,j,tile,weights,all=false){
    let x = tile[i].x;
    let y = tile[i].y;

    tile[i].x = tile[j].x;
    tile[i].y = tile[j].y;

    tile[j].x = x;
    tile[j].y = y;

    let w = weights[i];
    weights[i] = weights[j];
    weights[j] = w;

    if(all == true){
        let c = tile[i].color;
        tile[i].color = tile[j].color;
        tile[j].color = c; 
    }
}
function shuffleTiles(tile,weights){
    for(k = 0; k < tile.length; k++){
        let j = Math.floor(Math.random() * tile.length);
        let i = Math.floor(Math.random() * tile.length);
        while(i == j)
        i = Math.floor(Math.random() * tile.length);
        swapTiles(i,j,tile,weights);
    }
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
        if(diffY > sq.w)
            sq.y += Math.floor(sq.w/2);
        else if(diffY > 3)
            sq.y +=2;
        else
            sq.y +=1;
    }
    if(sq.y > dist[1]){
        if(diffY > sq.w)
            sq.y -= Math.floor(sq.w/2);
        else if(diffY > 3)
            sq.y -=2;
        else
            sq.y -=1;
    }
}


// function swapTiles(i,j,tile,weights,all=false){
//     let ii = weights[i];
//     let jj = weights[j];
//     let x = tile[ii].x;
//     let y = tile[ii].y;

//     tile[ii].x = tile[jj].x;
//     tile[ii].y = tile[jj].y;

//     tile[jj].x = x;
//     tile[jj].y = y;

//     let w = weights[i];
//     weights[i] = weights[j];
//     weights[j] = w;

//     if(all == true){
//         let c = tile[ii].color;
//         tile[ii].color = tile[jj].color;
//         tile[jj].color = c; 
//     }
// }