// Dependencies
import Pusher from "pusher-js/react-native";
import axios from "axios";

// Config
import config from "../env";
const pusher = new Pusher(`${config.PUSHER.API_KEY}`, { cluster: config.PUSHER.CLUSTER });

// Functions
import { distanceBetweenUserAndJob } from "../functions/";

// Memory
let jobsPostingsArray = [];

exports.getJobs = async (params, saveJobsInActualComponent, setError) => {
  if (!params.max_distance) params.max_distance = 10;
  try {
    // Get and register jobs
    const { data } = await axios.get(`${config.API_URL}/jobs/nearby`, {
      params,
    });
    const jobs = data;

    if (jobs?.ok == 0) return; // Failed to fetch
    jobsPostingsArray = jobs;
    saveJobsInActualComponent(jobs);
  } catch (e) {
    setError(e.message);
  }
};

exports.getJobsAndSubscribeJobsChannel = async (state) => {
  const { location, setLocation } = state;
  const { setChannel } = state;
  const { setJobPostings } = state;
  const { setError } = state;

  if (location != null) {
    const { latitude, longitude } = location.coords;

    try {
      module.exports.getJobs({ lat: latitude, lng: longitude }, setJobPostings, setError);

      // Fetch state from given location coordinates
      const google_geolocation_api_base_url = "https://maps.googleapis.com/maps/api/geocode/json"; // Google Geolocation API
      const params_geolocation = { address: `${latitude},${longitude}`, key: config.GOOGLE.GEOLOCATION_KEY };
      const { data: address_info } = await axios.get(`${google_geolocation_api_base_url}`, { params: params_geolocation });
      const address_components = address_info.results[0].address_components; // Component Example Street Name & State
      const filter_data = address_components.filter((el) => el.types.filter((val) => val == "administrative_area_level_1").length != 0); // Search for State only
      const state = filter_data[0].short_name;

      // Subscribe to websocket
      const currentChannel = pusher.subscribe(`jobs-${state}`);
      setChannel(currentChannel);

      currentChannel.bind("job-created", function (data) {
        // User location
        const x1 = location.coords.latitude; // Not an important note: 33
        const y1 = location.coords.longitude; // Not an important note: -84
        // Job Location
        const x2 = data.location.coordinates[1]; // latitude // Not an important note: 33
        const y2 = data.location.coordinates[0]; // longitude // Not an important note: -84
        const miles = 10;
        const maxDistanceInMeters = miles * 1609.344;
        if (distanceBetweenUserAndJob(x1, y1, x2, y2) < maxDistanceInMeters) {
          jobsPostingsArray.push(data);
          const sanitizedJobs = jobsPostingsArray.filter((item, pos) => jobsPostingsArray.indexOf(item) == pos);
          setJobPostings(sanitizedJobs);
        }
      });
    } catch (e) {
      setError(e.message);
    }
  }
};

exports.getJobTagType = (imageType) => {
  switch (imageType) {
    case "user":
      return require("../assets/user-icon.png");
      break;
  }
};
