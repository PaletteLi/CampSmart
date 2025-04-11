// Map the locations to areas (simplified for demo)
export const getAreaForLocation = (lat, lng) => {
  if (lat > 37.78 && lng > -122.42) return "Downtown";
  if (lat > 37.78) return "North";
  if (lat < 37.76) return "South";
  if (lng < -122.45) return "West";
  return "East";
};
