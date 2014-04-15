var characterBuilderApp = angular.module('characterBuilderApp', []);
 
characterBuilderApp.controller('CharacterBuilderCtrl', function ($scope, $http) {
    $http.get('json/classes.json').success(function(data) {
        $scope.classes = data;
    });

    $scope.debugContent = "";

    $scope.character = {
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

    $scope.saveCharacter = function saveCharacter() {
        var destroyClickedElement = function destroyClickedElement(e) {
            document.body.removeChild(e.target);
        };
        var characterInStringForm = JSON.stringify(this.character);
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


    $scope.loadCharacter = function loadCharacter(evt) {
        var validateCharacter = function _validateCharacter(someCharacter) { };
        var files = evt.target.files; // FileList object
        f = files[0];
        var reader = new FileReader();
    
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) { 
                var jsonObj = e.target.result
                var parsedJSON = JSON.parse(jsonObj);
                validateCharacter(parsedJSON);
                $scope.character = parsedJSON;
                $scope.outputToDebugSection(JSON.stringify(parsedJSON));
            };
        })(f);
    
        // Read in JSON as a data URL.
        reader.readAsText(f, 'UTF-8');
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

