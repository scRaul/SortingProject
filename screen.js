function Screen(id,pixelsAcross=255,pixelsDown=255,pixelScale=1){
  var canvas = document.getElementById(id);
  var ctx;
  var imageData;
  
  this.pixelsAcross = pixelsAcross;
  this.pixelsDown = pixelsDown;
  this.pixelScale = pixelScale;

   this.init = function() {
    canvas.width = this.pixelsAcross;
    canvas.height = this.pixelsDown;
    canvas.style.cssText = "height: " + (this.pixelsDown*this.pixelScale)+ "px; \n width: " + (this.pixelsAcross*this.pixelScale) + "px;";
    ctx = canvas.getContext("2d");
    imageData = ctx.getImageData(0,0,this.pixelsAcross,this.pixelsDown);

  }
  this.setPixelColor = function(xPixelIndex, yPixelIndex, color) {
	  var index = (yPixelIndex * this.pixelsAcross + xPixelIndex) * 4; // 4 bytes per pixel
	  imageData.data[index + 0] = color.r; // red channel
	  imageData.data[index + 1] = color.g; // green channel
	  imageData.data[index + 2] = color.b // blue channel
	  imageData.data[index + 3] = color.a*255;//alpha channel
  }
  
  this.render = function(buffX=0,buffY=0){
    ctx.putImageData(imageData, buffX, buffY);
  }

  this.clearColor= function(color){
    for(let j = 0; j < this.pixelsDown; j++)
      for(let i = 0; i < this.pixelsAcross; i++ )
        this.setPixelColor(i,j,color);
  }

}

function Color(r=0,g=0,b=0,a=1){
  this.r = r;
  this.g= g;
  this.b=b;
  this.a = a;
}
