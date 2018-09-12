# Flying

This  [Roll20](http://roll20.net/) script places one or more status icons on a selected token to indicate a number of feet above ground that the token is "flying."

### Usage
With a token selected, enter `!fly` followed by the number of feet above ground that the token is "flying." For each digit in that number, a fluffy-wing status marker will appear with a badge for the digit on the token. For instance, if you enter `!fly 45` the selected token will get two fluffy-wing markers, one with a 4 badge and one with a 5 badge. When the token "lands," you may pass a zero or nothing at all and the status marker(s) will be removed. Multiple tokens may be selected.

### Customization

You may use a status marker other than 'fluffy-wing' if you wish. Just choose one of the status marker names from the list in the [API documentation](https://wiki.roll20.net/API:Objects#Graphic_.28Token.2FMap.2FCard.2FEtc..29) and change the `flyMarker` variable at the top of the script to the name of desired marker.
