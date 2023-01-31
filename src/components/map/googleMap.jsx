import React from "react";
import GoogleMapReact from "google-map-react";

const GoogleMap = ({ children, ...props }) => (
  <GoogleMapReact
    bootstrapURLKeys={{
      key: process.env.REACT_APP_MAP_KEY,
    }}
    {...props}
  >
    {children}
  </GoogleMapReact>
);

export default GoogleMap;
