var qaItems = [];
var itemNo  = 0;
var qaTotal = 0;
var qaIdx   = [];
var qaBMark = [];

var pageSelector = '';
var topicqa      = {};

var qaTopics  = [];
//var urAnswers = [];
var topicId;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showQAPage(pageSelector) {
  // Get the page we are going to dump our content into.
  var $page = $( pageSelector ),
      // Get the header for the page.
      $header = $page.children( ":jqmData(role=header)" ),
      $footer = $page.children( ":jqmData(role=footer)" ),
      // Get the content area element for the page.
      $content = $page.children( ":jqmData(role=content)" ),
      markup = "",
      itemShow = itemNo + 1;
  if (qaBMark[itemNo] == 1) {
    $footer.find( "h1" ).html("Page Bookmark : On");
  } else {
    $footer.find( "h1" ).html("Page Bookmark : Off");
  }
  markup += "<h3 class='ui-bar ui-bar-a ui-corner-all'>Question No. " + itemShow + "</h3>";
  markup += "<div class='ui-body ui-body-a ui-corner-all'>";
  markup += "<p>" + qaItems[qaIdx[itemNo]].quest + "</p>";
  markup += "</div>";
  markup += "<div data-role='collapsibleset' data-theme='a' data-content-theme='a' data-iconpos='right'>";
// markup += "<div data-role='collapsible'><h3>Your Answer</h3>";
// markup += "<label for='textarea-4' class='ui-hidden-accessible'>Textarea:</label>";
// markup += "<textarea cols='40' rows='2' name='textarea-4' id='textarea-4'></textarea>";
// markup += "<input type='button' data-role='none' id='savebtn' value='Save'></div>";
  markup += "<div data-role='collapsible'><h3>The Correct Answer</h3>";
  var numAns = qaItems[qaIdx[itemNo]].cans.length;
  for ( var i = 0; i < numAns; i++ ) {
    markup += "<p>" + qaItems[qaIdx[itemNo]].cans[i] + "</p>";
  }        
  markup += "</div></div>";

  markup += "<div class='ui-grid-b' id='buttons'>";
  var btns = "";
  if (itemNo == 0) { // if we are in the first question, disable Prev button
    btns += "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l' disabled=''></div>";
  } else { // if not, enable Prev button
    btns += "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l'></div>";
  }
  btns += "<div class='ui-block-b'><input type='button' id='markqa' value='Mark' data-icon='location'></div>";
  if (itemNo == (qaTotal - 1)) { // if we are in the last question, disable Next button
    btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right' disabled=''></div>";
  } else {
    btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right'></div>";
  }
  markup += "</div>";
  // Inject the category items markup into the content element.
  $content.html( markup );
  // Pages are lazily enhanced. We call page() on the page
  // element to make sure it is always enhanced before we
  // attempt to enhance the listview markup we just injected.
  // Subsequent calls to page() are ignored since a page/widget
  // can only be enhanced once.
  $page.page();
  // Enhance the collapsible we just injected.
  $content.find( ":jqmData(role=collapsible)" ).collapsible();
  $('#buttons').append(btns).trigger('create');
}

// Load the data for a specific category, based on
// the URL passed in. Generate markup for the items in the
// category, inject it into an embedded page, and then make
// that page the current active page.

function showTDTopics(urlObj, options) {
  var topicItem = urlObj.hash.replace( /.*topic=/, "" );
  topicId = parseInt(topicItem);
  // Get the topic from JSON array
  topicqa = qaTopics[topicId];
  pageSelector = urlObj.hash.replace( /\?.*$/, "" );
  if (topicqa) {
    // Get the page we are going to dump our content into.
    var $page = $( pageSelector );
    // Get the header for the page.
    var $header = $page.children( ":jqmData(role=header)" );
    // Find the h1 element in our header and inject the name of
    // the category into it.
    $header.find( "h1" ).html( topicqa.topic );
    // The array of items for this category.
    qaItems = JSON.parse(localStorage.getItem("qaList" + topicId));
    // The number of items in the category.
    qaTotal = topicqa.qaTotal;
    // Get the indices of the quizzes
    qaIdx = JSON.parse(localStorage.getItem("qaIdx" + topicId));
    // Get the bookmark of the quizzes
    qaBMark = JSON.parse(localStorage.getItem("bkmark" + topicId));
    // Start from first question
    itemNo = 0;

    // Render the page content
    showQAPage(pageSelector);

    // We don't want the data-url of the page we just modified
    // to be the url that shows up in the browser's location field,
    // so set the dataUrl option to the URL for the category
    // we just loaded.
    options.dataUrl = urlObj.href;
    // Now call changePage() and tell it to switch to
    // the page we just modified.
    $.mobile.changePage($page, options);
  }
}

$(document).on("click", "#nextqa", function() {
  // Advance to next item
  itemNo = itemNo + 1;
  var $page = $( pageSelector ),
      $footer = $page.children( ":jqmData(role=footer)" ),
      $content = $page.children( ":jqmData(role=content)" ),
      markup = "",  // markup string initially empty
      itemShow = itemNo + 1; // for rendering non-zero item numbers

  if (qaBMark[itemNo] == 1) {
    $footer.find( "h1" ).html("Page Bookmark : On");
  } else {
    $footer.find( "h1" ).html("Page Bookmark : Off");
  }

  markup += "<h3 class='ui-bar ui-bar-a ui-corner-all'>Question No. " + itemShow + "</h3>";
  markup += "<div class='ui-body ui-body-a ui-corner-all'>"; 
  markup += "<p>" + qaItems[qaIdx[itemNo]].quest + "</p>";
  markup += "</div>";
  markup += "<div data-role='collapsibleset' data-theme='a' data-content-theme='a' data-iconpos='right'>";

//markup += "<div data-role='collapsible'><h3>Your Answer</h3>";
//markup += "<label for='textarea-4' class='ui-hidden-accessible'>Textarea:</label>";
//markup += "<textarea cols='40' rows='2' name='textarea-4' id='textarea-4'></textarea>";
//markup += "<input type='button' data-role='none' id='savebtn' value='Save'></div>";

  markup += "<div data-role='collapsible'><h3>The Correct Answer</h3>";
  var numAns = qaItems[qaIdx[itemNo]].cans.length;
  for (var i = 0; i < numAns; i++) {
    markup += "<p>" + qaItems[qaIdx[itemNo]].cans[i] + "</p>";
  }
  markup += "</div></div>";

  markup += "<div class='ui-grid-b' id='buttons'>";
  var btns = "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l'></div>";
  btns +=    "<div class='ui-block-b'><input type='button' id='markqa' value='Mark' data-icon='location'></div>";
  if (itemNo == (qaTotal - 1)) { // if we are in the last question, disable Next button
    btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right' disabled=''></div>";
  } else {
    btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right'></div>";
  }
  markup += "</div>";

  // Inject the markup into the content element.
  $content.html(markup);
  $page.page();
  $content.find(":jqmData(role=collapsible)").collapsible();
  $('#buttons').append(btns).trigger('create');
});

$(document).on("click", "#prevqa", function() {
  itemNo = itemNo - 1;
  var $page = $( pageSelector ),
      $footer = $page.children( ":jqmData(role=footer)" ),
      $content = $page.children( ":jqmData(role=content)" ),
      markup = "",
      itemShow = itemNo + 1;

  if (qaBMark[itemNo] == 1) {
    $footer.find( "h1" ).html("Page Bookmark : On");
  } else {
    $footer.find( "h1" ).html("Page Bookmark : Off");
  }

  markup += "<h3 class='ui-bar ui-bar-a ui-corner-all'>Question No. " + itemShow + "</h3>";
  markup += "<div class='ui-body ui-body-a ui-corner-all'>"; 
  markup += "<p>" + qaItems[qaIdx[itemNo]].quest + "</p>";
  markup += "</div>";
  markup += "<div data-role='collapsibleset' data-theme='a' data-content-theme='a' data-iconpos='right'>";

//markup += "<div data-role='collapsible'><h3>Your Answer</h3>";
//markup += "<label for='textarea-4' class='ui-hidden-accessible'>Textarea:</label>";
//markup += "<textarea cols='40' rows='2' name='textarea-4' id='textarea-4'></textarea>";
//markup += "<input type='button' data-role='none' id='savebtn' value='Save'></div>";

  markup += "<div data-role='collapsible'><h3>The Correct Answer</h3>";
  var numAns = qaItems[qaIdx[itemNo]].cans.length;
  for (var i = 0; i < numAns; i++) {
    markup += "<p>" + qaItems[qaIdx[itemNo]].cans[i] + "</p>";
  }
  markup += "</div></div>"; 

  markup += "<div class='ui-grid-b' id='buttons'>";
  var btns = "";
  if (itemNo == 0) { // if we are in the first question, disable Prev button
    btns += "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l' disabled=''></div>";
  } else { // if not, enable Prev button
    btns += "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l'></div>";
  }
  btns += "<div class='ui-block-b'><input type='button' id='markqa' value='Mark' data-icon='location'></div>";
  btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right'></div>";
  markup += "</div>";

  // Inject the markup into the content element.
  $content.html( markup );
  $page.page();
  $content.find(":jqmData(role=collapsible)").collapsible();
  $('#buttons').append(btns).trigger('create');
});

// Listen for any attempts to call changePage().
$(document).bind("pagebeforechange", function( e, data ) {
  // We only want to handle changePage() calls where the caller is
  // asking us to load a page by URL.
  if (typeof data.toPage === "string") {
    // We are being asked to load a page by URL, but we only
    // want to handle URLs that request the data for a specific
    // category.
    var u = $.mobile.path.parseUrl(data.toPage),
        re = /^#qanda-page/;
    if (u.hash.search(re) !== -1) {
      // We're being asked to display the items for a specific category.
      // Call our internal method that builds the content for the category
      // on the fly based on our in-memory category data structure.
      showTDTopics( u, data.options );
      // Make sure to tell changePage() we've handled this call so it doesn't
      // have to do anything.
      e.preventDefault();
    }

    if (u.hash.search(/^#qabookmark/) !== -1) {
      var $page = $('#qabookmark'),
          $content = $page.children( ":jqmData(role=content)" ),
          select = "";

      select += "<div class='ui-field-contain'>";
      select += "<label for='bmselect'>Select Bookmark </label>";
      select += "<select name='bmselect' id='bmselect' data-native-menu='false'>";
      select += "<option value='none'>Choose one...</option>";
      var items = qaBMark.length;
      for (var i = 0; i < items; i++) {
        if (qaBMark[i] == 1) {
          var iShow = i+1;
          select += "<option value=" + i +">" + iShow + ". " +qaItems[qaIdx[i]].quest + "</option>";
        }
      }
      select += "</select>";
      select += "</div>";

	  $content.html(select);
      $('select').selectmenu();
      e.preventDefault();
    }
  }
});

// This is performed once
$(document).on("pageinit", "#quizzermain", function () {
  //set up string for adding <li/>

  if (localStorage.getItem("tdTopics") === null) {
  localStorage.setItem("tdTopics", JSON.stringify([])); 

  localStorage.setItem("qaIdx0", JSON.stringify([]));
  localStorage.setItem("bkmark0", JSON.stringify([]));
  localStorage.setItem("qaList0", JSON.stringify([]));
  }

  var li = "";

  // load from localstorage
  qaTopics = JSON.parse(localStorage.getItem("tdTopics"));  

  if (qaTopics.length != 0) {
    //container for $li to be added
    $.each(qaTopics, function (i, value) {
      //add the <li> to "li" variable
      //note the use of += in the variable
      //meaning I'm adding to the existing data. not replacing it.
      //store index value in array as id of the <a> tag
      li += '<li><a href="#qanda-page?topic=' + i + '" id="' + i + '" class="qanda-go">';
      li += '<h3>' + value.topic + ' </h3>';
      li += '<p>' + value.qaTotal + ' Q & A items</p></a>';
      li += '</li>';
    });
  } else {
    li += '<li><h3>Database is empty</h3><p>Update Q & A database when server is available.</p></li>';
  }

  //append list to ul
  $("#tdtopics").append(li).promise().done(function () {
    //wait for append to finish - thats why you use a promise()
    //done() will run after append is done
    //add the click event for the redirection to happen to #details-page
//  $(this).on("click", ".qanda-go", function (e) {
//    e.preventDefault();
      //store the information in the next page's data
//    $("#details-page").data("tdqanda", tdqanda[this.id]);
      //change the page # to second page. 
      //Now the URL in the address bar will read index.html#details-page
      //where #details-page is the "id" of the second page
      //we're gonna redirect to that now using changePage() method
//    $.mobile.changePage("#details-page");
//  });
    //refresh list to enhance its styling.
    $(this).listview("refresh");
  });
});

$(document).on("click", "#markqa", function(e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  //Do important stuff....
  var $page = $( "#qanda-page" ),
	  $footer = $page.children( ":jqmData(role=footer)" );
  if (qaBMark[itemNo] == 0) {
    qaBMark[itemNo] = 1;
    $footer.find( "h1" ).html("Page Bookmark : On");
  } else {
    qaBMark[itemNo] = 0;
    $footer.find( "h1" ).html("Page Bookmark : Off");
  }
  //save this to localStorage
  localStorage.setItem("bkmark" + topicId, JSON.stringify(qaBMark));
});

$(document).on( "click", "#cancelBtn", function(e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  //Do important stuff....
  $("#shuffle-qanda").popup('close');
});


function loadjscssfile(filename, filetype) {
  if (filetype=="js"){ //if filename is a external JavaScript file
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filename)
  } else 
  if (filetype=="css"){ //if filename is an external CSS file
    var fileref=document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
  }
  if (typeof fileref!="undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}

var filesadded="" //list of files already added 
function checkloadjscssfile(filename, filetype) {
  if (filesadded.indexOf("["+filename+"]")==-1) {
    loadjscssfile(filename, filetype)
    filesadded+="["+filename+"]"          //List of files added in the form "[filename1],[filename2],etc"
  } else alert("File already added!")
}

function removejscssfile(filename, filetype) {
  var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
  var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
  var allsuspects=document.getElementsByTagName(targetelement)
  for (var i=allsuspects.length; i>=0; i--) { //search backwards within nodelist for matching elements to remove
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
      allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
  }
}
 
$(document).on("click", "#updateBtn", function(e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  //Do important stuff....
  checkloadjscssfile("js/qanda.js", "js") //success
  $("#about").popup('close');
  removejscssfile("js/qanda.js", "js") //remove all occurences of "somescript.js" on page
});

$(document).on("click", "#bkcancelbtn", function(e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  //Do important stuff....
  $("#qabookmark").popup('close');
});

$(document).on("click", "#bkgopage", function(e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  //Do important stuff....

  var selecteditem = $("#bmselect option:selected").val();
  if (selecteditem == "none") {
    $("#qabookmark").popup('close');
  } else { 
    itemNo = parseInt(selecteditem);
    $("#qabookmark").popup('close');
    var $page = $( pageSelector ),
	    // Get the header for the page.
        $footer = $page.children( ":jqmData(role=footer)" ),
        // Get the content area element for the page.
        $content = $page.children( ":jqmData(role=content)" ),
        markup = "",
        itemShow = itemNo + 1;

    // Find the h1 element in our header and inject the name of
    // the category into it.
    // $header.find( "h1" ).html( topicqa.topic );
    if (qaBMark[itemNo] == 1) {
      $footer.find( "h1" ).html("Page Bookmark : On");
    } else {
      $footer.find( "h1" ).html("Page Bookmark : Off");
    }
    markup += "<h3 class='ui-bar ui-bar-a ui-corner-all'>Question No. " + itemShow + "</h3>";
    markup += "<div class='ui-body ui-body-a ui-corner-all'>";
    markup += "<p>" + qaItems[qaIdx[itemNo]].quest + "</p>";
    markup += "</div>";
    markup += "<div data-role='collapsibleset' data-theme='a' data-content-theme='a' data-iconpos='right'>";

//  markup += "<div data-role='collapsible'><h3>Your Answer</h3>";
//  markup += "<label for='textarea-4' class='ui-hidden-accessible'>Textarea:</label>";
//  markup += "<textarea cols='40' rows='2' name='textarea-4' id='textarea-4'></textarea>";
//  markup += "<input type='button' data-role='none' id='savebtn' value='Save'></div>";

    markup += "<div data-role='collapsible'><h3>The Correct Answer</h3>";
    var numAns = qaItems[qaIdx[itemNo]].cans.length;
    for (var i = 0; i < numAns; i++) {
      markup += "<p>" + qaItems[qaIdx[itemNo]].cans[i] + "</p>";
    }        
    markup += "</div></div>";
    markup += "<div class='ui-grid-b' id='buttons'>";

    var btns = "";
    if (itemNo == 0) { // if we are in the first question, disable Prev button
      btns += "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l' disabled=''></div>";
    } else { // if not, enable Prev button
      btns += "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l'></div>";
    }
    btns += "<div class='ui-block-b'><input type='button' id='markqa' value='Mark' data-icon='location'></div>";
    if (itemNo == (qaTotal - 1)) { // if we are in the last question, disable Next button
      btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right' disabled=''></div>";
    } else {
      btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right'></div>";
    }
    markup += "</div>";
    // Inject the category items markup into the content element.
    $content.html( markup );
    // Pages are lazily enhanced. We call page() on the page
    // element to make sure it is always enhanced before we
    // attempt to enhance the listview markup we just injected.
    // Subsequent calls to page() are ignored since a page/widget
    // can only be enhanced once.
    $page.page();
    // Enhance the collapsible we just injected.
    $content.find( ":jqmData(role=collapsible)" ).collapsible();
    $('#buttons').append(btns).trigger('create');
  }
});

$(document).on("click", "#shuffleBtn", function(e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  //Do important stuff....
  // shuffle the quizzes
  shuffle(qaIdx);
   // Reset all bookmarks
  var items = qaBMark.length;
  for (var i = 0; i < items; i++) {
    if (qaBMark[i] == 1) {
      qaBMark[i] = 0;
    }
  }
  //save indices
  localStorage.setItem("qaIdx" + topicId, JSON.stringify(qaIdx));
  //save bookmarks
  localStorage.setItem("bkmark" + topicId, JSON.stringify(qaBMark));
  // Close popup dialog
  $("#shuffle-qanda").popup('close');
  // refresh Q and A page
  // Start from first question
  itemNo = 0;
  // Get the page we are going to dump our content into.
  var $page = $(pageSelector),
      $footer = $page.children( ":jqmData(role=footer)" ),
      $content = $page.children( ":jqmData(role=content)" ),
      markup = "",
      itemShow = itemNo + 1;

  if (qaBMark[itemNo] == 1) {
    $footer.find( "h1" ).html("Page Bookmark : On");
  } else {
    $footer.find( "h1" ).html("Page Bookmark : Off");
  }
  markup += "<h3 class='ui-bar ui-bar-a ui-corner-all'>Question No. " + itemShow + "</h3>";
  markup += "<div class='ui-body ui-body-a ui-corner-all'>";
  markup += "<p>" + qaItems[qaIdx[itemNo]].quest + "</p>";
  markup += "</div>";
  markup += "<div data-role='collapsibleset' data-theme='a' data-content-theme='a' data-iconpos='right'>";

//markup += "<div data-role='collapsible'><h3>Your Answer</h3>";
//markup += "<label for='textarea-4' class='ui-hidden-accessible'>Textarea:</label>";
//markup += "<textarea cols='40' rows='2' name='textarea-4' id='textarea-4'></textarea>";
//markup += "<input type='button' data-role='none' id='savebtn' value='Save'></div>";
  markup += "<div data-role='collapsible'><h3>The Correct Answer</h3>";
  var numAns = qaItems[qaIdx[itemNo]].cans.length;
  for (var i = 0; i < numAns; i++) {
    markup += "<p>" + qaItems[qaIdx[itemNo]].cans[i] + "</p>";
  }        
  markup += "</div></div>";
  markup += "<div class='ui-grid-b' id='buttons'>";

  var btns = "";
  if (itemNo == 0) { // if we are in the first question, disable Prev button
    btns += "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l' disabled=''></div>";
  } else { // if not, enable Prev button
    btns += "<div class='ui-block-a'><input type='button' id='prevqa' value='Prev' data-icon='arrow-l'></div>";
  }
  btns += "<div class='ui-block-b'><input type='button' id='markqa' value='Mark' data-icon='location'></div>";
  if (itemNo == (qaTotal - 1)) { // if we are in the last question, disable Next button
    btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right' disabled=''></div>";
  } else {
    btns += "<div class='ui-block-c'><input type='button' id='nextqa' value='Next' data-icon='arrow-r' data-iconpos='right'></div>";
  }
  markup += "</div>";
  // Inject the category items markup into the content element.
  $content.html( markup );
  // Pages are lazily enhanced. We call page() on the page
  // element to make sure it is always enhanced before we
  // attempt to enhance the listview markup we just injected.
  // Subsequent calls to page() are ignored since a page/widget
  // can only be enhanced once.
  $page.page();
  // Enhance the collapsible we just injected.
  $content.find( ":jqmData(role=collapsible)" ).collapsible();
  $('#buttons').append(btns).trigger('create');
});

