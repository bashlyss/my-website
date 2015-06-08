<?php
  include("templates/template.class.php");
  
  $body = new Template("base", "home.tpl");
  $mainTemplate->set("title", "James' Website");
  $mainTemplate->set("content", $body->output());
  echo $mainTemplate->output();
?>
