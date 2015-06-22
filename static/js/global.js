$(document).ready( function () {
  $(".sub-heading").parent().children("ul").hide();
  $(".sub-heading").click( function () {
    $(this).parent().children("ul").toggle();
  });
  
  $(".movie-listing").tablesorter({ 
    // sort on the first column and third column, order asc 
    sortList: [[4,1],[0,0]] 
  }); 
  
  $("#rating-slider").slider({
    max: 10,
    min: 1,
    values: [ 1, 10 ],
    range: true,
    slide: function( event, ui ) {
      $( "[name='min-rating']" ).val( ui.values[ 0 ] );
      $( "[name='max-rating']" ).val( ui.values[ 1 ] );
      $("#movie-search-form").submit();
    }
  });
  $("#year-slider").slider({
    max: 2015,
    min: 1950,
    values: [ 1950, 2015 ],
    range: true,
    slide: function( event, ui ) {
      $( "[name='min-year']" ).val( ui.values[ 0 ] );
      $( "[name='max-year']" ).val( ui.values[ 1 ] );
      $("#movie-search-form").submit();
    }
  });
});

$("#movie-search-form").submit(function () {
  event.preventDefault();
  
  var posting = $.post("/movies/search.php", {
    keyword: $("[name='keyword']").val(),
    'min-rating': $("[name='min-rating']").val(),
    'max-rating': $("[name='max-rating']").val(),
    'min-year': $("[name='min-year']").val(),
    'max-year': $("[name='max-year']").val()
  });
  posting.done(function(data) {
    arr = JSON.parse(data);
    $("tbody tr").hide();
    if (arr) {
      $("tbody tr td:last-child").each( function () {
        for (var i = 0; i < arr.length; i++) {
          if ($(this).text() === arr[i]) {
            $(this).parent().show();
          }
        }
      });
    }
  });
});