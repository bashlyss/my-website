<?php
  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");
  
  $body = new Template("interests", "programming.tpl");
  $mainTemplate->set("title", "Programming");
  $mainTemplate->set("content", $body->output());
  echo $mainTemplate->output();
?>
