# Flying

This  [Roll20](http://roll20.net/) script places one or more status icons on a selected token to indicate a number of feet above ground that the token is "flying."

## Usage
With a token selected, enter `!fly` followed by the number of feet above ground that the token is "flying." For each digit in that number, a Flying Marker will appear with a badge for the digit on the token. For instance, if you enter `!fly 45` the selected token will get two Flying Markers, one with a 4 badge and one with a 5 badge. When the token "lands," you may pass a zero or nothing at all (just `!fly`) and the Flying Marker(s) will be removed. Multiple tokens may be selected.

## Configuration

`!fly-config` will display a Config Menu that give you the commands in the chat window.

## Flying Marker

The default status marker for Flying is the "fluffy-wing" marker, but you may use another if you wish. Clicking the "Change Marker" button in the Config Menu will give a short list of suggested status markers to use and gives the option to input your own from the currently valid status markers.
