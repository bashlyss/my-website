<?php
  include($_SERVER['DOCUMENT_ROOT'] . "/templates/template.class.php");
  
  $body = new Template("interests", "cottage.tpl");
  $mainTemplate->set("title", "Cottage");
  $mainTemplate->set("content", $body->output());
  echo $mainTemplate->output();
?>
