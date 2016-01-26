//send query to NASA Astronomy Picture of the Day using supplied date
function loadData(date) {

  //load necessary info and run
  $.getJSON("./js/config.json")
    .done( function(config) {
      //supply API keys from config file,
      // use demo key if no NASA API key in config.json
      var apiKeys = {};
      apiKeys.nasa = config.keyNASA || "DEMO_KEY";
      apiKeys.short = config.keyUrlShortener || undefined;
      requestTestAdd(apiKeys, date);
    })
    .fail( function() {
      //if load fails fall back on demo key
      var apiKeys = {};
      apiKeys.nasa = "DEMO_KEY";
      apiKeys.short = undefined;
      requestTestAdd(apiKeys, date);
      console.log("Did not load ./js/config.json. Check file.");
    });
}

//send request, do necessary tests, and add image
function requestTestAdd(keys, date) {
  //compose query usng date and api key, ask for concept tags and hd image
  var query = "https://api.nasa.gov/planetary/apod?date=" +  date +
    "&hd=True&api_key=" + keys.nasa;

  //http request
  $.get(query)
    .done(function(data) {
      //append API key for url shortener to data for easy passing around
      data.shortKey = keys.short;
      //test if result is not an image (is a video)
      if (data.media_type != "image") {
        //NO VIDEOS?
        var noVideo = true;

        //if videos are not wanted reload with random date
        if (noVideo) {
          //load random content between today and supplied past date
          var pastDate = new Date(2015,0,1);
          requestTestAdd(
            keys,
            randomDateFromRange(pastDate, new Date()).toISOString().slice(0,10)
          );

          console.log("NO VIDEOS!");

        //if videos are wanted, add video
        } else addVideo(data);

      //if result is an image
      } else {
        testImageSize(keys, data);
      }
    })
    .fail(function(response) {
      var extraMessage = "";
      //if request fails due to bad API key and "DEMO_KEY" hasn't been used
      if (
        response.responseJSON.error.code === "API_KEY_INVALID" &&
        keys.nasa != "DEMO_KEY"
      ) {
        extraMessage = "... Trying again with DEMO_KEY";
        keys.nasa = "DEMO_KEY";
        requestTestAdd(keys, date);
      }

      console.log(response.responseJSON.error.message + extraMessage);

    });
}

//function to get the dimensions of the image for testing aspect
// (i.e., landscape versus portrait)
function testImageSize(keys, data) {
  //create an image element and add a listener to detect image size
  // before adding it to the window
  var img = new Image();

  img.addEventListener("load", function() {
    var imgWidth = this.width;
    var imgHeight = this.height;

    //if image aspect ratio is square or portrait reload with random date
    if (imgWidth / imgHeight <= 1) {

      //load random content between today and supplied past date
      requestTestAdd(
        keys,
        randomDateFromRange(new Date(2015,0,1), new Date())
          .toISOString().slice(0,10)
      );

      console.log("NO PORTRAIT ASPECT IMAGES!");

    } else {

      //if matchMedia API available create media query based on aspect of image
      if (matchMedia) {
        //create media query that tests if the aspect of the window is greater
        // than or equal to the native aspect of the image and add an event
        // listener that is fired when this changes
        var mediaQuery = window.matchMedia(
          "(min-aspect-ratio:" + imgWidth + "/" +
          imgHeight + ")");
        mediaQuery.addListener(aspectChange);
        aspectChange(mediaQuery);
      }

      addImage(data);
    }
  });

  //set the image source for testing the image size on load
  img.src = data.hdurl || data.url;
  img = null;
}

//function to window add image to window if landscape
function addImage(data) {
  var imageUrl = data.hdurl || data.url;
  var copyright = data.copyright || undefined;
  //content passed all tests
    var image = $(".main-image");

    image.css("display", "flex")
      .attr("src", imageUrl);

    $(".background-blur").css("background-image", "url(" + imageUrl + ")");

    $(".main-video").css("display", "none");

    $(".image-title").text(data.title);

    //if image has copyright info add it to display
    // else remove text from screen
    if (copyright) {
      $(".image-copy").css("display", "block");
      $(".image-copy").text(String.fromCharCode(169) + " " + data.copyright);
    } else $(".image-copy").css("display", "none");

    //if urlshortener API key provided create short url
    // else provide link to main landing page of APOD
    if (data.shortKey) {
      var dateFormat = data.date.replace(/-/g,"").replace(/\d\d/,"");
      shortenUrl(data.shortKey, dateFormat);
    } else $(".image-expl").text("apod.nasa.gov/apod/ap");
}

//function that handles image sizing to fit any aspect screen
function aspectChange(mediaQuery) {
  //if the aspect of the screen is greater than the aspect of the image
  if (mediaQuery.matches) {
    $(".main-content").css("width", "auto");
    $(".main-image").css({
      "width": "",
      "height": "100%"
    });
  //if the aspect of the screen is less than the aspect of the image
  } else {
    $(".main-content").css("width", "100vw");
    $(".main-image").css({
      "width": "100%",
      "height": ""
    });
  }
}

//function to setup the short url for linking to the image's page on the
// APOD website, supply Google API key and the formatted date
function shortenUrl(key, dateFormat) {

  //function to load the Google url shortener API
  function init() {
    gapi.client.setApiKey(key);
    gapi.client.load("urlshortener", "v1")
      .then(makeRequest);
  }
  init();

  //function to request a shortened version of the url to the image on the
  // APOD website
  function makeRequest() {
    //if urlshortener loaded correctly then shorten url
    // else supply link to main landing page
    if (gapi.client.urlshortener) {
      var request = gapi.client.urlshortener.url.insert({
        "longUrl": "http://apod.nasa.gov/apod/ap" + dateFormat + ".html"
      });
      request.then(function(response) {
        $(".image-expl").text("Explanation: " + response.result.id);
        $(".image-expl").wrap("<a href='" + response.result.id + "' target='_blank'></a>");
      }, function(reason) {
        console.log("Error: " + reason.result.error.message);
        $(".image-expl").text("apod.nasa.gov/apod");
        $(".image-expl").wrap("<a href='http://apod.nasa.gov/apod/' target='_blank'></a>");
      });
    } else {
      $(".image-expl").text("apod.nasa.gov/apod");
      $(".image-expl").wrap("<a href='http://apod.nasa.gov/apod/' target='_blank'></a>");
    }
  }
}

//function to load a random date if current date content is not an image
// supply two date objects for the range
function randomDateFromRange(olderDate, newerDate) {
  var max = newerDate.getTime();
  var min = olderDate.getTime();

  var randomDate = Math.random() * (max - min) + min;

  return new Date(randomDate);
}

//function to load video content if wanted
function addVideo(data) {
  //test if iframe for video is already appended to body
  if ($("iframe").length === 0) {
    $(".main-content").append("<iframe class='main-video'></iframe>");
  }

  $(".main-image").css("display", "none");

  $(".main-video")
    .css("display", "flex")
    .attr("src", data.url + "&autoplay=1&VQ=1080");
}

//initial load of media using the current day
loadData((new Date()).toISOString().slice(0,10));
