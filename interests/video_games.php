<?php
  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");
  
  $body = new Template("interests", "video_games.tpl");
  $mainTemplate->set("title", "Video Games");
  $mainTemplate->set("content", $body->output());
  echo $mainTemplate->output();
?>
