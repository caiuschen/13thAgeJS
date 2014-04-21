var characterBuilderApp = angular.module('characterBuilderApp', []);
 
characterBuilderApp.controller('CharacterBuilderCtrl', function ($scope, $http) {
    $http.get('json/classes.json').success(function(data) {
        $scope.classes = data;
    });

    $http.get('json/races.json').success(function(data) {
        $scope.races = data;
    });

    $scope.currentContentPane = "race";

    $scope.setCurrentContentPane = function setCurrentContentPane(name) {
        $scope.currentContentPane = name;
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

