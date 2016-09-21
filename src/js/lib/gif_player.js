(function () {
    var GifPlayer;
    GifPlayer = function () {
        var Player;
        function GifPlayer(url) {
            this.modal = $('.modal').modal({ backdrop: false });
            this.progressbar = this.modal.find('.progress .bar');
            this.canvas = $('canvas').get(0);
            this.frames = [];
            this.handler = {
                hdr: this.proxy(this.parserHandlers.header),
                gce: this.proxy(this.parserHandlers.graphicControl),
                img: this.proxy(this.parserHandlers.image),
                eof: this.proxy(this.parserHandlers.end)
            };
            this.load(url);
        }
        GifPlayer.prototype.proxy = function (callback) {
            return $.proxy(callback, this);
        };
        GifPlayer.prototype.load = function (url) {
            var self;
            self = this;
            return $.ajax({
                url: url,
                beforeSend: function (req) {
                    return req.overrideMimeType('text/plain; charset=x-user-defined');
                },
                complete: function (req) {
                    self.stream = new Stream(req.responseText);
                    return parseGIF(self.stream, self.handler);
                }
            });
        };
        GifPlayer.prototype.progress = function () {
            var percent;
            percent = Math.round(this.stream.pos / this.stream.data.length * 100);
            return this.progressbar.width(percent + '%');
        };
        GifPlayer.prototype.parserHandlers = {
            header: function (header) {
                this.progress();
                this.header = header;
                this.canvas.width = this.header.width;
                return this.canvas.height = this.header.height;
            },
            graphicControl: function (gce) {
                this.progress();
                if (this.context) {
                    this.frames.push(this.context.getImageData(0, 0, this.header.width, this.header.height));
                }
                this.context = null;
                this.transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
                return this.disposal_method = gce.disposalMethod;
            },
            image: function (image) {
                var color_table, image_data, self;
                this.progress();
                self = this;
                if (!this.context) {
                    this.context = this.canvas.getContext('2d');
                }
                color_table = image.lctFlag ? image.lct : this.header.gct;
                image_data = this.context.getImageData(image.leftPos, image.topPos, image.width, image.height);
                $.each(image.pixels, function (index, pixel) {
                    if (self.transparency !== pixel) {
                        image_data.data[index * 4 + 0] = color_table[pixel][0];
                        image_data.data[index * 4 + 1] = color_table[pixel][1];
                        image_data.data[index * 4 + 2] = color_table[pixel][2];
                        return image_data.data[index * 4 + 3] = 255;
                    } else if (self.disposal_method === 2 || self.disposal_method === 3) {
                        return image_data.data[i * 4 + 3] = 0;
                    }
                });
                return this.context.putImageData(image_data, image.leftPos, image.topPos);
            },
            end: function () {
                this.progress();
                if (this.context) {
                    this.frames.push(this.context.getImageData(0, 0, this.header.width, this.header.height));
                }
                this.modal.hide();
                return new Player(this.frames).play();
            }
        };
        Player = function () {
            function Player(frames) {
                this.canvas = $('canvas').get(0);
                this.context = this.canvas.getContext('2d');
                this.frames = frames;
                this.index = 0;
                this.playing = false;
                this.delay = 100;
                this.before = null;
                $(document).keydown(this.proxy(this.action));
            }
            Player.prototype.proxy = function (callback) {
                return $.proxy(callback, this);
            };
            Player.prototype.set = function () {
                return this.context.putImageData(this.frames[this.index], 0, 0);
            };
            Player.prototype.step = function () {
                if (!this.playing) {
                    return;
                }
                this.set(this.index);
                this.index += 1;
                if (this.index >= this.frames.length) {
                    this.index = 0;
                }
                return setTimeout(this.proxy(this.step), this.delay);
            };
            Player.prototype.play = function () {
                this.playing = true;
                return this.step();
            };
            Player.prototype.stop = function () {
                return this.playing = false;
            };
            Player.prototype.toggle = function () {
                if (this.playing) {
                    return this.stop();
                } else {
                    return this.play();
                }
            };
            Player.prototype.next = function () {
                if (this.playing) {
                    return;
                }
                this.index += 1;
                if (this.index >= this.frames.length) {
                    this.index = 0;
                }
                return this.set();
            };
            Player.prototype.prev = function () {
                if (this.playing) {
                    return;
                }
                this.index -= 1;
                if (this.index < 0) {
                    this.index = this.frames.length - 1;
                }
                return this.set();
            };
            Player.prototype.setDelay = function () {
                var time;
                if (this.before) {
                    time = new Date() - this.before;
                    if (time <= 1000) {
                        this.delay = time / 8;
                    }
                }
                return this.before = new Date();
            };
            Player.prototype.action = function (event) {
                switch (event.which) {
                case 13:
                    event && event.preventDefault();
                    return this.toggle();
                case 39:
                case 74:
                    event && event.preventDefault();
                    return this.next();
                case 37:
                case 75:
                    event && event.preventDefault();
                    return this.prev();
                case 32:
                    event && event.preventDefault();
                    return this.setDelay();
                }
            };
            return Player;
        }();
        return GifPlayer;
    }();
}.call(this));

window.onload = function() {

const images = ["baaaaa.gif", "dog.gif", "driver.gif", "hoshi.gif", "imamachine.gif", "madohomu.gif", "nuko.gif", "sporty.gif", "circle.gif", "dokan.gif", "facebook.gif", "hutomomo.gif", "kawaii.gif", "mine.gif", "perfume.gif", "tile.gif"];
new GifPlayer('/images/' + images[Math.round(Math.random() * images.length)]);

}