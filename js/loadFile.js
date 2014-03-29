var JsonObj = null;

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    f = files[0];
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) { 
            JsonObj = e.target.result
            console.log(JsonObj);
            var parsedJSON = JSON.parse(JsonObj);
            console.log(parsedJSON);
        };
    })(f);

    // Read in JSON as a data URL.
    reader.readAsText(f, 'UTF-8');
}

function saveTextAsFile() {
    var blob = new Blob(["Hi"], {type:"text/plain"});
    var downloadLink = document.createElement("a");
    downloadLink.download = "test.txt";
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function destroyClickedElement(e) {
    document.body.removeChild(e.target);
}
