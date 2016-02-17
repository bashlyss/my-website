<?php
  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");
  
  $body = new Template("interests", "travel.tpl");
  $mainTemplate->set("title", "Travel");
  $mainTemplate->set("content", $body->output());
  echo $mainTemplate->output();
?>
