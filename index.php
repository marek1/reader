<?php
if ($_GET['run']) {
  # This code will run if ?run=true is set.
  exec("/var/www/vhosts/marek-sonnabend.de/httpdocs/reader/build.sh");
}
?>
<p>Go to <a href="reader.html">Webpage</a> | <a href="reader.pdf">PDF</a></p>
<p>Create <a href="index.php?run=true">CREATE</a></p>
<script src="https://apis.google.com/js/platform.js" async defer></script>
<div class="g-savetodrive"
   data-src="reader.pdf"
   data-filename="reader.pdf"
   data-sitename="MMReader">
</div>
