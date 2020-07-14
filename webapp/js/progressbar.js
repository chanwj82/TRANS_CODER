/* jQuery Progress Bar Plugin - v1.0.0
 * Copyright (c) 2015 Zeyu Feng; Licensed MIT
 * https://github.com/clarkfbar/jquery.progress
 * */

$.fn.extend({
  Progress: function(options){
    var settings = {
      width: 90, // 瓦쎾벧�▼�佯�
      height: 20, // 瓦쎾벧�↓쳵佯�
      percent: 0, // 壤볟뎺�졿캈
      backgroundColor: '#555', // 瓦쎾벧�↑깒��쥪��
      barColor: '#d9534f', // 瓦쎾벧�↓쥪��
      fontColor: '#fff', // �얍늽驪붷춻鵝볣쥪��
      radius: 4, // 渦배쭜�녶벧
      fontSize: 12, // 耶쀤퐪鸚㎩컦
      increaseTime: 1000.00/60.00, // 驪뤶�轝↑컘�닺퓵佯�씉�꾣뿶��, 容섋���鵝녔뿶��(��빳瘟껃ㄷ竊뚥툖誤곮컘弱�)竊쎾룵�됧쑉animate訝틊rue�꾣깄�듕툔�됪븞
      increaseSpeed: 1, // 驪뤸А瘟껅빐竊뚦쥭�욥�잌벧竊쎾룵�됧쑉animate訝틊rue�꾣깄�듕툔�됪븞
      animate: true // 瘟껅빐�꾣뿶�숋펽��맔鵝욜뵪�①뵽罌욇빣竊뚪퍡溫ㅴ맏true
    };
    $.extend(settings, options);

    var $svg = $(this), $background, $bar, $g, $text, timeout;

    function progressPercent(p){
      if(!$.isNumeric(p) || p < 0) {
        return 0;
      } else if(p > 100) {
        return 100;
      } else {
        return p;
      }
    }        

    // �①뵽�멨뀽�방퀡
    var Animate = {
      getWidth: function(){
        // �룟룚壤볟뎺�꾢�佯�펽�방뜮�삣�佯�뭽percent
        return settings.width * settings.percent / 100.00;
      },
      getPercent: function(currentWidth){
        // �방뜮壤볟뎺�꾢�佯�펽溫←츞壤볟뎺�꼙ercent
        return parseInt((100 * currentWidth / settings.width).toFixed(2));
      },
      animateWidth: function(currentWidth, targetWidth){
        // �①뵽罌욇빣
        timeout = setTimeout(function(){
          if(currentWidth > targetWidth) {
            if(currentWidth - settings.increaseSpeed <= targetWidth) {
              currentWidth = targetWidth;
            } else {
              currentWidth = currentWidth - settings.increaseSpeed;
            }
          } else if(currentWidth < targetWidth) {
            if(currentWidth + settings.increaseSpeed >= targetWidth) {
              currentWidth = targetWidth;
            } else {
              currentWidth = currentWidth + settings.increaseSpeed;
            }
          }

          $bar.attr("width", currentWidth);
          $text.empty().append(Animate.getPercent(currentWidth) + "%");

          if(currentWidth != targetWidth) {
            Animate.animateWidth(currentWidth, targetWidth);
          }
        }, settings.increaseTime); 
      }
    }

    function svg(tag){
      return document.createElementNS("http://www.w3.org/2000/svg", tag);
    }

    // �앭쭓�뽪씉餓�
    !!function(){
      settings.percent = progressPercent(settings.percent);

      $svg.attr({'width': settings.width, 'height': settings.height});

      $background = $(svg("rect")).appendTo($svg)
                      .attr({x: 0, rx: settings.radius, width: settings.width, height: settings.height, fill: settings.backgroundColor});

      $bar = $(svg("rect")).appendTo($svg)
                .attr({x: 0, rx: settings.radius, height: settings.height, fill: settings.barColor});

      $g = $(svg("g")).appendTo($svg)
                .attr({"fill": "#fff", "text-anchor": "middle", "font-family": "DejaVu Sans,Verdana,Geneva,sans-serif", "font-size": settings.fontSize});

      $text = $(svg("text")).appendTo($g)
                .attr({"x": settings.width/2.0, "y": settings.height/2.0 + settings.fontSize/3.0, fill: settings.fontColor});

      draw();
    }();

    // 瀯섇댍瓦쎾벧��
    function draw() {
      var targetWidth = Animate.getWidth();

      // ��맔鵝욜뵪�①뵽罌욇빣
      if(settings.animate) {
        if(timeout) {
          clearTimeout(timeout);
        }
        var currentWidth = parseFloat($bar.attr("width"));
        if(!currentWidth) currentWidth = 0;

        Animate.animateWidth(currentWidth, targetWidth);
      } else {
        $bar.attr("width", targetWidth);
        $text.empty().append(settings.percent + "%");
      }
    }

    this.percent = function (p) {
      if(p) {
        p = progressPercent(p);

        settings.percent = p;
        draw();
      }
      return settings.percent;
    }

    return this;
  }
});