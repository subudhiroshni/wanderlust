console.log(rawCoordinates);
const coordinates = JSON.parse(rawCoordinates); // ✅ Convert string to array

console.log("📍 Coordinates parsed:", coordinates);
console.log("✅ Type:", typeof coordinates);
console.log("✅ Is Array:", Array.isArray(coordinates));

maplibregl.accessToken = mapToken;
const map = new maplibregl.Map({
  container: 'map', 
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`,
  center: coordinates, 
  zoom: 9,

});

// map.on('style.load', () => {
//     map.setFog({}); // Default fog for atmospheric effect
// });
map.addControl(new maplibregl.NavigationControl(), 'top-right');

const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`<h5>${placeName}</h5><p>Exact Location provided after booking</p>`);
if (Array.isArray(coordinates) && coordinates.length === 2) {
  new maplibregl.Marker({ color: "black" })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);
} else {
  console.error("❌ Still invalid coordinates:", coordinates);
}