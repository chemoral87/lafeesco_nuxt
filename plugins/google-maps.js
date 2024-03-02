// plugins/google-maps.js

export default ({ app }, inject) => {
  // Load the Google Maps API
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_KEY}&libraries=places`;
  script.defer = true;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    // Initialize and inject the AutocompleteService
    // const autocompleteService = new google.maps.places.AutocompleteService();
    // inject("autocompleteService", autocompleteService);
  };
};
