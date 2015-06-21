<?php
  mysql_connect() or
      die("Could not connect: " . mysql_error());
  mysql_select_db("james-database");


  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");
  $sortField = 'quality';
  $sortOrder = 'DESC';
  $validSorts = ['name', 'year', 'genre', 'runtime', 'quality', 'series'];
  $validSortOrders = ['asc', 'desc'];
  if (isset($_POST['sort-field']) && in_array($_POST['sort-field'], $validSorts)) {
      $sortField = $_POST['sort-field'];
  }
  if (isset($_POST['sort-order']) && in_array($_POST['sort-order'], $validSortOrders)) {
      $sortOrder = $_POST['sort-order'];
  }
  
  $searchKey = '';
  if (isset($_POST['keyword'])) {
    $searchKey = $_POST['keyword'];
  }

  $baseQuery = "SELECT name, year, genre, runtime, imdb_link, quality, series FROM movies";
  $searchQuery = " WHERE name LIKE '%" . $searchKey . "'";
  $sortQuery =  " ORDER BY " . $sortField . " " . $sortOrder;
  $result = mysql_query($baseQuery . $searchQuery . $sortQuery);

  $movie_listing = new Template("movies", "listing.tpl");
  while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
    $rowTemplate = new Template("movies", "list-item.tpl");
    $rowTemplate->set("name", $row[0]);
    $rowTemplate->set("year", $row[1]);
    $rowTemplate->set("genre", $row[2]);
    $rowTemplate->set("runtime", $row[3]);
    $rowTemplate->set("imdb_link", $row[4]);
    $rowTemplate->set("rating", $row[5]);
    $rowTemplate->set("series", $row[6]);
    $rowTemplates[] = $rowTemplate;
  }
  mysql_free_result($result);

  $allrows = Template::merge($rowTemplates);

  $movie_listing->set("movies", $allrows);
  $movie_listing->set("sort-order", $sortOrder);
  $movie_listing->set("sort-field", $sortField);
  

  $mainTemplate->set("title", "James' Website");
  $mainTemplate->set("content", $movie_listing->output());
  echo $mainTemplate->output();
 
?>