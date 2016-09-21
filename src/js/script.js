'use strict';

import $ from './lib/jquery';
import Img2aa from './lib/img2aa';
import gif from './lib/gif';
import GifPlayer from './lib/GifPlayer';

let path = null;
// let encoder = new gifEncoder();

// console.log(encoder);


$('#imgFile').on('dragover', function(e){
    e.stopPropagation();
    e.preventDefault();
    console.log(e);
    // e.dataTransfer.dropEffect = 'copy';
});
$('#imgFile').on('drag', function(e){
    e.stopPropagation();
    e.preventDefault();
});

// 画像を変更
$('#imgFile').on('change', function(e) {

    let imgfile = e.target.files;
    let reader = new FileReader;

    reader.readAsDataURL(imgfile[0]);
    reader.onload = function() {
        $('#rawImage').attr('src', this.result);
        let img = new Image();
            img.src = path = this.result;

        // img.onload = function() {
        //     let canvasImg = document.getElementById('canvasImg');
        //         canvasImg.width = img.width;
        //         canvasImg.height = img.height;
        //     let context = canvasImg.getContext('2d');
        //     context.drawImage(this, 0, 0);
        // }

    }

});



$('#outputBtn').on('click', function(e) {
    // $('#canvasImg').hide();
    const options = {
        path: path,
        text: $('#text').val(),
        textSize: parseInt($('#textRange').val(), 10) || 10,
        textResolution: 24,
        output: 'canvas',
        target: document.getElementById('canvasImgOutput')
    };

    let Img2AA = new Img2aa();

    Img2AA.init(options);
    Img2AA.render();
});


$('#textRange').on('change', function(){
    // img2aa(imgfile, $('#text').val() || defaultText, parseInt($('#textRange').val(), 10) || 10);
    $(this).next().text($(this).val());
})



$('#gifButton').on('click', function(e) {
        let img = new Image();
            img.src = $('#gif').attr('src');
        let player = new GifPlayer(path, gif, new Img2aa({
            path: path,
            text: $('#text').val(),
            textSize: parseInt($('#textRange').val(), 10),
            textResolution: 24,
            output: 'canvas',
            target: document.getElementById('canvasImgOutput')
        }));

        img.onload = function() {
            let canvasImg = document.getElementById('canvasGifOutput');
                canvasImg.width = img.width;
                canvasImg.height = img.height;
            let context = canvasImg.getContext('2d');
            context.drawImage(this, 0, 0);
        }

});