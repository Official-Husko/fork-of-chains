#!/bin/bash
# Fort of Chains Basic Compiler - Linux/macOS. Adapted from free cities.

# By default compiles with the script/styles bundles from /generated/dist
# Run with 'debug' arg to use the ones from /generated/debug

output=/dev/stdout

#display an error message
function echoError() {
  echo -e "\033[0;31m$*\033[0m" >"${output}"
}

#display message
function echoMessage() {
  echo "$1" >"${output}"
}

#compile the HTML file
function compile() {
  export TWEEGO_PATH=dev/tweeGo/storyformats
  [ -z "$TWEEGO_EXE" ] && TWEEGO_EXE="tweego"

  if hash $TWEEGO_EXE 2>/dev/null; then
    :
    #echoMessage "system tweego binary"
  else
    case "$(uname -m)" in
      x86_64 | amd64 | arm64)
        #echoMessage "x64 arch"
        if [ "$(uname -s)" = "Darwin" ]; then
          TWEEGO_EXE="./dev/tweeGo/tweego_osx64"
        elif [ "$OSTYPE" = "msys" ]; then
          TWEEGO_EXE="./dev/tweeGo/tweego_win64"
        else
          TWEEGO_EXE="./dev/tweeGo/tweego_nix64"
        fi
        ;;
      x86 | i[3-6]86)
        #echoMessage "x86 arch"
        if [ "$(uname -s)" = "Darwin" ]; then
          TWEEGO_EXE="./dev/tweeGo/tweego_osx86"
        elif [ "$OSTYPE" = "msys" ]; then
          TWEEGO_EXE="./dev/tweeGo/tweego_win86"
        else
          TWEEGO_EXE="./dev/tweeGo/tweego_nix86"
        fi
        ;;
      *)
        echoError "No system tweego binary found, and no precompiled binary for your platform available."
        echoError "Please compile tweego and put the executable in PATH."
        exit 2
        ;;
    esac
  fi

  OUTFILE="${3:-dist/index.html}"

  if [ "${1:-dist}" = "dist" ]; then
    GENERATED_DIR="generated/dist"
  elif [ "$1" = "debug" ]; then
    GENERATED_DIR="generated/debug"
  else 
    GENERATED_DIR="$1"
  fi

  SCRIPTS_DIR=""
  STYLES_DIR=""
  if [ "$1" != "devserver" ]; then
    SCRIPTS_DIR="$GENERATED_DIR/scripts/"
    STYLES_DIR="$GENERATED_DIR/styles/"
  fi

  echo "Running tweego"

  set -x
  $TWEEGO_EXE -f ${npm_package_config_format:-'sugarcube-2'} ${2:-} -m src/modules/ --head=src/head-content.html -o $OUTFILE project/ $SCRIPTS_DIR $STYLES_DIR || build_failed="true"
  { set +x; } 2>/dev/null

  if [ "$1" != "devserver" ]; then
    DYNAMIC_MODULES_DIR="dist/js"
    if [ "$GENERATED_DIR" = "generated/debug" ]; then
      DYNAMIC_MODULES_DIR="dist/js-debug"
    fi

    rm -r "$DYNAMIC_MODULES_DIR" 2> /dev/null || true
    cp -rf "$GENERATED_DIR/dynamic-modules" "$DYNAMIC_MODULES_DIR"
  fi

  if [ "$build_failed" = "true" ]; then
    echoError "Build failed"
    exit 1
  fi

  echoMessage "Built $OUTFILE"
}

compile "$1" "$2" "$3"



