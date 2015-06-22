<?php
  mysql_connect() or
      die("Could not connect: " . mysql_error());
  mysql_select_db("james-database");
  
  $searchKey = '';
  if (isset($_POST['keyword'])) {
    $searchKey = $_POST['keyword'];
  }
  $minRating = intval($_POST['min-rating']);
  $maxRating = intval($_POST['max-rating']);
  $minYear = intval($_POST['min-year']);
  $maxYear = intval($_POST['max-year']);

  $baseQuery = "SELECT id FROM movies";
  $searchQuery = " WHERE (name LIKE '%" . $searchKey . "%'";
  $searchQuery .= " OR series LIKE '%" . $searchKey . "%'";
  $searchQuery .= " OR genre LIKE'%" . $searchKey . "%')";
  if ($minRating) {
    $searchQuery .= " AND quality >= " . $minRating;
  }
  if ($maxRating) {
    $searchQuery .= " AND quality <= " . $maxRating;
  }
  if ($minYear) {
    $searchQuery .= " AND year >= " . $minYear;
  }
  if ($maxYear) {
    $searchQuery .= " AND year <= " . $maxYear;
  }

  $result = mysql_query($baseQuery . $searchQuery);

  while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
    $results[] = $row[0];
  }

  mysql_free_result($result);
  echo json_encode($results);
?>