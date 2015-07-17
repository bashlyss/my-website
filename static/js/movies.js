$(document).ready( function () {
  $(".movie-listing").tablesorter({ 
    // sort on the first column and third column, order asc 
    sortList: [[4,1],[0,0]],
    cssChildRow: "review",
    widgets: ["filter"],
    widgetOptions: {
      filter_external: '.search',
      filter_startsWith: false,
      filter_ignoreCase: true,
      filter_hideEmpty: true,
      filter_liveSearch: true
    }
  }); 
  
  $(".movie-listing-item").click(function () {
    $(this).next(".review").toggle();
  });
  
  $("#rating-slider").slider({
    max: 10,
    min: 1,
    values: [ 1, 10 ],
    range: true,
    slide: function( event, ui ) {
      $( "[name='min-rating']" ).val( ui.values[ 0 ] );
      $( "[name='max-rating']" ).val( ui.values[ 1 ] );
      $(this).find(".ui-slider-handle").eq(0).text(ui.values[0]);
      $(this).find(".ui-slider-handle").eq(1).text(ui.values[1]);
      $(".tablesorter-filter[data-column='4']").val("<=" + ui.values[1] + " && >=" + ui.values[0]).trigger("search");
    }
  });
  $("#year-slider").slider({
    max: 2015,
    min: 1950,
    values: [ 1950, 2015 ],
    range: true,
    step: 5,
    slide: function( event, ui ) {
      $( "[name='min-year']" ).val( ui.values[ 0 ] );
      $( "[name='max-year']" ).val( ui.values[ 1 ] );
      $(this).find(".ui-slider-handle").eq(0).text(ui.values[0]);
      $(this).find(".ui-slider-handle").eq(1).text(ui.values[1]);
      $(".tablesorter-filter[data-column='1']").val(">=" + ui.values[0] + " && <=" + ui.values[1]).trigger("search");
    }
  });
  
  $("#year-slider").find(".ui-slider-handle").eq(0).text(1950);
  $("#year-slider").find(".ui-slider-handle").eq(1).text(2015);
  $("#rating-slider").find(".ui-slider-handle").eq(0).text(1);
  $("#rating-slider").find(".ui-slider-handle").eq(1).text(10);
});