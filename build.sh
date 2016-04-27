#!/usr/bin/env sh
export LC_ALL=en_US.UTF-8
sudo dpkg-reconfigure locales
node /var/www/vhosts/marek-sonnabend.de/httpdocs/reader/index.js
node /usr/local/lib/node_modules/html-pdf/bin/index.js /var/www/vhosts/marek-sonnabend.de/httpdocs/reader/index.html /var/www/vhosts/marek-sonnabend.de/httpdocs/reader/reader.pdf
