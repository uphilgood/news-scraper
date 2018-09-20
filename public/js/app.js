// Grab the articles as a json
// $.getJSON("/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });


// Whenever someone clicks a p tag
$(document).on("click", "#view-comment", function () {
  // Empty the notes from the note section

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      location.replace("/articles/" + thisId)

    });
});

// When you click the savenote button
$(document).on("click", "#submitnote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#notetextarea").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section

    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#notetextarea").val("");
});


//save article
$(document).on("click", "#save-article", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/save-articles/" + thisId,
      data: {
        id: thisId

      }
    })
    // With that done
    .then(function (data) {
      if (data === "already saved") {
        alert("This Article is Already Saved!")
      } else {
        // Log the response
        console.log(data);
        alert("Article Saved!")
      }
    });
});

//remove note
$(document).on("click", "#deletenote", function () {
  confirm("Are you sure?")
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId)

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "DELETE",
      url: "/delete-note/" + thisId,
      data: {
        id: thisId
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      alert("Note Deleted!")
      location.replace("/")
    });
});

