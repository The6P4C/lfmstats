function parseStringTimestamp(timestampString) {
	return new Date(timestampString + "GMT+0000");
}

function dataTransform(csvData) {
	var data = [];

	for (var i = 0; i < csvData.length; ++i) {
		row = csvData[i];

		// An empty timestamp field means that the song was "Listening Now".
		// Easier to ignore it than to try to factor it in.
		if (row[3] == "") {
			continue;
		}

		data.push({
			artist: row[0],
			album: row[1],
			song: row[2],
			timestamp: parseStringTimestamp(row[3])
		});
	}

	return data;
}

$(document).ready(function() {
	$("#load-file").click(function() {
		var filesList = $("#file-uploader").prop("files");
		if (filesList.length == 1) {
			var file = filesList[0];
			var fileReader = new FileReader();

			fileReader.onload = function() {
				var csvFile = fileReader.result;
				var parsedCSV = Papa.parse(csvFile, {
						skipEmptyLines: true
				});
				var csvData = parsedCSV.data;

				var data = dataTransform(csvData);

				console.log(data);
			};

			fileReader.readAsText(file);
		}
	});
});
