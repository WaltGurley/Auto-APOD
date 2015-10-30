//ADDS BUTTON FOR SELECTING APOD IMAGES FROM SPECIFIED DATE

//append button for selection to body
$("body").append("<div class='date-changer'><input type='text' class='form-control date-picker-input' placeholder='Change Date (YYYY-MM-DD)'><button class='date-picker-btn' type='button'>Go!</button></div>");


$(".date-picker-btn").on("click", function() {
  var date = $(".date-picker-input").val();

  //test if input is in format 'YYYY-MM-DD'
  //TODO does not test if all dates are invalid (e.g., 2015-19-19)
  if (/\d{4}[-][0-1][0-9][-][0-3][0-9]/.test(date)) {
    loadData(date);
  } else {
    //if date input is not formatted correctly alert user
    $(".date-picker-input").val("");
    alert("Invalid date! Must be formatted as YYYY-MM-DD");
  }
});
