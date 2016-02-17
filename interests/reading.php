<?php
  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");
  
  $body = new Template("interests", "reading.tpl");
  $mainTemplate->set("title", "Reading");
  $mainTemplate->set("content", $body->output());
  echo $mainTemplate->output();
?>
