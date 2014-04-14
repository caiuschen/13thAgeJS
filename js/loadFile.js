var characterBuilder = {};
characterBuilder.character = {
    characterName : "No character name",
    playerName : "No player name",
    oneUniqueThing : "No one unique thing",
    level : 1,
    baseAbilities : {
        strength : 8,
        constitution : 8,
        dexterity : 8,
        intelligence : 8,
        wisdom : 8,
        charisma : 8
    },
    classSelection : {
        name : "No class selected",
        chosenAbilityAdjustments : [],
        classTalentSelections : []
    },
    raceSelection : {
        name : "No race selected",
        chosenAbilityAdjustment : null,
        powerSelection : null
    },
    powerSelections : [],
    armorLevel : "light",
    hasShield : false
};

characterBuilder._validateCharacter = function _validateCharacter(someCharacter) { };

characterBuilder.loadCharacter = function loadCharacter(evt) {
    var files = evt.target.files; // FileList object
    f = files[0];
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) { 
            var jsonObj = e.target.result
            var parsedJSON = JSON.parse(jsonObj);
            characterBuilder._validateCharacter(parsedJSON);
            characterBuilder.character = parsedJSON;
            characterBuilder.outputToDebugSection(JSON.stringify(parsedJSON));
        };
    })(f);

    // Read in JSON as a data URL.
    reader.readAsText(f, 'UTF-8');
};

characterBuilder.outputToDebugSection = function outputToDebugSection(text) {
    var debugSection = document.getElementById("debugOutput");
    debugSection.innerHTML = text;
};


