function Imagebuffer(canvasElement, imageName, width, height) {
    this.context = canvasElement.getContext('2d');
    
    var image = new Image();
    var imagebuffer = this;
    image.onload = function() { completeImageBuferConstruction(image, imagebuffer, width, height); };
    image.src = imageName;
};

function completeImageBuferConstruction(image, self, width, height) {
    self.context.drawImage(image, 0, 0, width, height);
    self.imgData = self.context.getImageData(0, 0, width, height);
    self.frameBuffer = self.imgData.data;
};

Imagebuffer.prototype.getBuffer = function() {
    return this.frameBuffer;
};

Imagebuffer.prototype.getWidth = function() {
    return this.imgData.width;
};

Framebuffer.prototype.getHeight = function() {
    return this.imgData.height;
};

function Framebuffer(canvasElement) {
    this.context = canvasElement.getContext('2d');
    this.imgData = this.context.createImageData(canvasElement.width, canvasElement.height);
    this.frameBuffer = this.imgData.data;
};

Framebuffer.prototype.render = function(renderFunction) {
    renderFunction(this.frameBuffer, this.imgData.width, this.imgData.height);
    this.context.putImageData(this.imgData, 0, 0);
};

Framebuffer.prototype.getWidth = function() {
    return this.imgData.width;
};

Framebuffer.prototype.getHeight = function() {
    return this.imgData.height;
};

var Rotozoom = {
  render : function(frame, width, height) {
    if(Rotozoom.texture.frameBuffer == undefined) return;

    var timestamp = new Date().getTime();
    timestamp = timestamp / 2000;
    
    var texture = Rotozoom.texture.frameBuffer;
    var pos;
    
    var startY = 400 + Math.sin(timestamp/2.4) * 800;
    var startX = 500 + Math.cos(timestamp/2.4) * 500;
    var i = 0;
    var scaledHeight = 200 + Math.sin(timestamp*1.4) * 600;
    var scaledWidth = 200 + Math.sin(timestamp*1.4) * 400;
    var angleRadians = timestamp;

    var deltaX1 = Math.cos(angleRadians) * scaledHeight / height;
    var deltaY1 = Math.sin(angleRadians) * scaledHeight / height;
    var deltaX2 = Math.cos(angleRadians - Math.PI/2 ) * scaledWidth / width;
    var deltaY2 = Math.sin(angleRadians - Math.PI/2) * scaledWidth / width;
   
    var h = height;
    while (h--) {
      var x = startX;
      var y = startY;
      var w = width;
      while (w--) {
        pos = ((((Math.floor(y) + 262144) & 0xff) << 8) + ((Math.floor(x) + 262144) & 0xff )) << 2;
        frame[i++] = texture[pos++];
        frame[i++] = texture[pos++];
        frame[i++] = texture[pos];
        frame[i++] = 255;
        x += deltaX1;
        y += deltaY1;
      }
      startX += deltaX2
      startY += deltaY2;
    }
  },
  
  init : function() {
    var canvas = document.getElementById('demoCanvas');
    this.texture = new Imagebuffer( canvas, "texture.jpg", 256, 256 );
    this.fb = new Framebuffer( canvas );
    self.setInterval( 'Rotozoom.tick()', 50 );
    console.log("started");
  },
  
  tick : function() {
    this.fb.render(Rotozoom.render);
  }
};


