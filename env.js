import config from "./config.json";

function Environment() {
  if (__DEV__) {
    console.log("Development");
    return config["Development"];
  } else {
    console.log("Production");
    return config["Production"];
  }
}

export default Environment();
