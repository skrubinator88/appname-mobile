import config from "./config.json";

function Environment() {
    if (__DEV__) {
        console.log(" - - Running in Development Mode - - \n");
        return config["Development"];
    } else {
        console.log(" - - Running in Production Mode - - \n");
        return config["Production"];
    }
}

export default Environment();