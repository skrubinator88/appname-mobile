import firebase from "firebase";

exports.distanceBetweenTwoCoordinates = (lat1, lon1, lat2, lon2, unit = "miles") => {
  // generally used geo measurement function
  let radius = 6378.137; // Radius of earth in KM
  let distanceLatitude = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  let distanceLongitude = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  let a =
    Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(distanceLongitude / 2) * Math.sin(distanceLongitude / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = radius * c;
  const units = { miles: 1, meters: 1000 };
  return distance * units[unit]; // Miles
};

/**
 * This checks if the job is scheduled to start earlier than now, else it does not add the job.
 * 
 * It assumes the job provided is a valid job and if the required attribute is absent, the job is assumed as present.
 * 
 * @author eikcalb
 */
exports.isCurrentJob = (job) => {
  if (!job) {
    return false
  }
  if (job.start_at && job.start_at > Date.now()) {
    return false
  }
  return true
}

exports.getActualDateFormatted = (date) => {
  const month_names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month_names[month]} ${day}, ${year} - ${date.toLocaleDateString()}`;
};

exports.convertFirestoreTimestamp = (date) => {
  return date.toDate().toLocaleTimeString().replace(/:\d+ /, " ");
};

// Use UUID Instead
exports.createToken = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

exports.sortJobsByProximity = (arr, compare) =>
  arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => compare(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);