

var map;

document.addEventListener("DOMContentLoaded", function(event) {
	confirm("Bienvenido al GPS del ESP32");
	siHayExito();	
  });


const apiKey = 'XZ00KAL6OCY08OMR';
const channelId = '2175812';
const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}`;

function siHayExito(){
	/*var latitud = posicion.coords.latitude
	var longitud = posicion.coords.longitude*/
	map = L.map('map').setView([21.88234, -102.28259],13);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	maxZoom: 23
	}).addTo(map);
	L.control.scale().addTo(map);
}

function w3_open() {
	document.getElementById("sidebar").style.display = "block";
  }
  
  function w3_close() {
	document.getElementById("sidebar").style.display = "none";
  }


  function getNewData() {
	var latlngs = [];
	fetch(apiUrl)
	  .then(response => response.json())
	  .then(data => {
		const feeds = data.feeds;
		const dataList = document.getElementById('database');

		const lastItemIndex = dataList.childElementCount - 1;

		if (lastItemIndex < 0 || feeds[lastItemIndex].entry_id !== dataList.lastChild.dataset.entryId) {
		  for (let i = lastItemIndex + 1; i < feeds.length; i++) {
			const feed = feeds[i];
			const listItem = document.createElement('button');
			listItem.dataset.entryId = feed.entry_id;
			listItem.textContent = `${i} Lattitude: ${feed.field1}\t Longitude: ${feed.field2}\t Elevation: ${feed.field3}\t Hours: ${feed.field4}\t Minutes: ${feed.field5}\t Seconds: ${feed.field6}`;
			dataList.appendChild(listItem);
			latlngs.push([feed.field1, feed.field2])
		  }
		}
		
		var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
		latlngs.forEach(element => L.circleMarker(element, {title: latlngs.indexOf(element).toString()}).addTo(map));
								//circleMarker
		// zoom the map to the polyline
		L.marker(latlngs[latlngs.length-1], {title: "Actual Position"}).addTo(map);
		map.fitBounds(polyline.getBounds());

	  })
	  .catch(error => {
		console.error('Error al leer datos de ThingSpeak:', error);
	  });
  }

  setInterval(getNewData, 5000);