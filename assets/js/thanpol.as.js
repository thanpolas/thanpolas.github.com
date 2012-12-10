!function(){

  var $lolipopBorder = $('.lolipop-border');
  var $lolipopFont = $('.lolipop-font');
  var orientations = [0, 60, 120, 180, 240, 300];
  var point = 0;
  /**
   * [lolipop description]
   * @return {[type]} [description]
   */
  function lolipop() {
    var hue = orientations[point];
    point++;
    if (point > orientations.length - 1) {
      point = 0;
    }
    var hsl = 'hsl(' + hue + ' ,100%, 50%)';

    $lolipopBorder.css('border-color', hsl);
    $lolipopFont.css('color', hsl);
    setTimeout(lolipop, 14000);
  }

  setTimeout(lolipop, 14000);

}();
