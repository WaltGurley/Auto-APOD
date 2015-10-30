//LOAD APOD FROM RANDOM DATE EVERY 15 SECONDS

//timed loader for testing
var loadContentOnInterval = window.setInterval(intervalLoad, 15000);

function intervalLoad() {
  //load random content between today and supplied past date
  loadData(
    randomDateFromRange(new Date(2015,0,1), new Date())
      .toISOString().slice(0,10)
  );
}
