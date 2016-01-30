var GENERATORS = [
	{
		genData: function(data) {
			var chartData = [0, 0, 0, 0, 0, 0, 0];
			for (var i = 0; i < data.length; ++i) {
				var row = data[i];

				++chartData[row.timestamp.getDay()];
			}

			// The JS date object thinks Sunday = 0
			// This puts Sunday at the end to get a more natural Mon-Sun order
			chartData.push(chartData.shift());

			return {
				datasets: [
					{
						data: chartData
					}
				],
				labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
			};
		},
		id: "chart-day",
		type: "bar"
	},

	{
		genData: function(data) {
			var chartData = [];
			var labels = [];

			for (var i = 0; i < 24; ++i) {
				chartData.push(0);
				var paddedHr = i < 10 ? "0" + i : i;
				labels.push(paddedHr + ":00");
			}

			for (var i = 0; i < data.length; ++i) {
				var row = data[i];

				++chartData[row.timestamp.getHours()];
			}

			return {
				datasets: [
					{
						data: chartData
					}
				],
				labels: labels
			};
		},
		id: "chart-hour",
		type: "bar"
	}
];

function parseStringTimestamp(timestampString) {
	return new Date(timestampString + " GMT+0000");
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

function displayData(data) {
	for (var i = 0; i < GENERATORS.length; ++i) {
		var generator = GENERATORS[i];
		var chartValues = generator.genData(data);

		var ctx = $("#" + generator.id).get(0).getContext("2d");
		var chartIntermediate = new Chart(ctx);

		switch (generator.type) {
			case "bar":
				chart = chartIntermediate.Bar({
					labels: chartValues.labels,
					datasets: chartValues.datasets
				})
				break;
		}
	}
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

				$("#load-file-section").hide();
				$("#new-file-advice").show();
				$("#stats").show();

				displayData(data);
			};

			fileReader.readAsText(file);
		} else {
			alert("You need to select a file.");
		}
	});
});
