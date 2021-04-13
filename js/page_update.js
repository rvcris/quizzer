var data = [
 {
  "events":
   [
    {
     "venue":"Old Trafford, Manchester",
     "date":"14 August 1990"
    },
    {
     "venue":"Sydney Cricket Ground, Sydney",
     "date":"6 January 1992"
    },
    {
     "venue":"WACA Ground, Perth",
     "date":"3 February 1992"
    },
    {
     "venue":"Sher-e-Bangla National Stadium (3), Mirpur",
     "date":"16 March 2012"
    }
   ]
 }
];


jQuery(document).ready(function() {

  //Initialize global variables
  var cur_record         = 1;
  var UPPER_RECORD_LIMIT = 4;
  var LOWER_RECORD_LIMIT = 1;
  var HASH               = '#';
  var TRANSITION_TYPE    = 'slide';
  var PAGE_ID            = 'main';
  var PAGE_CONTENT_ID    = 'main-content';
  var NEXT_BTN_ID        = 'next';
  var PREV_BTN_ID        = 'prev';

  var ALL_RECORDS        = '';
  var EVENTS             = '';

  //Get the records from JSON file
//  jQuery.getJSON("lib/page_data.json", function(data){
//    setRecords(data);
//  });

  //Store the records in global variables
  function setRecords(data) {
    ALL_RECORDS = data;
    EVENTS = ALL_RECORDS[0].events;
    UPPER_RECORD_LIMIT = EVENTS.length;
    updateRecordsData();
  }

  //Update the page content
  function updateRecordsData(){
    var this_page = jQuery(HASH+PAGE_ID).find(HASH + PAGE_CONTENT_ID);
    var venue = EVENTS[cur_record-1].venue;
    var date = EVENTS[cur_record-1].date;

    var htm = '';
    htm += '<ul data-role="listview">';
        htm += '  <li>Date: ' + date + '</li>';
        htm += '  <li>Venue: ' + venue + '</li>';
        htm += '</ul>';
    jQuery( HASH + PAGE_ID ).find( HASH + PAGE_CONTENT_ID ).html(htm);
  }

  //Go to next record
  function gotoNextRecord() {
    cur_record++;
    if(cur_record > UPPER_RECORD_LIMIT) {
      cur_record = LOWER_RECORD_LIMIT;
    }
    updateRecordsData();
  }

  //Go to previous record
  function gotoPrevRecord() {
    cur_record--;
    if(cur_record < LOWER_RECORD_LIMIT) {
      cur_record = UPPER_RECORD_LIMIT;
    }
    updateRecordsData();
  }

  //Bind events with next/previous buttons
  jQuery(HASH + NEXT_BTN_ID).bind('click', gotoNextRecord);

  jQuery(HASH + PREV_BTN_ID).bind('click', gotoPrevRecord);

  jQuery(HASH+PAGE_ID).bind('swipeleft', gotoNextRecord);

  jQuery(HASH+PAGE_ID).bind('swiperight', gotoPrevRecord);

});
