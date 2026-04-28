const places = {
  home: {
    name: "Home",
    lat: 38.92542,
    lon: -77.07287
  },
  school: {
    name: "School",
    lat: 38.93921,
    lon: -77.08724
  },
  work: {
    name: "Work",
    lat: 38.93283,
    lon: -77.08521
  }
};

const streetLabels = [
  {
    name: "Massachusetts Ave NW",
    lat: 38.9333,
    lon: -77.0782,
    angle: 45
  },
  {
    name: "Wisconsin Ave NW",
    lat: 38.93,
    lon: -77.0723,
    angle: -270
  },
  {
    name: "Fulton St NW",
    lat: 38.9268,
    lon: -77.0774,
    angle: 0
  },
  {
    name: "New Mexico Ave NW",
    lat: 38.9302,
    lon: -77.086,
    angle: 70
  },
  {
    name: "Nebraska Ave NW",
    lat: 38.935,
    lon: -77.091,
    angle: -40
  },
];

const routes = [
  {
    name: "Home to School",
    measureField: "TOMEASURE",
    routeIDs: [11094052, 11090702, 11059602],
    points: [
      places.home,
      { lat: 38.9286, lon: -77.0730 },
      { lat: 38.93, lon: -77.0750 },
      { lat: 38.932, lon: -77.0775 },
      { lat: 38.9335, lon: -77.0795 },
      { lat: 38.9353, lon: -77.0820 },
      { lat: 38.9368, lon: -77.0840 },
      { lat: 38.9388, lon: -77.0860 },
      places.school
    ]
  },

  {
    name: "School to Home",
    measureField: "FROMMEASURE",
    routeIDs: [11059602, 11090702, 11094052],
    points: [
      places.school,
      { lat: 38.9388, lon: -77.0860 },
      { lat: 38.9368, lon: -77.0840 },
      { lat: 38.9353, lon: -77.0820 },
      { lat: 38.9335, lon: -77.0795 },
      { lat: 38.932, lon: -77.0775 },
      { lat: 38.93, lon: -77.0750 },
      { lat: 38.9286, lon: -77.0730 },
      places.home
    ]
  },

  {
    name: "Home to Work",
    measureField: "TOMEASURE",
    routeIDs: [11094052, 11038412, 11064412],
    points: [
      places.home,
      { lat: 38.9262, lon: -77.0740 },
      { lat: 38.9262, lon: -77.0770 },
      { lat: 38.9258, lon: -77.0795 },
      { lat: 38.9258, lon: -77.081 },
      { lat: 38.927, lon: -77.0820 },
      places.work
    ]
  },

  {
    name: "Work to Home",
    measureField: "FROMMEASURE",
    routeIDs: [11064412, 11038412, 11094052],
    points: [
      places.work,
      { lat: 38.927, lon: -77.0820 },
      { lat: 38.9258, lon: -77.081 },
      { lat: 38.9258, lon: -77.0795 },
      { lat: 38.9262, lon: -77.0770 },
      { lat: 38.9262, lon: -77.0740 },
      places.home
    ]
  },

  {
    name: "Work to School",
    measureField: "TOMEASURE",
    routeIDs: [11064412, 11059602],
    points: [
      places.work,
      { lat: 38.9339, lon: -77.086 },
      { lat: 38.935, lon: -77.0865 },
      { lat: 38.9355, lon: -77.0877 },
      { lat: 38.9368, lon: -77.0866 },
      { lat: 38.938, lon: -77.0865 },
      { lat: 38.9383, lon: -77.0865 },
      places.school
    ]
  },

  {
    name: "School to Work",
    measureField: "FROMMEASURE",
    routeIDs: [11059602, 11064412],
    points: [
      places.school,
      { lat: 38.9383, lon: -77.0865 },
      { lat: 38.938, lon: -77.0865 },
      { lat: 38.9368, lon: -77.0866 },
      { lat: 38.9355, lon: -77.0877 },
      { lat: 38.935, lon: -77.0865 },
      { lat: 38.9339, lon: -77.086 },
      places.work
    ]
  }
];

const hourlyPattern = [
  { hour: "12 AM", factor: 0.01815 },
  { hour: "1 AM", factor: 0.01172 },
  { hour: "2 AM", factor: 0.00994 },
  { hour: "3 AM", factor: 0.01027 },
  { hour: "4 AM", factor: 0.01385 },
  { hour: "5 AM", factor: 0.02924 },
  { hour: "6 AM", factor: 0.04179 },
  { hour: "7 AM", factor: 0.05006 },
  { hour: "8 AM", factor: 0.05286 },
  { hour: "9 AM", factor: 0.05111 },
  { hour: "10 AM", factor: 0.05105 },
  { hour: "11 AM", factor: 0.05106 },
  { hour: "12 PM", factor: 0.05450 },
  { hour: "1 PM", factor: 0.05747 },
  { hour: "2 PM", factor: 0.06184 },
  { hour: "3 PM", factor: 0.06245 },
  { hour: "4 PM", factor: 0.06124 },
  { hour: "5 PM", factor: 0.06063 },
  { hour: "6 PM", factor: 0.05889 },
  { hour: "7 PM", factor: 0.04979 },
  { hour: "8 PM", factor: 0.04296 },
  { hour: "9 PM", factor: 0.03750 },
  { hour: "10 PM", factor: 0.03393 },
  { hour: "11 PM", factor: 0.02771 }
];