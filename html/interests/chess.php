<?php
  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");
  
  $body = new Template("interests", "chess.tpl");
  $mainTemplate->set("title", "Chess");
  $mainTemplate->set("content", $body->output());
  echo $mainTemplate->output();
?>
