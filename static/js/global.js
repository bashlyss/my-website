$(document).ready( function () {
  $(".sub-heading").parent().children("ul").hide();
  $(".sub-heading").click( function () {
    $(this).parent().children("ul").toggle();
  });
});
