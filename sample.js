let map = null;
let cebu_lat = 10.3157;
let cebu_lng = 123.8854;
var current_location;





function initMap(){
	let location = new Object();
	navigator.geolocation.getCurrentPosition(function(pos){
		// location.lat = pos.coords.latitude;
		// location.long = pos.coords.longitude;
		current_location = pos;
		location.lat = cebu_lat;
		location.long = cebu_lng;
		map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: location.lat, lng: location.long},
          zoom: 15
        });
        getRestaurantScope(location);


	});
}

function getRestaurantScope(location){
	var setLocation = new google.maps.LatLng(location.lat, location.long);
	var request = {
		location: setLocation,
		radius: '1800',
		type: ['restaurant']
	};

	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
}

function callback(results, status){
	if(status == google.maps.places.PlacesServiceStatus.OK){
		

		for (var i = 0; i <results.length; i++){
			// console.log(results);
			

			var place = results[i];
			let price = createPrice(place.price_level);
			let content = `<h3>Name: ${place.name}</h3> 
			<h4>Address: ${place.vicinity}</h4> 
			<div><button class="goHere${i}">Get Direction</button></div>
			 `;

			if(place.photos != "" && place.photos != null){
				let photoUrl = place.photos[0].getUrl({maxWidth: 200, maxHeight: 200});
			    // console.log(photoUrl);
			    content += '<img src="'+photoUrl+ '">';

			}


			var marker = new google.maps.Marker({
				position: place.geometry.location,
				map: map,
				title: place.name
			});

			var infowindow = new google.maps.InfoWindow({
				content: content
			});

			// console.log(place.place_id);
			bindInfoWindow(marker, map, infowindow, content, place.geometry.location);
			marker.setMap(map);

		}
		

	}

}

function bindInfoWindow(marker, map, infowindow, html, targetDesti){
	marker.addListener('click', function() {
		infowindow.setContent(html);
		infowindow.open(map, this);


		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay;
		directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setMap(map);

	
		var request = {
		  origin:new google.maps.LatLng(current_location.coords.latitude, current_location.coords.longitude),
		  destination:new google.maps.LatLng(targetDesti.lat(), targetDesti.lng()),
		  travelMode: google.maps.TravelMode.DRIVING
		};

		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			}
		});

	});


}

function createPrice(level){
	if(level != "" && level != null){
		let out = '';
		for (var i = 0; i < level; i++) {
			out += "$";
		}
		return out;

	}else{
		return "?";

	}
}