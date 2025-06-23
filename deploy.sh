#!/bin/bash

output=/dev/stdout

debug=$1
twee=$2
tweego_extra_args=""

NODEJS="${npm_node_execpath:-nodejs}"

if [ "$debug" = "debugfast" ] || [ "$debug" = "debug" ]; then
  outfile="dist/index.html"
  #tweego_extra_args="-t"
  generateddir="generated/debug"
else
  echo "[PRECOMPILED / DEPLOY] Sanity checks..." > $output

  sh sanityCheck.sh

  "$NODEJS" dev/checkImageMetas.js --strict --check
  "$NODEJS" dev/checkImageMetas.js --strict --check dist/imagepacks/CCSubmission
  "$NODEJS" dev/checkImageMetas.js --strict --check --room
  "$NODEJS" dev/checkImageMetas.js --strict --check --content

  if [ "$debug" = "precompiled" ]; then
    outfile="dist/precompiled.html"
  else
    outfile="dist/index.html"
  fi

  generateddir="generated/dist"
fi

if [ "$debug" = "deployitch" ]; then
  echo ":: ItchIoOnlyPassage" > project/twee/itch_io.twee
else
  rm -f project/twee/itch_io.twee || true
fi

if ! [ "$debug" = "sanity" ]; then

  if [ "$twee" = "twee" ]; then
    echo "Skipping vite..." > $output
  elif [ "$debug" = "debug" ]; then
    echo "Running vite on DEBUG mode..." > $output
    SKIP_TWEE=1 npx vite build --mode development
  elif [ "$debug" = "deployitch" ]; then
    echo "Running vite on ITCH mode..." > $output
    SKIP_TWEE=1 npx vite build --mode itch
  else
    echo "Running vite on DEPLOY mode..." > $output
    SKIP_TWEE=1 npx vite build --mode production
  fi

  ./compile.sh "$generateddir" "$tweego_extra_args" "$outfile"

  if [ "$debug" = "deploy" ] || [ "$debug" = "deployfull" ] || [ "$debug" = "deployitch" ]; then

    echo "[DEPLOY] Making deployment directory..." > $output
    rm -r deploy/ 2> /dev/null
    cp -r dist deploy
    rm deploy/precompiled.html
    rm deploy/devserver.html

    if [ "$debug" = "deployitch" ]; then
      echo "[ITCH.IO] merging imagemeta.js"
      rm -r deploy/imagepacks/default
      cp -r ../itchunit deploy/imagepacks/default
      "$NODEJS" dev/checkImageMetas.js --strict --check --merge --flatten deploy/imagepacks/default
      "$NODEJS" dev/checkImageMetas.js --strict --check --room deploy/img/room/imagepack.js
    fi

    #echo "[DEPLOY] Removing unused images..." > $output
    #rm -r deploy/img/special/big

    zipfile='focfull.zip'

    if [ "$debug" = "deployitch" ]; then
      echo "[ITCH.IO] Replacing unit image pack..." > $output

      rm -r deploy/img/customunit/

      rm -r deploy/img/duty
      rm -r deploy/img/equipment
      rm -r deploy/img/equipmentslot
      rm -r deploy/img/furnitureslot
      rm -r deploy/img/itemclass

      rm -r deploy/img/job
      rm -r deploy/img/other

      rm -r deploy/img/panorama/big

      rm -r deploy/img/rarity
      rm -r deploy/img/role
      rm -rf deploy/img/room/*/
      rm -r deploy/img/room/*.svg
      rm -r deploy/img/room/*.png

      rm -r deploy/img/sexbodypart
      rm -r deploy/img/sexpose
      rm -r deploy/img/sexposition

      rm -r deploy/img/special

      rm -r deploy/img/tag_building
      rm -r deploy/img/tag_duty
      rm -r deploy/img/tag_lore
      rm -r deploy/img/tag_quest
      rm -r deploy/img/tag_room
      rm -r deploy/img/tag_sexaction
      rm -r deploy/img/tag_trait
      rm -r deploy/img/tag_unitaction

      rm -r deploy/img/trait

      # leave only the default imagepack
      mkdir deploy/imagepacks-itch
      mv deploy/imagepacks/default deploy/imagepacks-itch/default
      rm -r deploy/imagepacks
      mv deploy/imagepacks-itch deploy/imagepacks

      rm -r deploy/mods

      rm -r deploy/install.txt

      echo "[ITCH.IO] Cleanup unit images folder..."
      # remove all the subdirectories (leave only imagepack.js and the flattened images)
      find deploy/imagepacks/default -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} \;
      rm generated/dist/scripts/images.min.js

      zipfile='focitch.zip'
    fi

    echo "[DEPLOY] Zipping..." > $output
    zip -q -r $zipfile deploy

    echo "[DEPLOY] Cleanup..." > $output
    rm -r deploy/
    rm -f project/twee/itch_io.twee || true
  fi

fi

