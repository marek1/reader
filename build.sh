#!/usr/bin/env sh
export LC_ALL=en_US.UTF-8
sudo dpkg-reconfigure locales
node /var/www/vhosts/marek-sonnabend.de/httpdocs/reader/index.js
html-pdf index.html reader.pdf
