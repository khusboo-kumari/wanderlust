//   Script code of mapbox
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: listing.geometry.coordinates, // starting position [lng, lat], setting coordinates of  ROORKEE by default by myself hihihihihi
  zoom: 9, // starting zoom
});


// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color:"red"})
  .setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates
 
  //  inserting  marker POPUP function here 
   .setPopup(new mapboxgl.Popup({offset: 25})
   .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking!</p>`))    

  .addTo(map); 

  //  We can also create multiple marker  .... if  you want 
 
