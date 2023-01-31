import toastService from "../services/toastService";
import authService from "../services/authService";
import prviderLocationservice from "../services/providerLoctionServices";

async function AddLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let data = {
        userId: authService.getCurrentUser()[0]._id,
        location: [
          {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          },
        ],
      };
      try {
        let response = await prviderLocationservice.addProviderLocation(data);
        console.log(response);
      } catch (ex) {
        toastService.error(ex.message);
      }
    });
  }
}

export default {
  AddLocation,
};
