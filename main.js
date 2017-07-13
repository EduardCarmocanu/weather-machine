var app = new Vue({
	el: '#root',
	data: {
		weather: {
			location: {
				city: "",
				country: ""
			},
			temperature: {
				value: 0,
				system: "C"
			},
			description: {
				detailed: "",
				main: ""
			},
			wind: 0

		},
		error: {
			message: "",
			display: false
		},
		time: new Date
	},
	mounted: function () {
		if (navigator.geolocation) {
			var self = this;
			var gl = navigator.geolocation
			gl.getCurrentPosition(
				function (position) {
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function () {
						if (this.readyState == 4 && this.status == 200) {
							console.log("WEATHER INFORMATION RECIEVED!")

							data = JSON.parse(this.responseText);
							console.log(data);
							self.weather = {
								location: {
									city: data.name,
									country: data.sys.country
								},
								temperature: {
									value: data.main.temp - 273.15,
									system: "C"
								},
								description: {
									detailed: data.weather[0].description,
									main: data.weather[0].main
								},
								wind: data.wind.speed,
								visibility: data.visibility / 100,
								humidity: data.main.humidity
							}
						}
						else {
							console.log('Getting weather information...')
						}
					}

					xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=91c0593a3e34fe30a771a938642c18ef");
					xhr.send();
				}, 
				function (error) {
					self.error = {
						message: error.message,
						display: true
					}
					console.log(self.error.message);
				}
			);
		};
	},
	computed: {
		background: function () {
			return "./assets/" + this.weather.description.main + ".jpg";
		}
	},
	methods: {
		switchTempSystem: function () {
			switch(this.weather.temperature.system) {
				case "F":
					this.weather.temperature = {
						value: Math.round((this.weather.temperature.value - 32) / 1.8),
						system: "C"
					};
					break;
				case "C":
					this.weather.temperature = {
						value: Math.round((this.weather.temperature.value * 1.8) + 32),
						system: "F"
					}
					break;
				default: 
					console.log("Temperature error");
					break;
			}
		},
	}
})