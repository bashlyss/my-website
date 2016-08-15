<?php
  $config = parse_ini_file('../../config.ini');
  $connection = mysqli_connect("localhost", $config['username'], $config['password'], $config['dbname']) or
      die("Could not connect: " . mysqli_error());


  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");

  $query = "SELECT id, name, year, genre, runtime, imdb_link, quality, series, review FROM movies";
  $cols = ['id', 'name', 'year', 'genre', 'runtime', 'imdb_link', 'quality', 'series', 'review'];

  $result = mysqli_query($connection, $query);

  $movie_listing = new Template("movies", "listing.tpl");
  while ($row = mysqli_fetch_assoc($result)) {
    $rowTemplate = new Template("movies", "list-item.tpl");
    for ($x = 0; $x <= 8; $x++) {
      $rowTemplate->set($cols[$x], $row[$cols[$x]]);
    }
    $rowTemplates[] = $rowTemplate;
  }
  mysqli_free_result($result);

  $allrows = Template::merge($rowTemplates);

  $movie_listing->set("movies", $allrows);

  $mainTemplate->set("js", "/static/js/movies.js");
  $mainTemplate->set("title", "James' Website");
  $mainTemplate->set("content", $movie_listing->output());
  echo $mainTemplate->output();
 
?>
