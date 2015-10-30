//ADDS BUTTON FOR SELECTING APOD IMAGES FROM SPECIFIED DATE

//append button for selection to body
$("body").append("<div class='input-group date-changer'><input type='text' class='form-control sizing date-picker-input' placeholder='Change Date (YYYY-MM-DD)'><span class='input-group-btn'><button class='btn btn-default sizing date-picker-btn' type='button'>Go!</button></span></div>");


$(".date-picker-btn").on("click", function() {
  var date = $(".date-picker-input").val();

  //test if input is in format 'YYYY-MM-DD'
  //TODO does not test if date is invalid (e.g., 2015-99-99)
  if (/\d{4}[-]\d{2}[-]\d{2}/.test(date)) {
    loadData(date);
  } else {
    //if date input is not formatted correctly alert user
    $(".date-picker-input").val("");
    alert("Invalid date! Must be formatted as YYYY-MM-DD");
  }
});
