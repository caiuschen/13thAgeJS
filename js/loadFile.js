var characterBuilder = {};
characterBuilder.character = {};

characterBuilder.validateCharacter = function validateCharacter(someCharacter) { };

characterBuilder.loadCharacter = function loadCharacter(evt) {
    var files = evt.target.files; // FileList object
    f = files[0];
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) { 
            var jsonObj = e.target.result
            var parsedJSON = JSON.parse(jsonObj);
            characterBuilder.validateCharacter(parsedJSON);
            characterBuilder.character = parsedJSON;
        };
    })(f);

    // Read in JSON as a data URL.
    reader.readAsText(f, 'UTF-8');
};

characterBuilder.saveCharacter = function saveCharacter() {
    var destroyClickedElement = function destroyClickedElement(e) {
        document.body.removeChild(e.target);
    };
    var characterInStringForm = JSON.stringify(characterBuilder.character);
    var blob = new Blob([characterInStringForm], {type:"text/plain"});
    var downloadLink = document.createElement("a");
    downloadLink.download = "test.txt";
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

