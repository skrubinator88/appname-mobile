# CONFIG & ENVIRONMENT FILE

## Development

SETTINGS (Contains the settings for the app):

```
PROJECT_MANAGER:
   LIMIT_ONLINE: Number // Limits how many deployees can be online.

   ACTION_RESPONSES_TIME: Number // In seconds, how long the countdown will last until deployee take an action.

   JOB_LISTINGS_LIMITS: Number  // Limits how many active jobs a deployee will have.

CONTRACTOR:
   LIMIT_ONLINE: Number // Limits how many deployers can be online.

   ACTION_RESPONSES_TIME: Number // In seconds, how long the countdown will last until deployers take an action.

OTHERS:
   JOB_CIRCLE_RATIO: Number // In meters, the radio of the circle of the area of where the job is located.
```

COMPLETE EXAMPLE:

```
Development:
  SETTINGS:
    PROJECT_MANAGER:
      LIMIT_ONLINE: 100
      ACTION_RESPONSE_TIME: 120
      JOB_LISTINGS_LIMIT: 10

    CONTRACTOR:
      LIMIT_ONLINE: 500
      ACTION_RESPONSE_TIME: 15

    OTHERS:
      JOB_CIRCLE_RATIO: 250

  # Point IP to Dev server (Locally: 10.0.2.2:3001/v1 or External: 192.169.0.{XXXX}:3001/v1)
  API_URL_AVD: http://10.0.2.2:3001/v1 # AVD Android Emulator Local Server (Leave 10.0.2.2 if you are running Android AVD Emulator)

  COUNTRY_CODE: "+1"

  API_URL: http://172.16.0.96:3001/v1

  GOOGLE:
    GEOLOCATION_KEY: AIzaSyB8xVAMRa2hoq8lRXEG1wXG3v2yR1KkHsQ
    PLACES_URI: https://maps.googleapis.com/maps/api/place

  STRIPE:
    PUBLIC_KEY: pk_test_51He7zlL5334OlXzIlbQEJFcI254w2YQ6kVrZGnZqbFbGHStEoaxMBlxapPh9HsUfYDrgfO7jyukT3kzJC9Wt0SA800k3BQXTmj
```
