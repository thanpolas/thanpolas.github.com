!function(){

  var $container = $('.container-narrow');
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
    $container.css('border-color', hsl);
    setTimeout(lolipop, 4000);
  }

  setTimeout(lolipop, 1500);

}();
