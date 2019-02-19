/*
Flying
A Roll20 script to indicate a flying token's number of feet above ground.

On Github:	https://github.com/blawson69
Contact me: https://app.roll20.net/users/1781274/ben-l
Like this script? Buy me a coffee: https://venmo.com/theBenLawson
*/

var Flying = Flying || (function() {
    'use strict';

    var version = '2.1',
        debugMode = false,
        styles = {
            box:  'background-color: #fff; border: 1px solid #000; padding: 8px 10px; border-radius: 6px; margin-left: -40px; margin-right: 0px;',
            title: 'padding: 0 0 10px 0; color: ##591209; font-size: 1.5em; font-weight: bold; font-variant: small-caps; font-family: "Times New Roman",Times,serif;',
            button: 'background-color: #000; border-width: 0px; border-radius: 5px; padding: 5px 8px; margin: 8px 0; color: #fff; text-align: center;',
            textButton: 'background-color: transparent; border: none; padding: 0; color: #591209; text-decoration: underline;',
            code: 'display: inline; font-family: "Courier New", Courier, monospace; background-color: #ddd; color: #000; padding: 1px 6px;',
        },

    checkInstall = function () {
        if (!_.has(state, 'Flying')) state['Flying'] = state['Flying'] || {};
        if (typeof state['Flying'].flyMarker == 'undefined') state['Flying'].flyMarker = 'fluffy-wing';
        log('--> Flying v' + version + ' <-- Initialized');
        if (debugMode) showDialog('Debug Mode', 'Flying has landed. Er, I mean loaded...');
    },

    handleInput = function(msg) {
		if (msg.type !== "api") {
			return;
		}

        var parms = msg.content.split(/\s+/i);
        switch (parms[0]) {
            case '!fly-config':
                if (playerIsGM(msg.playerid)) showConfig();
                break;
            case '!fly-markers':
                if (playerIsGM(msg.playerid)) showMarkers();
                break;
            case '!fly-set':
                if (playerIsGM(msg.playerid)) {
                    let marker = (parms[1]) ? parms[1] : '';
                    setMarker(marker);
                }
                break;
            case '!fly':
                if (!msg.selected) {
                    showDialog('', 'No tokens were selected!', msg.who);
                    break;
                }

                var msgparts = msg.content.split(/\s+/), height = 0;
                if (msgparts[1]) msgparts[1] = msgparts[1].replace(/[^\d]+/,'');
                if (msgparts[1] && msgparts[1] !== 0) height = parseInt(msgparts[1]);

                _.each(msg.selected, function(obj) {
                    var token = getObj(obj._type, obj._id);
                    if (token && token.get("type") === "graphic") {
                        token.set('status_' + state['Flying'].flyMarker, false);
                        if (height > 0) {
                            var oldMarkers = token.get("statusmarkers"), newMarkers = [];
                            var newHeight = height.toString().split(''); //.reverse();

                            _.each(newHeight, function(num) {
                                newMarkers.push(state['Flying'].flyMarker + '@' + num);
                            });

                            newMarkers = oldMarkers + ',' + newMarkers.join(',');
                            token.set({statusmarkers: newMarkers});
                        }
                    }
                });
        }
    },

    showConfig = function () {
        var marker_style = 'margin: 5px 10px 0 0; display: block; float: left;';
        var message = '<span style=\'' + styles.code + '\'>!fly &lt;number&gt;</span> sets the Flying Marker on the selected token(s) with a marker for every digit. '
        + 'Sending <span style=\'' + styles.code + '\'>!fly 45</span> will place a Flying Marker with a "4" and a Flying Marker with a "5" on the token.<br><br>'
        + 'A zero or a blank after <span style=\'' + styles.code + '\'>!fly</span> will "land" the token by removing all Flying Markers.<br><br>';

        message += '<h4>Flying Marker</h4>' + getMarker(state['Flying'].flyMarker, marker_style)
        + 'The current status marker to indicate a flying token is "' + state['Flying'].flyMarker + '".<br>';
        message += '<div align="center"><a style="' + styles.button + '" href="!fly-markers">Change Marker</a></div>';
        showDialog('Help Menu', message);
    },

    showMarkers = function () {
        var status_markers = ['blue', 'brown', 'green', 'pink', 'purple', 'yellow', 'fluffy-wing', 'angel-outfit'];
        var message = 'Note: Tokens with Flying Markers on them already will <b>not</b> be updated with the new marker.<br><table style="border: 0; width: 100%;" cellpadding="0" cellspacing="2">';
        _.each(status_markers, function(marker) {
            message += '<tr><td>' + getMarker(marker, 'margin-right: 10px;') + '</td><td style="white-space: nowrap; width: 100%;">' + marker + '</td>';
            if (marker == state['Flying'].flyMarker) {
                message += '<td style="text-align: center;">Current</td>';
            } else {
                message += '<td style="text-align: center; white-space: nowrap;"><a style="' + styles.button + '" href="!fly-set ' + marker + '">Set Marker</a></td>';
            }
            message += '</tr>';
        });
        message += '<tr><td colspan="3" style="text-align: center;"><a style="' + styles.button + '" href="!fly-config">&#9668; Back</a> &nbsp; <a style="'
        + styles.button + '" href="!fly-set &#63;&#123;Status Marker&#124;&#125;">Different Marker</a></td></tr>';
        message += '</table>';
        showDialog('Choose Flying Marker', message);
    },

    setMarker = function (marker) {
        var status_markers = ['blue', 'brown', 'green', 'pink', 'purple', 'red', 'yellow', 'all-for-one', 'angel-outfit', 'archery-target', 'arrowed', 'aura', 'back-pain', 'black-flag', 'bleeding-eye', 'bolt-shield', 'broken-heart', 'broken-shield', 'broken-skull', 'chained-heart', 'chemical-bolt', 'cobweb', 'dead', 'death-zone', 'drink-me', 'edge-crack', 'fishing-net', 'fist', 'fluffy-wing', 'flying-flag', 'frozen-orb', 'grab', 'grenade', 'half-haze', 'half-heart', 'interdiction', 'lightning-helix', 'ninja-mask', 'overdrive', 'padlock', 'pummeled', 'radioactive', 'rolling-bomb', 'screaming', 'sentry-gun', 'skull', 'sleepy', 'snail', 'spanner', 'stopwatch', 'strong', 'three-leaves', 'tread', 'trophy', 'white-tower'];
        if (_.find(status_markers, function (tmp) {return tmp === marker; })) {
            state['Flying'].flyMarker = marker;
        } else {
            showDialog('Error', 'The status marker "' + marker + '" is invalid. Please try again.');
        }
        showConfig();
    },

    getMarker = function (marker, style = '') {
        let X = '';
        let marker_style = 'width: 24px; height: 24px;';
        var marker_pos = {red:"#C91010",  blue: "#1076C9",  green: "#2FC910",  brown: "#C97310",  purple: "#9510C9",  pink: "#EB75E1",  yellow: "#E5EB75",  dead: "X",  skull: 0, sleepy: 34, "half-heart": 68, "half-haze": 102, interdiction: 136, snail: 170, "lightning-helix": 204, spanner: 238, "chained-heart": 272, "chemical-bolt": 306, "death-zone": 340, "drink-me": 374, "edge-crack": 408, "ninja-mask": 442, stopwatch: 476, "fishing-net": 510, overdrive: 544, strong: 578, fist: 612, padlock: 646, "three-leaves": 680, "fluffy-wing": 714, pummeled: 748, tread: 782, arrowed: 816, aura: 850, "back-pain": 884, "black-flag": 918, "bleeding-eye": 952, "bolt-shield": 986, "broken-heart": 1020, cobweb: 1054, "broken-shield": 1088, "flying-flag": 1122, radioactive: 1156, trophy: 1190, "broken-skull": 1224, "frozen-orb": 1258, "rolling-bomb": 1292, "white-tower": 1326, grab: 1360, screaming: 1394,  grenade: 1428,  "sentry-gun": 1462,  "all-for-one": 1496,  "angel-outfit": 1530,  "archery-target": 1564};

        if (typeof marker_pos[marker] === 'undefined') return false;

        if (Number.isInteger(marker_pos[marker])) {
            marker_style += 'background-image: url(https://roll20.net/images/statussheet.png);'
            + 'background-repeat: no-repeat; background-position: -' + marker_pos[marker] + 'px 0;';
        } else if (marker_pos[marker] === 'X') {
            marker_style += 'color: #C91010; font-size: 32px; font-weight: bold; text-align: center; padding-top: 5px; overflow: hidden;';
            X = 'X';
        } else {
            marker_style += 'background-color: ' + marker_pos[marker] + '; border: 1px solid #fff; border-radius: 50%;';
        }

        marker_style += style;

        return '<div style="' + marker_style + '">' + X + '</div>';
    },

    showDialog = function (title, content, whom = 'GM') {
        var whisperTo = '', gm = /\(GM\)/i;
        whisperTo = (gm.test(whom)) ? 'GM' : '"' + whom + '" ';

        title = (title == '') ? '' : '<div style=\'' + styles.title + '\'>' + title + '</div>';
        var body = '<div style=\'' + styles.box + '\'>' + title + '<div>' + content + '</div></div>';
        sendChat('Flying','/w GM ' + whisperTo + body, null, {noarchive:true});
    },

    registerEventHandlers = function() {
        on('chat:message', handleInput);
    };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };

}());

on("ready",function(){
    'use strict';
    Flying.CheckInstall();
    Flying.RegisterEventHandlers();
});
