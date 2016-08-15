<?php
  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");
  
  $body = new Template("interests", "stagemanagement.tpl");
  $mainTemplate->set("title", "James' Website");
  $mainTemplate->set("content", $body->output());
  echo $mainTemplate->output();
?>