window.lc = {
  mobile: navigator.userAgent.indexOf("Mobile") !== -1 ||
    navigator.userAgent.indexOf("iPhone") !== -1 ||
    navigator.userAgent.indexOf("Android") !== -1 ||
    navigator.userAgent.indexOf("Windows Phone") !== -1,
  download: function(url) {
    var x = document.createElement("A");
    $(x).attr("href", url);
    $(x).attr("download", "");
    x.click();
  },
  hide: function(itm, hid) {
    if (hid) {
      if (!itm.hasClass("lc_hidden")) {
        itm.addClass("lc_hidden");
      }
    } else {
      if (itm.hasClass("lc_hidden")) {
        itm.removeClass("lc_hidden");
      }
    }
  },
  checkoverflow: function() {

    $(".lc_cap").each(function(i) {
      var bounding = this.getBoundingClientRect();
      var lb = $(".lc_cap .lc_caphidden")[0].getBoundingClientRect();

      var overflowing = false;
      $(this).children().each(function() {
        if ($(this).hasClass("lc_caphidden")) return;
        lc.hide($(this), false)

        var tbounding = this.getBoundingClientRect();

        if (bounding.left + bounding.width - lb.width - 10 < tbounding.left + tbounding.width) {
          lc.hide($(this), true);
          overflowing = true;
          console.log(this);
        } else {
          lc.hide($(this), false);

        }
      });
      var lc_caphidden = $(".lc_cap .lc_caphidden");
      lc.hide(lc_caphidden, !overflowing)

    })
  },

};

$(function() {
  if (lc.mobile) {
    $("body").addClass("lc_mobile");
  }
  $('body').css("display", "block")
/*
  $(window).resize(lc.checkoverflow);

  lc.checkoverflow();
  setInterval(lc.checkoverflow, 1000);
  */
});
