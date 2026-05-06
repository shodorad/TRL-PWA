export const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry',           stylers: [{ color: '#0d0d14' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d0d14' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi',            stylers: [{ visibility: 'off' }] },
  { featureType: 'road',    elementType: 'geometry',           stylers: [{ color: '#1a1a24' }] },
  { featureType: 'road',    elementType: 'labels.text.fill',   stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry',      stylers: [{ color: '#242430' }] },
  { featureType: 'road.local',   elementType: 'labels',        stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water',   elementType: 'geometry',           stylers: [{ color: '#060d14' }] },
]
