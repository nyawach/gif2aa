
// https://gist.github.com/mitukiii/1738790
export default class GifPlayer {

	constructor(url, gif, img2aa) {
		this.canvas = document.getElementById('canvasGifOutput') || document.createElement('canvas');
		this.context = null;
		this.frames = [];
		this.gif = gif;
		this.load(url);
		this.img2aa = img2aa;
	    const options = {
	        textSize: 10,
	        textResolution: 24,
	        output: 'canvas',
	        target: this.canvas,
	    };
        this.img2aa.init(options);

		this.handler = {
			hdr: function(header) {
				this.header = header;
				this.canvas.width = this.header.width;
				this.canvas.height = this.header.height;
			}.bind(this),
			gce: function(gce) {
				if(this.context) {
					this.frames.push(this.context.getImageData(0, 0, this.header.width, this.header.height));
				}
                this.context = null;
                this.transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
                this.disposal_method = gce.disposalMethod;
			}.bind(this),
			img: function(image) {
				//画像の読み込み&描写
                var color_table, image_data, self;
                self = this;
                if (!this.context) { this.context = this.canvas.getContext('2d'); }
                color_table = image.lctFlag ? image.lct : this.header.gct;
                image_data = this.context.getImageData(image.leftPos, image.topPos, image.width, image.height);
                image.pixels.forEach(function(pixel, index) {
                    if (self.transparency !== pixel) {
                        image_data.data[index * 4 + 0] = color_table[pixel][0];
                        image_data.data[index * 4 + 1] = color_table[pixel][1];
                        image_data.data[index * 4 + 2] = color_table[pixel][2];
                        image_data.data[index * 4 + 3] = 255;
                    } else if (self.disposal_method === 2 || self.disposal_method === 3) {
                        image_data.data[i * 4 + 3] = 0;
                    }
                });
                this.img2aa.setAAFromImageData(image_data, image.width, image.height);
                this.img2aa.render();
            	// this.context.putImageData(image_data, image.leftPos, image.topPos);
			}.bind(this),
			eof: function() {
				// フレームの終わりに呼び出される
                if (this.context) {
                    this.frames.push(this.context.getImageData(0, 0, this.header.width, this.header.height));
                }
                if(!this.player) this.player = new Player(this.frames, this.img2aa);

                this.player.play();

                // 操作用
                let self = this;
                // document.addEventListener('keyup', function(e){ self.player.action(e); });
			}.bind(this)
		};

		this.stream = null;
	}

	load(url) {

		let self = this;
		//  Native
		let request = new XMLHttpRequest();
		request.open("get", url, true);
		request.overrideMimeType('text/plain; charset=x-user-defined')
		request.onload = function (event) {
		  if (request.readyState === 4) {
		    if (request.status === 200) {
				self.stream = new self.gif.Stream(event.target.responseText);
				self.gif.parseGIF(self.stream, self.handler);
				console.log('loading complete!');
		    } else {
		    	console.log(request.statusText); // => Error Message
		    }
		  }
		};
		request.onerror = function (event) {
		  console.log(event.type); // => "error"
		};
		request.send(null);

	}

}

class Player {
    constructor(frames, img2aa) {
		this.canvas = document.getElementById('canvasGifOutput') || document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.frames = frames;
        this.index = 0;
        this.playing = false;
        this.delay = 100;
        this.before = null;
        this.img2aa = img2aa;

    }
    set() {
        this.context.putImageData(this.frames[this.index], 0, 0);
    }
    step() {
        if (!this.playing) {
            return;
        }
        this.set(this.index);
        this.index++;
        if (this.index >= this.frames.length) {
            this.index = 0;
        }
        let self = this;
        setTimeout(function(){self.step();}, self.delay);
        // setTimeout(self.step, self.delay);
    }
    play() {
        this.playing = true;
        this.step();
    }
    stop() {
        this.playing = false;
    }
    toggle() {
        if (this.playing) {
            this.stop();
        } else {
            this.play();
        }
    }
    next() {
        if (this.playing) {
            return;
        }
        this.index = (this.index + 1) % this.frames.length;
        this.set();
    }
    prev() {
        if (this.playing) {
            return;
        }
        this.index -= 1;
        if (this.index < 0) {
            this.index = this.frames.length - 1;
        }
        this.set();
    }
    setDelay() {
        var time;
        if (this.before) {
            time = new Date() - this.before;
            if (time <= 1000) {
                this.delay = time / 8;
            }
        }
        this.before = new Date();
    }
    action(event) {
    	console.log(event.which);
        switch (event.which) {
        case 13:
            event && event.preventDefault();
            this.toggle();
        case 39:
        case 74:
            event && event.preventDefault();
            this.next();
        case 37:
        case 75:
            event && event.preventDefault();
            this.prev();
        case 32:
            event && event.preventDefault();
            this.setDelay();
        }
    }
}