# FLEET

An Adonisjs application to track incoming GPS data.

Check this short video here https://youtu.be/4rqEqM_nVKE

## How to

The app accepts the following

```
curl -X POST \
  http://localhost:3333/api/v1/report/ \
  -H 'accept: application/json' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
  "active": true,
  "plate": "VEHICLE PLATE",
  "lat": LATITUDE,
  "lon": LONGITUDE,
  "accuracy": 20.0,
  "altitude": 38.5,
  "altitudeAccuracy": 9.0,
  "heading": 90.0,
  "speed": 15.0,
  "reportedAt": "2017-11-02 21:46:21",
  "info": "STATUS TEXT"
}
```

## Stack

* Nodejs - https://nodejs.org/en/
* Adonisjs - http://adonisjs.com/
* Vuejs - https://vuejs.org/
* Bulma - https://bulma.io/
