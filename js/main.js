//send query to NASA Astronomy Picture of the Day using supplied date
function loadData(date) {

  //load necessary info and run
  $.getJSON("./js/config.json")
    .done( function(config) {
      //supply API keys from config file,
      // use demo key if no NASA API key in config.json
      var apiKeys = {}
      apiKeys.nasa = config.keyNASA || "DEMO_KEY";
      apiKeys.short = config.keyUrlShortener || undefined;
      requestTestAdd(apiKeys, date);
    })
    .fail( function() {
      //if load fails fall back on demo key
      requestTestAdd("DEMO_KEY", date);
      console.log("Did not load ./js/config.json. Check file.");
    });
}

//send request, do necessary tests, and add image
function requestTestAdd(keys, date) {
  //compose query usng date and api key, ask for concept tags and hd image
  var query = "https://api.nasa.gov/planetary/apod?date=" +  date +
    "&hd=True&api_key=" + keys.nasa;


  //http request
  $.get(query, function(data) {
    //append API key for url shortener to data for easy passing around
    data.shortKey = keys.short;
    console.log(data);
    //test if result is not an image (is a video)
    if (data.media_type != "image") {
      //NO VIDEOS?
      var noVideo = true;

      //if videos are not wanted reload with random date
      if (noVideo) {
        //load random content between today and supplied past date
        var pastDate = new Date(2015,0,1);
        loadData(
          randomDateFromRange(pastDate, new Date()).toISOString().slice(0,10)
        );

        console.log("NO VIDEOS!");

      //if videos are wanted, add video
      } else addVideo(data);

    //if result is an image
    } else {
      //create an image element and add a listener to detect image size
      // before adding it to the window
      var img = new Image();

      img.addEventListener("load", function() {
        var imgWidth = this.width;
        var imgHeight = this.height;

        //if image aspect ratio is square or portrait reload with random date
        if (imgWidth / imgHeight <= 1) {

          //load random content between today and supplied past date
          loadData(
            randomDateFromRange(new Date(2015,0,1), new Date())
              .toISOString().slice(0,10)
          );

          console.log("NO PORTRAIT ASPECT!");

        } else addImage(data);
      });

      //set the image source for testing the image size on load
      img.src = data.hdurl || data.url;
      img = null;
    }
  });
}

//function to window add image to window if landscape
function addImage(data) {
  var imageurl = data.hdurl || data.url;
  var copyright = data.copyright || undefined;
  //if content passes all tests
    var image = $(".main-image");

    image.css("display", "flex")
      .attr("src", imageurl);

    $(".background-blur").css("background-image", "url(" + imageurl + ")");

    $(".main-video").css("display", "none");

    $(".image-title").text(data.title);
    if (copyright) {
      $(".image-copy").text(String.fromCharCode(169) + " " + data.copyright);
    } else $(".image-copy").remove();
    if (data.shortKey) {
      $(".image-expl").text("url shortener");
    } else $(".image-expl").text("apod.nasa.gov");
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
