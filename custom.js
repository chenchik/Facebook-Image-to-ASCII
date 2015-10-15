

var charray = 
//"█";
"@B8#0?/\+=~-:. ";
//["\u2588", "\u2588", "\u2593", "\u2592", "\u2592", "\u2591", "  "];
//"@%#*+=-:. "; //" .:-=+*#%@";
//"@B%$8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^`'. ";

$(document).ready(function() {
    $('#upload').on('change', function() {
		var file = this.files[0];
		console.log('Uploading ' + file.name + ' of ' + file.size + ' bytes');
		var reader  = new FileReader();
		reader.onloadend = function () {
			$('#preview').attr('src', reader.result);
		}
		reader.readAsDataURL(file);
	});
	$("#facebook").on('click', function(e) {
		e.preventDefault();
		$('#width').val("33");
		$('#font-size').val("14");
		$('#font-family').val("Helvetica");
	});
	$("#generate").on('click', function(e) {
		e.preventDefault();
		var text = $('#text');
		text.css({
			'font-family': $('#font-family').val(),
			'font-size': parseInt($('#font-size').val())
		});
		process($('#preview').get(0), parseInt($('#width').val()), $('#adjust')[0].checked);
		if (text.css('display') == 'none') {
			$('#main').css('text-align', 'right');
			$('#sidebar').css('float', 'left');
			text.css('display', 'inline');
		}
	});
});

function process(image, width, adjust) {
    var c = document.getElementById("myCanvas");
	
    var ctx = c.getContext("2d");
	var iwidth = image.clientWidth;
	var iheight = image.clientHeight;
	
	var aspect = iheight/iwidth;
	var height = Math.round(aspect*width*(adjust ? 0.8 : 1));
	
	c.width  = width; // in pixels
	c.height = height; 
	
    ctx.drawImage(image, 0, 0, width, height);
	
	var text = $('#text');
	var font = $('#text').css('font');
	var cwidth = textWidth(font, "@");
	var dat = ctx.getImageData(0,0,width,height).data;
	var div = $("<div></div>");
	for(var y = 0; y < height; y++){
		var ln = "";
		for(var x = 0; x < width; x++){
			var offset = (width * y + x) * 4;
			var greyscale = (dat[offset+0] + dat[offset+1] + dat[offset+2])/3;
			var ng = 255 - ((255 - greyscale) * dat[offset + 3]/255);
			var newgray = Math.round(ng/255*(charray.length-1));
			var c = charray[newgray];
			
			//console.log(len);
			while ((textWidth(font, ln + '.' + c))/cwidth <= x + 1) {
				div.append('.');
				ln += '.';
			}
			ln += c;
			
			div.append('<span style="color:rgb('+ dat[offset+0]+','+ dat[offset+1]+','+dat[offset+2]+')" class="text-cell">' + c +'</span>');
		}
		div.append('<br>');
	}
	text.empty();
	text.append(div);
}

var textWidth = function (font, text) {
  var f = font;
      o = $('<div>' + text + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'pre', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;
}