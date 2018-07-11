var $dummyPois = $("#dummy-pois");

// set up connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl(baseUrl + "/chatHub")
    .build();

var isSendingChat = false;
var conversationId = urlPara('conversationId=');
const agentId = urlPara('agentId=');

$(document).ready(function () {
    ajaxSetup();

    initSTT();

    // init session
    if (!conversationId) {
        initSession(agentId, false)
    }

    // receive message
    connection.on("ReceiveMessage", (data) => {
        if (data.audioPath) {
            audios.push(data.audioPath);
        }
        var answerHtml = buildLeftTooltipHtml(data, '');
        $("#dummy-pois").append(answerHtml);
        isSendingChat = false;
        $("#my-question-input").val('');
        scrollToEnd();
    });

    // receive system notification
    connection.on("SystemNotification", (data) => {
        if (data) {
            var answerHtml = buildSystemNotificationHtml(data, '');
            if (answerHtml) {
                $("#dummy-pois").append(answerHtml);
            }
        }
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

    // transfer agent, conversation changed then convey last message.
    connection.on("Transfer", (data) => {
        connection.invoke("SendMessage", conversationId, data.fulfillmentText).catch(err => console.error(err.toString()));
    });

    // start web socket
    connection.start().catch(err => console.error(err.toString()));

    /*  setTimeout(function(){
        $("#sendButton").click(event => {
            event.preventDefault();
            sendChatContent();
        });
      },500);*/

    updateRobotHeader();
    setInterval(function () {
        playAudio();
    }, 100);
});

function ajaxSetup() {
    $.ajaxSetup({
        processData: false,
        dataType: "json",
        contentType: "application/json",
        beforeSend: function (request, settings) {
            settings.data = JSON.stringify(settings.data);
            request.setRequestHeader("Authorization", "bearer " + localStorage.token);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //s_tip(JSON.stringify(jqXHR), 'fail');
        }
    });
}

function initSession(agentId, isReset) {
    if (!agentId) {
        agentId = 'fd9f1b29-fed8-4c68-8fda-69ab463da126'
    }

    var url = baseUrl + '/v1/Conversation/' + agentId + '/start';
    if (isReset) {
        url = baseUrl + '/v1/Conversation/' + conversationId + '/reset';
    }

    $.get(url, function (data) {
        conversationId = data;
    });
    /*$.ajax({
        type: 'get',
        url: url,
        data: {},
        success: function (response) {
            conversationId = response;
        }
    })*/
}

function updateRobotHeader() {
    var agent = agentId ? agentId : 'fd9f1b29-fed8-4c68-8fda-69ab463da126';
    var url = baseUrl + '/v1/Agents/' + agent + '/public';
    $.ajax({
        type: 'get',
        url: url,
        data: {},
        success: function (response) {
            $('.robot-name').html(response.name);
            var bg = 'url(' + checkBotAvatar(response.name, true) + ')  0% 0% / 100% 100% no-repeat';
            $('div#robot-avatar').css("background", bg);
            $('.robot-header').css("opacity", 1);
        }
    })
}

function sendChatContent() {
    var $myQuestionInput = $("#my-question-input");

    var myQuestionInput = $myQuestionInput.val();
    var rightHtml = buildRightTooltipHtml(myQuestionInput, '');
    $dummyPois.append(rightHtml);

    const message = $("#my-question-input").val();
    // send message to web socket
    if (!isSendingChat) {
        isSendingChat = true;
        connection.invoke("SendMessage", conversationId, message).catch(err => console.error(err.toString()));
    }
}

var two_line = /\n\n/g;
var one_line = /\n/g;
var first_char = /\S/;
var recognizing = false;
var ignore_onend;
var start_timestamp;
var recognition;


// speech to text
function initSTT() {
    var langs = [
        ['English', ['en-AU', 'Australia'],
            ['en-CA', 'Canada'],
            ['en-GB', 'United Kingdom'],
            ['en-US', 'United States']
        ],
        ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
            ['cmn-Hans-HK', '普通话 (香港)'],
            ['cmn-Hant-TW', '中文 (台灣)']
        ]
    ];

    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = function () {
            recognizing = true;
        };
        recognition.onerror = function (event) {
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
        recognition.onend = function () {
            recognizing = false;
            if (ignore_onend) {
                return;
            }
            if (!final_transcript) {
                return;
            }
        };
        recognition.onresult = function (event) {
            var final_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                }
            }
            final_transcript = capitalize(final_transcript);
            var $my_question_input = $("#my-question-input");
            $my_question_input.val(final_transcript);
            if (final_transcript.length > 0) {
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
    return s.replace(first_char, function (m) {
        return m.toUpperCase();
    });
}

function startButton(event) {
    var lang = 'cmn-Hans-CN';
    var language = urlPara('language=');
    if (language == 'en') {
        lang = 'en-US';
    }
    if (recognizing) {
        recognition.stop();
        recognizing = false;
        return;
    }
    recognizing = true;
    final_transcript = '';
    recognition.lang = lang; //select_dialect.value;
    recognition.start();
    // recognition.onstart();
    ignore_onend = false;
    // start_timestamp = event.timeStamp;
}

var audios = [];
var isPlayingAudio = false;

function playAudio() {
    if (isPlayingAudio) return;
    if (audios.length == 0) return;

    isPlayingAudio = true;
    var audio = new Audio(audios.shift());

    audio.onended = function () {
        console.log("The audio has ended");
        isPlayingAudio = false;
    };

    audio.play();
}