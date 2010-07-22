

var Polarmap = {
	
  map_1 : {
	dist_min : 0.01,
	dist_max : 10.0,
	dist_step : 0.0005,
	angle_step : 0.001,
	base_radius : 800.0,
	width : 640,
	height : 480,
	texture_width : 256,
	texture_height : 256,
	table : [],
	shade : []
	},

  map_2 : {
	dist_min : 0.5,
	dist_max : 4.5,
	dist_step : 0.001,
	angle_step : 0.005,
	base_radius : 400.0,
	width : 320,
	height : 240,
	image_width : 256,
	image_height : 256,
	table : [],
	shade : []
	},

  precalc : function(map) {
	for(var i = 0; i < map.width * map.height; i++) { map.table[i] = 0; map.shade[i] = 0; };

	var image_xdelta = (map.image_width * 4) / (Math.PI * 2);
	var image_ydelta = (map.image_height * 4) / map.dist_max;

	for(var dist = map.dist_max; dist > map.dist_min; dist -= map.dist_step) {
		for(var angle = 0.0; angle < Math.PI * 2; angle += map.angle_step) {
			// flower tunnel
			var radius = ( Math.cos( angle * 4.0 ) + 1.0 ) * map.base_radius / 4.0  + map.base_radius / 2.0;
			//	basic, round, tunnel
			//var radius = map.base_radius / 2.0;
			radius = radius / dist;
			var x = Math.floor(Math.cos(angle) * radius) + map.width / 2;
			var y = Math.floor(Math.sin(angle) * radius) + map.height / 2;

			if( (x >= 0) && (x < map.width) && (y >= 0) && (y < map.height) ) {  
				map.table[y * map.width + x] = (Math.floor(image_ydelta * dist) % map.image_height) * map.image_width + (Math.floor(image_xdelta * angle) % map.image_width);
				var s = Math.floor( dist / map.dist_max * 255.0 );
				map.shade[y * map.width + x] = 255 - s;
				}
	  		}
		}
	},
		
  render : function(frame, width, height) {
    if(Polarmap.texture.frameBuffer == undefined) return;

    var timestamp = new Date().getTime();
    timestamp = Math.floor(timestamp / 8);
    
    var texture = Polarmap.texture.frameBuffer;
    var map = Polarmap.map_2;

    var i = 0;
    var h = height;
    while (h--) {
      var w = width;
      while (w--) {
		var texel = map.table[h * map.width + w];
		var texel = ((texel + timestamp * 256) & 0xffff ) << 2
        frame[i++] = texture[texel++];
        frame[i++] = texture[texel++];
        frame[i++] = texture[texel];
        frame[i++] = map.shade[h * map.width + w];
      }
    }
  },
  
  init : function() {
	Polarmap.precalc(Polarmap.map_2);
    var canvas = document.getElementById('demoCanvas');
    this.texture = new Imagebuffer( canvas, "texture.jpg", 256, 256 );
    this.fb = new Framebuffer( canvas );
    self.setInterval( 'Polarmap.tick()', 50 );
  },
  
  tick : function() {
    this.fb.render(Polarmap.render);
  }
};


