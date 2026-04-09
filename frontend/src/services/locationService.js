import API from "../api";

const locationService = {
  getNearbyPlaces: (lat, lng, type) =>
    API.get(`/location/nearby?lat=${lat}&lng=${lng}&type=${type}`),
};

export default locationService;
