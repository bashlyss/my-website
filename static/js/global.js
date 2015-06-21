$(document).ready( function () {
  $(".sub-heading").parent().children("ul").hide();
  $(".sub-heading").click( function () {
    $(this).parent().children("ul").toggle();
  });
  
  $(".movie-listing").tablesorter({ 
    // sort on the first column and third column, order asc 
    sortList: [[4,1],[0,0]] 
  }); 
});

$("#movie-search-form").submit(function () {
  event.preventDefault();
  
  var posting = $.post("/movies/search.php", {
    keyword: $("[name='keyword']").val()
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