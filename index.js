var statistics = [
	// Listening by day
	function(data) {
		var chartData = [0, 0, 0, 0, 0, 0, 0];
		for (var i = 0; i < data.length; ++i) {
			var row = data[i];

			++chartData[row.timestamp.getDay()];
		}

		chartData.push(chartData.shift());

		var ctx = $("#chart-byDay").get(0).getContext("2d");
		var chart = new Chart(ctx).Bar({
			labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			datasets: [
				{
					data: chartData
				}
			]
		});
	},

	function(data) {
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

		var ctx = $("#chart-byHour").get(0).getContext("2d");
		var chart = new Chart(ctx).Bar({
			labels: labels,
			datasets: [
				{
					data: chartData
				}
			]
		});
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
				$("#stats").show();

				for (var i = 0; i < statistics.length; ++i) {
					statistics[i](data);
				}
			};

			fileReader.readAsText(file);
		}
	});
});
