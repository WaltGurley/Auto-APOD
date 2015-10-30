#AutoAPOD
Application to autoload the NASA Astronomy Picture of the Day Responsively using NASA API. It is picky and doesn't allow videos or images with a portrait aspect ratio. You can choose to enable videos in main.js --> noVideo = false.

To run include a config.json file with your API key (e.g., {"key": "yourAPIkey"}) in the js folder. Alternatively, use the key "DEMO_KEY"

##Testing
Two javascript files are included for testing. You should only run one at a time.

###Test by loading dates from input: datePickerTest.js
Uncomment line in html to load file. Once loaded, input date 'YYYY-MM-DD' into text box and click "Go!"

###Test by loading random dates on timer: timedLoaderTest.js
Uncomment line in html to load file. Once loaded, image will reload from random date every 15 seconds.
