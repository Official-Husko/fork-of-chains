## Adding Sex Actions

Creating entirely new sex actions is not encouraged. It is very time-consuming to do, and also adds to
code maintenance. The preferred way to add more sex content is by adding variations to existing sex actions instead.
For example, variation when a unit is equipped with draconic dick during blowjob.

However, if you feel you are up to the enormous task of adding entirely new sex actions, the following
describes the minimum prerequisites of what you need to do:

Sex Actions have to be added by editing the javascript files, and cannot be added using the content creator.
To begin, check out [balls focus](src/scripts/classes/sex/action/penis/mouth/PenisMouthDomBallsFocus.js) as
a simple and self-contained example.

In order to add a sex action into the game, you have to do all the following:

1. Create a new sex manual [here](project/twee/item/questitem/sexmanual.twee).

2. Create the sex action file, like cock slap above. Fill in the descriptions, tags, requirements
(in particular requiring the sex manual above), and so on until completed.

3. Create a quest that gives out the sex manual.
