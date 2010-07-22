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