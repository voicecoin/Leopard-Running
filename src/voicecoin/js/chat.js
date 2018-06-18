$(document).ready(function(){ 

  var $dummyPois = $("#dummy-pois");
  initSTT();

  // set up connection
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(baseUrl + "/chatHub")
    .build();

  // receive message
  connection.on("ReceiveMessage", (user, message) => {
    const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var answerHtml = buildLeftTooltipHtml(msg,'');
    $("#dummy-pois").append(answerHtml);

    $("#my-question-input").val('');
    scrollToEnd();
  });

  // show loading
  connection.on("ShowLoading", () => {
    var loadingHtml = buildLoadingHtml();
    $dummyPois.append(loadingHtml);
    scrollToEnd();
  });

  // hide loading
  connection.on("HideLoading", () => {
    $dummyPois.parent().find('.load-container').remove();
    scrollToEnd();
  });

  // start web socket
  connection.start().catch(err => console.error(err.toString()));

  setTimeout(function(){
    $("#sendButton").click(event => {
      var $myQuestionInput = $("#my-question-input");
      
      var myQuestionInput = $myQuestionInput.val();
      var rightHtml = buildRightTooltipHtml(myQuestionInput,'');
      $dummyPois.append(rightHtml);
      

      const conversationId = urlPara ('conversationId=');;
      const message = $("#my-question-input").val();
      // send message to web socket
      connection.invoke("SendMessage", conversationId, message).catch(err => console.error(err.toString()));
      event.preventDefault();
    });
  },500);


});

var two_line = /\n\n/g;
var one_line = /\n/g;
var first_char = /\S/;

// speech to text
function initSTT() {
  var langs =
        [
            ['English',  ['en-AU', 'Australia'],
                ['en-CA', 'Canada'],
                ['en-GB', 'United Kingdom'],
                ['en-US', 'United States']],
            ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                ['cmn-Hans-HK', '普通话 (香港)'],
                ['cmn-Hant-TW', '中文 (台灣)']]];

    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = function() {
            recognizing = true;
        };
        recognition.onerror = function(event) {
            if (event.error == 'no-speech') {
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                ignore_onend = true;
            }
        };
        recognition.onend = function() {
            recognizing = false;
            if (ignore_onend) {
                return;
            }
            if (!final_transcript) {
                return;
            }
        };
        recognition.onresult = function(event) {
            var final_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                }
            }
            final_transcript = capitalize(final_transcript);
            var $my_question_input = $("#my-question-input");
            $my_question_input.val(final_transcript);
            if(final_transcript.length > 0) {
                console.log(final_transcript);
				sendEvent();
				hideSpeaking();
				startButton();
                // add send message and clear input box
            }
            
/*            final_span.innerHTML = linebreak(final_transcript);
            interim_span.innerHTML = linebreak(interim_transcript);
            if (final_transcript || interim_transcript) {
                showButtons('inline-block');
            }*/
//            console.dir([final_transcript,capitalize(final_transcript),interim_transcript,linebreak(final_transcript),linebreak(interim_transcript)]);
        };
    }
}

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  var lang = 'cmn-Hans-CN';
  var language = urlPara ('language=');
  if(language == 'en'){
      lang = 'en-US';
  }
  if (recognizing) {
      recognition.stop();
      recognizing = false;
      return;
  }
  recognizing = true;
  final_transcript = '';
  recognition.lang = lang;//select_dialect.value;
  recognition.start();
  // recognition.onstart();
  ignore_onend = false;
  // start_timestamp = event.timeStamp;
}