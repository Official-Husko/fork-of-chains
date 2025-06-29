#!/usr/bin/env bash

if [ ! -d ".git" ]; then
    echo "No .git repo found - skipping sanity checks"
    exit 0
fi

WARNING='\033[93m'
ENDC='\033[0m'

myprint() {
    local label="$1"
    while read -r data; do
        echo -e "[$label]${WARNING}${data}${ENDC}"
    done
}

GREP="git grep -n --color"
# Check for missing right angle bracket: <</if>
# $GREP "<</[^>]*>[^>]" -- 'project/twee/*'  | myprint "MissingClosingAngleBracket"
# $GREP "<<[^>()]*>[^()<>"$'\r]*\r'"\?$" -- 'project/twee/*' | myprint "MissingClosingAngleBracket"
# Check for missing left angle bracket: </if>>
$GREP "\([^<]\|^\)</\?\(if\|else\|case\|set\|print\|elseif\)" -- 'project/twee/*' | myprint "MissingOpeningAngleBracket2"
# Check for accidental assignment.  e.g.:   <<if $foo = "hello">>
$GREP "<<[ ]*if[^>=]*[^><\!=]=[^=>][^>]*>>" -- 'project/twee/*' | myprint "AccidentalAssignmentInIf"
# Check for accidental assignment.  e.g.:   <<elseif $foo = "hello">>
$GREP "<<[ ]*elseif[^>=]*[^><\!=]=[^=][^>]*>>" -- 'project/twee/*' | myprint "AccidentalAssignmentInElseIf"
# Check for missing ".  e.g.:   <<if $foo == "hello>>
$GREP -e "<<[^\"<>]*\"[^\"<>]*>>" -- 'project/twee/*' | myprint "MissingSpeechMark"
# Check for missing ".  e.g.:   <<if $foo = "hello)
$GREP -e "<<[^\"<>]*\([^\"<>]*\"[^><\"]*\"\| [<>] \)*\"\([^\"<>]*\"[^><\"]*\"\| [<>] \)*\([^\"<>]\| [<>] \)*>>" --and --not -e "*[^']*" -- 'project/twee/*' | myprint "MissingSpeechMark2"
# Check for colors like: @@color:red   - should be @@.red
$GREP -e "@@color:" --and --not -e  "@@color:rgb([0-9 ]\+,[0-9 ]\+,[0-9 ]\+)" -- "project/twee/*" | myprint "UseCssColors"
# Check for closing bracket without opening bracket.  e.g.:  <<if foo)>>	  (but  <<case "foo")>>   is valid, so ignore those
$GREP -e "<<[ a-zA-Z]\+\([^()<>]\|[^()<>][<>][^()<>]\)*)" --and --not -e "<< *case"  -- "project/twee/*" | myprint "MissingOpeningBracket"
# Check for opening bracket without closing bracket.  e.g.:  <<if (foo>>
$GREP -e "<<[ a-zA-Z]\([^<>]\|[^<>][<>][^<>]\)\+(\([^()<>]\|[^<>()][<>][^<>()]\|([^<>()]*])\)*>>" -- "project/twee/*" | myprint "MissingClosingBracket"
# Check for two closing brackets but one opening bracket.  e.g.:  <<if (foo))>>
$GREP -e "<<[ a-zA-Z]\+[^()<>]*([^()]*)[^()]*)[^()<>]*>>"  -- "project/twee/*" | myprint "MissingOpeningBracket2"
$GREP -e "<<.*[(][^<>)]*[(][^<>)]*)\?[^<>)]*>>" -- "project/twee/*" | myprint "MissingClosingBracket3"
# Check for missing >>.  e.g.:   <<if $foo
# $GREP "<<[^<>]*[^,\"\[{"$'\r]\r'"\?$" -- 'project/twee/*' | myprint "MissingClosingAngleBrackets"
# Check for too many >>>.  e.g.: <</if>>>
$GREP "<<[^<>\"]*[<>]\?[^<>\"]*>>>" -- "project/twee/*" | myprint "TooManyAngleBrackets"
# Check for too many <<<.  e.g.: <<</if>>
# $GREP "<<<[^<>\"]*[<>]\?[^<>\"]*>>" -- "project/twee/*" | myprint "TooManyAngleBrackets2"
# Check, e.g., <<//if>>
$GREP "<</[a-zA-Z]*[^a-zA-Z<>]\+[a-zA-Z]*>>" -- 'project/twee/*' | myprint "DoubleSlash"
# Check, e.g.  <<else $foo==4
$GREP "<<else >\?[^>]" -- 'project/twee/*' | myprint "ShouldBeElseIf"
# Check, e.g., = to
$GREP "= to" -- 'project/twee/*' | myprint "EqualAndTo"
# Check, e.g.  <<set foo == 4>>
$GREP "<<set[^{>=]*==" -- 'project/twee/*' | myprint "DoubleEqualsInSet"
# Check for missing $ or _ in variable name:
# $GREP -e "<<[a-zA-Z]\([^>\"]\|[^>]>[^>]\|\"[^\"]*\"\)* [a-zA-Z]\+ * =" -- project/twee/* | myprint "MissingDollar2"
# Check for missing command, e.g.  <<foo =
$GREP -e "<<[a-zA-Z]* = *" -- project/twee/* | myprint "BadCommand"
# Check for duplicate words, e.g. with with
$GREP -e  " \(\b[a-zA-Z][a-zA-Z]\+\) \1\b " --and --not -e " heh heh " --and --not -e " her her " --and --not -e " you you " --and --not -e " New New " --and --not -e "Slave Slave " --and --not -e " that that " --and --not -e " in in " --and --not -e " is is " -- 'project/twee/*' | myprint "Duplicate words"
# Check for obsolete SugarCube macros
$GREP -E "<<display |<<click|<<.*\.contains" -- project/twee/* | myprint "ObsoleteMacro"
# Check for double articles
$GREP -E "\Wa an\W" -- project/twee/* | myprint "DoubleArticle"
# Check for incorrect articles
$GREP -i -E "\Wa (a|e|i|o|u)." -- project/twee/* | grep -a -i -vE "\Wa (un|eu|us|ut|on|ur|in)." | grep -a -i -vE "(&|<<s>>|UM)." | myprint "IncorrectArticle"
$GREP -i -E "\Wan (b|c|d|f|g|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)\w." -- project/twee/* | grep -a -i -vE "[A-Z]{3}" | myprint "IncorrectArticle"
# Check for $ sign mid-word
$GREP -i "\w$\w" -- project/twee/* | myprint "VarSignMidWord"
# check for $ sign at beginning of macro
$GREP '<<\s*\$' -- 'project/twee/*'  | myprint "VarSignAtMacroStart"
# check for missing ; before statement
$GREP 'if $ ' -- 'project/twee/*'  | myprint "missing ; before statement"
$GREP 'elseif $ ' -- 'project/twee/*'  | myprint "missing ; before statement"

#git ls-files "project/twee/*" | xargs -d '\n'  ./dev/check.py


