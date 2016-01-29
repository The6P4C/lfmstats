$(document).ready(function() {
	$("#load-file").click(function() {
		filesList = $("#file-uploader").prop("files");
		if (filesList.length == 1) {
			file = filesList[0];
			fileReader = new FileReader();

			fileReader.onload = function() {
				csvFile = fileReader.result;
				csvData = Papa.parse(csvFile);

				console.log(csvData);
			};

			fileReader.readAsText(file);
		}
	});
});
