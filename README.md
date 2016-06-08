Auto-APOD
---
This application loads the [Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html) (APOD) using the NASA API and automatically scales the image to fit any display size. By default it does not load videos or images with a portrait aspect ratio (You can choose to enable videos in main.js by setting `noVideo = false`). Initially, the application will attempt to load APOD content from the current date (today). If the content does not meet the previous conditions (i.e., content is video or portrait aspect image) the application will attempt to load APOD content from a random date.

The application also utilizes the Google API urlshortener to create a direct link to the image's page on the official Astronomy Picture of the Day website.

The version on GitHub uses the demo NASA API key for testing purposes only and does not include the Google API credentials. To run in a complete form include a config.json file with your NASA API key and your Google API key in the ./js folder. for example:
```json
{
  "keyNASA": "yourNASAAPIkey",
  "keyUrlShortener": "yourGoogleAPIkey"
}
```
Testing
---
Two javascript files are included for testing. You should only run one at a time.

### Test by loading dates from input: datePickerTest.js

Uncomment the following line in html to load the file:

```html
<script src="./js/datePickerTest.js"></script>
```

Once loaded, input date 'YYYY-MM-DD' into text box and click "Go!"

### Test by loading random dates on timer: timedLoaderTest.js
Uncomment the following line in html to load the file:

```html
<script src="./js/timedLoaderTest.js"></script>
```
Once loaded, image will reload from random date every 15 seconds.
