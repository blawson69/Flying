# Flying

> **New in v2.2:** TokenLocker has been updated to support the new [custom token markers](https://wiki.roll20.net/Custom_Token_Markers).

This  [Roll20](http://roll20.net/) script places one or more token markers on a selected token(s) to indicate a number of feet above ground that the token is "flying."

## Usage
With one or more tokens selected, enter `!fly` followed by the number of feet above ground that the token is "flying." For each digit in that number, a Flying Marker will appear with a badge for the digit on the token. For instance, if you enter `!fly 45` the selected token will get two Flying Markers, one with a 4 badge and one with a 5 badge. When the token "lands," you may pass a zero or nothing at all (just `!fly`) and the Flying Marker(s) will be removed.

## Configuration

`!fly-config` will display a Config Menu that give you the commands in the chat window and the currently set Flying Marker.

## Flying Marker

The Flying Marker is the token marker used to indicate Flying, and defaults to the "fluffy-wing" status marker. The GM can change the Flying Marker to any token marker desired. The Config Menu provides a "Choose Marker" button to display all token markers *including custom token markers* for easy selection, or you can use the "set manually" link to provide the name or name::ID combo for any valid token markers.

Note that because Flying updates status markers automatically, there could be conflict with scripts such as [EncumbranceTracker](https://github.com/blawson69/EncumbranceTracker), [ExhaustionTracker](https://github.com/blawson69/ExhaustionTracker), [CombatTracker](https://github.com/vicberg/Combattracker), and others and others that also modify token markers. If changing the Flying Marker, **make sure you choose a token marker that is not being used by another script.**
