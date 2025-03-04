let tempGauge, heartRateGauge, spo2Gauge, map, marker;

document.addEventListener('DOMContentLoaded', () => {
  tempGauge = new JustGage({
    id: 'tempGauge',
    value: 0,
    min: -20,
    max: 50,
    title: 'Temperature (°C)',
    label: '°C'
  });
  heartRateGauge = new JustGage({
    id: 'heartRateGauge',
    value: 0,
    min: 0,
    max: 200,
    title: 'Heart Rate',
    label: 'BPM'
  });
  spo2Gauge = new JustGage({
    id: 'spo2Gauge',
    value: 0,
    min: 0,
    max: 100,
    title: 'SpO2',
    label: '%'
  });

  // Initialize map with a default view (e.g., India)
  map = L.map('map').setView([20.5937, 78.9629], 5); // India center
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  marker = L.marker([20.5937, 78.9629]).addTo(map);

  // Fetch data and update
  fetchData();
  setInterval(fetchData, 2000); // Update gauges every 2 seconds
  setInterval(updateMap, 60000); // Update map every 1 minute

  // Restart map button
  document.getElementById('restartMap').addEventListener('click', updateMap);
});

function fetchData() {
  fetch('/data')
    .then(response => response.json())
    .then(data => {
      // Handle N/A values
      const temp = data.temperature === "N/A" ? 0 : parseFloat(data.temperature);
      const heartRate = data.heartRate === "N/A" ? 0 : parseFloat(data.heartRate);
      const spo2 = data.spo2 === "N/A" ? 0 : parseFloat(data.spo2);
      const fallStatus = data.fallDetected === "true" ? "Yes" : "No";
      const satellites = data.satellites === "N/A" ? "N/A" : data.satellites;

      tempGauge.refresh(temp);
      heartRateGauge.refresh(heartRate);
      spo2Gauge.refresh(spo2);
      document.getElementById('fallStatus').textContent = fallStatus;
      document.getElementById('satellites').textContent = satellites;
    })
    .catch(error => console.error('Error fetching data:', error));
}

function updateMap() {
  fetch('/data')
    .then(response => response.json())
    .then(data => {
      if (data.latitude !== "N/A" && data.longitude !== "N/A") {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        map.setView([lat, lng], 13);
        marker.setLatLng([lat, lng]);
      } else {
        console.log("No valid GPS data available.");
      }
    })
    .catch(error => console.error('Error updating map:', error));
}