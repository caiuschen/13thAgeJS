var characterBuilderApp = angular.module('characterBuilderApp', []);
 
characterBuilderApp.controller('CharacterBuilderCtrl', function ($scope, $http) {
    $http.get('json/classes.json').success(function(data) {
        $scope.classes = data;
    });

    $http.get('json/races.json').success(function(data) {
        $scope.races = data;
        var tmp = {};
        for (index in data) {
           tmp[data[index].name] = data[index];
        }
        $scope.raceMap = tmp;
    });

    $scope.currentContentPane = "race";

    $scope.setCurrentContentPane = function setCurrentContentPane(name) {
        $scope.currentContentPane = name;
    };

    $scope.abilityScoreOptions = [8,9,10,11,12,13,14,15,16,17,18];

    $scope.abilityScoreCosts = {
         8 :  0,
         9 :  1,
        10 :  2,
        11 :  3,
        12 :  4,
        13 :  5,
        14 :  6,
        15 :  8,
        16 : 10,
        17 : 13,
        18 : 16 
    };

    $scope._calculateAbilityModifier = function calculateAbilityModifier(score) {
        return Math.floor((score - 10)/2.0);
    };

    $scope.abilityPointsRemaining = function abilityPointsRemaining() {
        var remainingPoints = 28;
        remainingPoints -= $scope.abilityScoreCosts[$scope.character.baseAbilities.strength];
        remainingPoints -= $scope.abilityScoreCosts[$scope.character.baseAbilities.constitution];
        remainingPoints -= $scope.abilityScoreCosts[$scope.character.baseAbilities.dexterity];
        remainingPoints -= $scope.abilityScoreCosts[$scope.character.baseAbilities.intelligence];
        remainingPoints -= $scope.abilityScoreCosts[$scope.character.baseAbilities.wisdom];
        remainingPoints -= $scope.abilityScoreCosts[$scope.character.baseAbilities.charisma];
        return remainingPoints;
    };

    $scope._calculateMedianBonus = function _calculateMedianBonus(arrayOfAbilityScores) {
        return $scope._calculateAbilityModifier(median(arrayOfAbilityScores));
    };

    $scope.acBonusFromAbilities = function acBonusFromAbilities() {
        return $scope._calculateMedianBonus([
            $scope.character.baseAbilities.constitution,
            $scope.character.baseAbilities.dexterity,
            $scope.character.baseAbilities.wisdom
        ]);
    };

    $scope.pdBonusFromAbilities = function pdBonusFromAbilities() {
        return $scope._calculateMedianBonus([
            $scope.character.baseAbilities.constitution,
            $scope.character.baseAbilities.dexterity,
            $scope.character.baseAbilities.strength
        ]);
    };

    $scope.mdBonusFromAbilities = function mdBonusFromAbilities() {
        return $scope._calculateMedianBonus([
            $scope.character.baseAbilities.intelligence,
            $scope.character.baseAbilities.wisdom,
            $scope.character.baseAbilities.charisma
        ]);
    };

    $scope.debugContent = "";

    $scope.character = {
        characterName : "",
        playerName : "",
        oneUniqueThing : "",
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
            name : "Unselected",
            chosenAbilityAdjustments : [],
            classTalentSelections : []
        },
        raceSelection : {
            name : "Unselected",
            chosenAbilityAdjustment : null,
            powerSelection : null
        },
        powerSelections : [],
        armorLevel : "light",
        hasShield : false
    };

    $scope.characterToString = function characterToString() {
        return JSON.stringify($scope.character, null /*replacerFn*/, 4 /*indent*/);
    }

    $scope.saveCharacter = function saveCharacter() {
        $scope.debug($scope.character);
        // There's a bit of oddity where we need to add an actual link to save
        // the file, but since we don't need the link we destroy it immediately
        // afterwards.
        var destroyClickedElement = function destroyClickedElement(e) {
            document.body.removeChild(e.target);
        };
        var characterInStringForm = JSON.stringify($scope.character, null /* replacerFn */, 4 /*indent*/);
        var blob = new Blob([characterInStringForm], {type:"text/plain"});
        var downloadLink = document.createElement("a");
        downloadLink.download = "character.txt";
        downloadLink.innerHTML = "Download File";
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    $scope.loadCharacter = function loadCharacter(fileContent) {
        var validateCharacter = function _validateCharacter(someCharacter) { };
        var parsedJSON = JSON.parse(fileContent);
        validateCharacter(parsedJSON);
        $scope.character = parsedJSON;
    };

    $scope.debug = function debug(text) {
        $scope.debugContent = text;
    };
});

// Much of this I don't understand yet.  http://jsfiddle.net/alexsuch/6aG4x/
// http://veamospues.wordpress.com/2014/01/27/reading-files-with-angularjs/
characterBuilderApp.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();
                
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});

function median(values) {
    values.sort( function(a,b) {return a - b; } );
    var half = Math.floor(values.length/2);
    if (values.length % 2) {
        return values[half];
    } else {
        return (values[half-1] + values[half]) / 2.0;
    }
}
