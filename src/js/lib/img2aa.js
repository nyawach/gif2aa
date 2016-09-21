export default class Img2AA {
    /* 必要なもの(opts)
    - text
    - textSize
    - textRes
    - imagepath
    - output: ['canvas', 'text', 'html'];
    */
    constructor(opts) {
        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d');
        if(opts) this._opts = opts;
    }

    init(opts) {
        this._opts = {
            text: opts.text || 'abcdefghijkmlnopqrstuvwxyz01234567890-=[];,./<>?:"{}|+_)(*&^%$#!~ @',
            textSize: opts.textSize || 10,
            textResolution: opts.textResolution || 15,
            path: opts.path || '',
            output: opts.output || 'canvas',
            target: opts.target || document.getElementById('canvasOutput'),
        };
        this.loadDensity();
        if(this._opts.path) {
            this._image = new Image;
            this._image.src = this._opts.path;
            this._image.onload = this.start.call(this);
        }

    }
    loadDensity() {
        this._strDensity = this._calcCharDensity(this._opts.text, this._opts.textSize, this._opts.textResolution);
    }
    setAAFromImageData(imgData, width, height) {
        this._aaArr = [];
        this._cWidth = width;
        this._cHeight = height;
        this._step = Math.floor(this._opts.textSize / 2);

        this._context.clearRect(0, 0, this._cWidth, this._cHeight);
        this._context.putImageData(imgData, 0, 0);

        let pixels = imgData.data;

        // 各点周辺のグレイスケール値
        let dotsDensity = this._calcDotsDensity(pixels);

        // console.log(dotsDensity);
        // 一番近いdensityのテキストを追加する
        this._plotWidth = Math.floor(dotsDensity.length / this._plotHeight);
        for(let h = 0; h < this._plotHeight; h++) {
            for(let w=0, diff=[], index=0; w < this._plotWidth; w++) {
                const base = w + h * this._plotWidth;

                this._strDensity.forEach(function(val, i){
                    diff[i] = Math.abs(val - dotsDensity[base]);
                    index = (diff[index] < diff[i]) ? index : i;
                });

                this._aaArr.push(this._opts.text[index]);
            }
        }
        // console.log(this._aaArr.length);
    }
    start() {
        this._aaArr = [];
        this._canvas.width = this._image.width;
        this._canvas.height = this._image.height;

        this._cWidth = this._canvas.width;
        this._cHeight = this._canvas.height;
        this._step = Math.floor(this._opts.textSize / 2);

        let imgContext = this._canvas.getContext('2d');
        imgContext.fillStyle = 'rgb(255, 255, 255)';
        imgContext.drawImage(this._image, 0, 0);

        let imgData = imgContext.getImageData(0, 0, this._cWidth, this._cHeight);
        let pixels = imgData.data;


        // 各点周辺のグレイスケール値
        let dotsDensity = this._calcDotsDensity(pixels);
        // 一番近いdensityのテキストを追加する
        this._plotWidth = Math.floor(dotsDensity.length / this._plotHeight);
        for(let h = 0; h < this._plotHeight; h++) {
            for(let w=0, diff=[], index=0; w < this._plotWidth; w++) {
                const base = w + h * this._plotWidth;

                this._strDensity.forEach(function(val, i){
                    diff[i] = Math.abs(val - dotsDensity[base]);
                    index = (diff[index] < diff[i]) ? index : i;
                });

                this._aaArr.push(this._opts.text[index]);
            }
        }

    }

    _calcDotsDensity(pixels) {

        let d = [];
        this._plotHeight = 0;
        this._plotWidth = 0;

        for(let h = this._step, base = 0, baseEnd = 0, gray = 0; h < this._cHeight; h+=this._opts.textSize) {
            for(let w = this._step; w < this._cWidth; w+=this._opts.textSize) {

                // 2: LGTM (ピクセルの範囲)
                for(base = (h * this._cWidth + w) * 4 - this._step * 4, baseEnd = base + this._step * 4; base < baseEnd; base+=4) {
                    // base = (h * this._cWidth + w) * 4;
                    // 0: 黒 - 255: 白
                    // gray += 255 - (pixels[base]*0.3+pixels[base+1]*0.51+pixels[base+2]*0.11);
                    // pixels[base]=pixels[base+1]=pixels[base+2] = gray;
                    // if(!pixels[base+3]===255) console.log(pixels[base+3]);
                    gray += 255 - pixels[base];
                    // console.log(pixels[base], pixels[base+1], pixels[base+2]);
                }
                gray = Math.round( gray / ((3-1)*4*2) );
                d.push( Math.round(gray/255*1000) );
            }
            this._plotHeight++;
        }

        return d;

    }
    _calcCharDensity(text, textSize, textResolution) {

        let densityArr = [];

        let canvas = document.createElement('canvas');
            canvas.width = textResolution || textSize;
            canvas.height = textResolution || textSize;

        let cWidth = canvas.width;
        let cHeight = canvas.height;

        let context = canvas.getContext('2d');
            context.font = `${this._opts.textResolution || this._opts.textSize}px "Helvetica"`;
            context.textBaseline = 'top';
            context.textAlign = 'left';
            context.fillStyle = 'rgb(0, 0, 0)';
            context.clearRect(0, 0, cWidth, cHeight);

        for(let i = 0; i < text.length; i++) {
            context.clearRect(0, 0, cWidth, cHeight);
            context.fillText(text[i], 0, 0);

            let imgData = context.getImageData(0, 0, cWidth, cHeight);
            let pixels = imgData.data;

            let colorBasePos;
            let colorPixelCnt = 0;

            /*
            * pixels[colorBasePos]: Red
            * pixels[colorBasePos+1]: Green
            * pixels[colorBasePos+2]: Blue
            * pixels[colorBasePos+3]: Alpha
            * なぜか透過で白黒してる
            */
            for(let h = 0; h < cHeight; h++) {

                for (let w = 0; w < cWidth; w++) {
                    colorBasePos = (w + h * cWidth) * 4;
                    if(pixels[colorBasePos + 3] > 127) colorPixelCnt++;
                }
            }

             densityArr.push(Math.round(colorPixelCnt / (cWidth * cHeight) * 1000));
        }

        return densityArr;
    }

    render() {
        switch(this._opts.output) {
            case 'canvas':
                _outputCanvas.call(this, this._opts.target);
            break;
            case 'text':

            break;
            case 'html':

            break;
            default:
            break;
        }
        function _outputCanvas(t) {
            // canvas描写
            t.width = this._cWidth;
            t.height = this._cHeight;

            let ctx = t.getContext('2d');
            ctx.font = `${this._opts.textSize}px "Helvetica"`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            for(let h = 0; h < this._plotHeight; h++) {
                for(let w = 0; w < this._plotWidth; w++) {
                    const base = w + (h * this._plotWidth);
                    ctx.fillText(this._aaArr[base], this._step+w*this._opts.textSize, this._step+h*this._opts.textSize);
                }
            }

            // console.log(this, t, this._cWidth, this._cHeight);
            // console.log(this._strDensity);
        }
    }


}
