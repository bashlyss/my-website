$(document).ready( function () {
  $(".sub-heading").parent().children("ul").hide();
  $(".sub-heading").click( function () {
    $(this).parent().children("ul").toggle();
  });
  
  // $("#movie-search-form").tablesorter();
  $("#movie-header").click(function () {
    sortMovies("name", "asc");
  });
  $("#year-header").click(function () {
    sortMovies("year", "desc");
  });
  $("#genre-header").click(function () {
    sortMovies("genre", "asc");
  });
  $("#runtime-header").click(function () {
    sortMovies("runtime", "desc");
  });
  $("#rating-header").click(function () {
    sortMovies("quality", "desc");
  });
});

function sortMovies (sortField, defaultOrder) {
  var curVal = $("[name='sort-field']").val();
  if (curVal === sortField) {
    if ("asc" === $("[name='sort-order']").val()) {
      $("[name='sort-order']").val("desc");
    } else {
      $("[name='sort-order']").val("asc");
    }
  } else {
    $("[name='sort-field']").val(sortField);
    $("[name='sort-order']").val(defaultOrder);
  }
  $("#movie-search-form").submit();
}