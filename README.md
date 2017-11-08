# Where Can I Vote?
![Example image](https://i.imgur.com/Lm64hPT.png)

This was a simple project created during the RIT Election Night Hackathon 2017. It's goal was to provide a straight-forward,
no frills way of allowing people to find their voting location so that they can go out and vote.

This project uses the Google Civic Information API for obtaining a list of elections and the information necessary to find a polling
center near the user. It additionally uses the google maps javascript API and geocoding API for displaying the map to the user

## Setup
Setting up this project is relatively simple. You need to request one (or two, depending on how you want to deal with security, see below)
API key from Google's [Developer API Console](https://console.developers.google.com/apis/)

Once these keys are generated, you need to make sure that the following APIs are enabled:

If using 1 key:
- Google Civic Information API
- Google Maps Javascript API
- Google Maps Geocoding API

If using 2 keys:
- For key 1:
    - Google Civic Information API
- For key 2:
    - Google Maps Javascript API
    - Google Maps Geocoding API
    
It is more secure to use two keys in this case. One is used for the civic information API, which is requested from the backend
and therefore does not need to be protected, while the other is used in the javascript code related to the map, which needs to be better
protetected (see google's explanation on restricting API keys).

Once your keys are generated, insert the keys into the queryGoogle.php in the specified variable, and then the other (or same key if only using one)
key into the MAPS_API_KEY variable in index.html

Then just upload the code to a webserver capable of running PHP code and it should work.

## Contributors
- Christopher Bitler

## License
MIT