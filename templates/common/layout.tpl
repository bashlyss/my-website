<!DOCTYPE html>
<html lang="en">
  <head>
    <title>[@title]</title>
    <link rel="stylesheet" type="text/css" href="/static/css/global.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/ext/jquery-ui.min.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/ext/bootstrap.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <div class="container">
      <div class="jumbotron">
        [@header]
      </div>
      <div class="body">
        <div class="navbar navbar-inverse sidebar" role="navigation">
          [@sidebar]
        </div>
        <div class="main">
          [@content]
        </div>
        <div class="footer">
          [@footer]
        </div>
      </div>
    </div>
  </body>

  <!-- Various external js libraries and support for my personal js -->
  <script src="/static/js/ext/jquery-1.11.2.min.js" type="text/javascript"></script>
  <script src="/static/js/ext/bootstrap.min.js" type="text/javascript"></script>
  <script src="/static/js/ext/jquery-ui.min.js" type="text/javascript"></script>
  <script src="/static/js/ext/jquery.ui.touch-punch.min.js"></script>
  <script src="/static/js/ext/jquery.tablesorter.min.js" type="text/javascript"></script>
  <script src="/static/js/ext/jquery.tablesorter.widgets.js" type="text/javascript"></script>
  <script src="/static/js/global.js" type="text/javascript"></script>
  <script src="[@js]" type="text/javascript"></script>
</html>
