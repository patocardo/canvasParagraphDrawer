    var CanvasParagrapher = function(context, settings) {
      settings = settings || {};
      var maxWidth = (settings.maxWidth) ? settings.maxWidth : 200;
      var font = (settings.font) ? settings.font : '0.7rem Helvetica';
      var align = (settings.align) ? settings.align : 'left';
      var fill = (settings.fill) ? settings.fill : 'black';
      var stroke = (settings.stroke) ? settings.stroke : false;
      var lineHeight = (settings.lineHeight) ? settings.lineHeight : 12;
      
      function getWidth (lines){
        var totalWidth = 0;
        var testWidth, metrics;
        lines.forEach(function(lineObj) {
          metrics = context.measureText(lineObj.line);
          testWidth = metrics.width;
          totalWidth = (testWidth > totalWidth) ? testWidth : totalWidth;          
        });
        return totalWidth;
      }
      function wrap (text){
        var words = text.split(' ');
        var lines = [];
        var y = 0;
        var line = '';
        var totalWidth = 0;
        var testLine,
            metrics,
            testWidth,
             n;
        for (n = 0; n < words.length; n++) {
          testLine = line + words[n] + ' ';
          metrics = context.measureText(testLine);
          testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            lines.push({line: line, x: 0, y: y});
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        lines.push({line: line, x: 0, y: y});
        return {
          'width' : getWidth(lines),
          'height' : y + lineHeight,
          'lines' : lines
        };
      }
      function posture ( paragraph, horizontal, vertical) {
        var newX = 0;
        switch (horizontal) {
          case 'center':         
            newX = (context.textAlign == 'left') 
              ? -1 * paragraph.width / 2 
              : ( (context.textAlign == 'right') ? paragraph.width / 2 : 0);
            break;
          case 'right':
            newX = (context.textAlign == 'left') 
              ? -1 * paragraph.width 
              : ( (context.textAlign == 'center') ? -1 * paragraph.width / 2 : 0);
            break;       
          default:
            newX = (context.textAlign == 'right') 
              ? paragraph.width 
              : ( (context.textAlign == 'center') ? paragraph.width / 2 : 0);
        }
        paragraph.lines.forEach( function(elm) {            
          elm.x += newX;
        });
        if (vertical == 'middle' || vertical == 'bottom') {
          var newY = (vertical == 'middle') ? paragraph.height / 2 : paragraph.height;
          paragraph.lines.forEach( function(elm) {            
            elm.y -= newY;
          });
        }
        return paragraph;
      }
      return {
        print : function (text, x, y, settings){
          //TODO: validate parameters and give them default values
          context.textAlign = (settings && settings.align) ? settings.align: align;
          context.font = (settings && settings.font) ? settings.font : font;
          context.fillStyle = (settings && settings.fill) ? settings.fill : fill;
          context.strokeStyle = (settings && settings.stroke) ? settings.stroke : stroke;
          var posH = (settings && settings.originX) ? settings.originX : 'left';
          var posV = (settings && settings.originY) ? settings.originY : 'top';
          var wrapped = wrap(text);
          var postured = posture(wrapped, posH, posV);
          for (var ili = 0; ili < postured.lines.length; ili++){
            if(fill) {
              context.fillText(postured.lines[ili].line, x + postured.lines[ili].x, y + postured.lines[ili].y);
            }
            if(stroke) {
              context.strokeText(postured.lines[ili].line, x + postured.lines[ili].x, y + postured.lines[ili].y);
            }
          }
        }
      }
    }
