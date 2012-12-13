!function(){

  // define wrapper elements with containers
  var wrappers = [
    {
      selector: '.post p img',
      wrapContainer: '<div class="post-image"></div>'
    },
    {
      selector: 'table.highlighttable, div>div.highlight',
      wrapContainer: '<figure class="code"></figure>'
    }
  ];

  /**
   * Wrap defined elements in proper containers
   * @return {[type]} [description]
   */
  function wrapElements() {
    for (var i = 0, len = wrappers.length; i < len; i++) {
      $(wrappers[i].selector).wrap(wrappers[i].wrapContainer);
    }
  }
  wrapElements();

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
