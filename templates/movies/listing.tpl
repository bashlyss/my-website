<h1>Movies</h1>
<p>Below is a collection of movies I have watched and my rating for them.  I hope to have short reviews for as many as possible shortly.</p>
<form id="movie-search-form" method="POST" action="javascript:void(0)">
  <input type="text" name="keyword" placeholder="Search"/><br />
  <div class="range-filter">
    <input type="text" name="min-rating" value="1" placeholder="Min Rating"/>
    <input type="text" name="max-rating" value="10" placeholder="Max Rating"/>
    <div id="rating-slider"></div>
  </div>
  <div class="range-filter">
    <input type="text" name="min-year" value="1950" placeholder="Min Year"/>
    <input type="text" name="max-year" value="2015" placeholder="Max Year"/>
    <div id="year-slider"></div>
  </div>
  <input type="submit" value="Search" />
</form>
  
<table class="movie-listing">
  <thead class="movie-listing-header">
    <th class="col1" id="movie-header">Movie</th>
    <th class="col2" id="year-header">Year</th>
    <th class="col3" id="genre-header">Genre</th>
    <th class="col4" id="runtime-header">Runtime</th>
    <th class="col5" id="rating-header">Rating /10</th>
    <th class="col6" id="id-header"></th>
  </thead>
  <tbody>
    [@movies]
  </tbody>
</table>