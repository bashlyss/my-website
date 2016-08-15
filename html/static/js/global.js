$(document).ready( function () {
  $(".sub-heading").parent().children("ul").removeClass("open");
  $(".sub-heading").click( function () {
    $(this).parent().children("ul").toggleClass("open");
  });

});

