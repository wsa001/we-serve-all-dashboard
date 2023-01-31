import Marker from "./marker";
import GoogleMap from "./googleMap";

const Map = (location) => {
  // const getlocation = async ({ userId }) => {
  //   console.log(userId);
  //   let result = await providerLocation.(userId);
  //   if (result) {
  //     setlon(result.data.data.location[0].location[0].longitude);
  //     setlat(result.data.data.location[0].location[0].latitude);
  //     console.log(lon, lat);
  //   }
  //   getlocation()
  // };

  console.log(location.location[0].longitude);
  return (
    <GoogleMap
      defaultCenter={{
        lat: location.location[0].latitude,
        lng: location.location[0].longitude,
      }}
      defaultZoom={15}
      center={{
        lat: location.location[0].latitude,
        lng: location.location[0].longitude,
      }}
    >
      <Marker
        key={"1"}
        text={"name"}
        lat={location.location[0].latitude}
        lng={location.location[0].longitude}
      />
    </GoogleMap>
  );
};

export default Map;
