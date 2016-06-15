<html>
<head>
    <title>Marek Sonnabend | Reader</title>
    <style>
    body{
        font-size: 20px;
    }
    hr{
        margin: 5px 0;
    }
    </style>
</head>
<body>
<?php
if ($_GET['small']) {
  # This code will run if ?run=true is set.
  exec("/var/www/vhosts/marek-sonnabend.de/httpdocs/reader/build.sh");
} else if ($_GET['medium']) {
  exec("/var/www/vhosts/marek-sonnabend.de/httpdocs/reader/build_medium.sh");
} else if ($_GET['big']) {
  exec("/var/www/vhosts/marek-sonnabend.de/httpdocs/reader/build_big.sh");
}
?>
<p>Go to <a href="reader.html">Webpage</a> | <a href="reader.pdf">PDF</a></p>
<hr>
<p>Create <a href="index.php?run=small">Create small issue (10 titles)</a></p> |
<p>Create <a href="index.php?run=medium">Create medium issue (20 titles)</a></p> |
<p>Create <a href="index.php?run=big">Create BIG issue (30 titles)</a></p>
<hr>
<script src="https://apis.google.com/js/platform.js" async defer></script>
<div class="g-savetodrive"
   data-src="reader.pdf"
   data-filename="reader.pdf"
   data-sitename="MMReader">
</div>
</body>