<?php
  mysql_connect() or
      die("Could not connect: " . mysql_error());
  mysql_select_db("james-database");


  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");

  $query = "SELECT id, name, year, genre, runtime, imdb_link, quality, series FROM movies";
  $cols = ['id', 'name', 'year', 'genre', 'runtime', 'imdb_link', 'rating', 'series'];

  $result = mysql_query($query);

  $movie_listing = new Template("movies", "listing.tpl");
  while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
    $rowTemplate = new Template("movies", "list-item.tpl");
    for ($x = 0; $x <= 8; $x++) {
      $rowTemplate->set($cols[$x], $row[$x]);
    }
    $rowTemplates[] = $rowTemplate;
  }
  mysql_free_result($result);

  $allrows = Template::merge($rowTemplates);

  $movie_listing->set("movies", $allrows);

  $mainTemplate->set("title", "James' Website");
  $mainTemplate->set("content", $movie_listing->output());
  echo $mainTemplate->output();
 
?>