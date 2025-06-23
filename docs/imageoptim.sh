find -type f -name "*.png" -exec optipng {} \;
find -type f -name "*.jpg" -exec jpegoptim --strip-all {} \;
