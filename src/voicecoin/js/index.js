var conversationId = '';
var baseUrl = 'http://api.yaya.ai';
//baseUrl = 'http://localhost:128';

$(document).ready(function(){
    initPageFontSize();
    setAnimation();
});

$(window).resize(function(){
    initPageFontSize();
});

function initPageFontSize(){
    $("html").css({"font-size":(100*$(window).width()) / 640});
    /*var wh = $(window).height(),dh = $("#contents").height();
    var dh = $(document).height();
    $("#body").height(wh);*/
    calContanerHeight();
}

function calContanerHeight(){
    var winHg = $(window).height();
    var winWd = $(window).width();
    console.log(winWd);
    var $pageContainer = $("#page-container");
    var $pageHeader = $pageContainer.find('.page-header');
    var $pageBody = $pageContainer.find('.page-body');
    var hg = winHg - $pageHeader.height() - 20;
    $pageContainer.css({"max-height":hg});
    if(winWd >= 700){
        $pageContainer.find('.dummy-tooltip').addClass('dummy-tooltip-540');
    }else if(winWd<640){
        $pageContainer.find('.dummy-tooltip').removeClass('dummy-tooltip-540');
    }
}

function setAnimation(){
    var $dummyPois = $("#dummy-pois");
    /*setTimeout(function(){
        var content01 = '很高兴认识你，我的名字叫小丫，我是一个聪明伶俐，人见人爱花见花开的机器人，想跟我聊聊天吗？';
        var html01 = buildLeftTooltipHtml(content01,'bounceInRight');
        $dummyPois.append(html01);

    },200);*/
    setTimeout(function(){
        var input = buildQuestionInputHtml();
        $dummyPois.parent().append(input);
        monitorInput();
    },200);
}
function sendEvent(){
    conversationId = urlPara ('conversationId=');
    //sendApi();
}
function sendApi(){
    var token = urlPara ('token=');
    var $myQuestionInput = $("#my-question-input");
    var $dummyPois = $("#dummy-pois");
    var myQuestionInput = $myQuestionInput.val();
    if(myQuestionInput){
        var rightHtml = buildRightTooltipHtml(myQuestionInput,'');
        $dummyPois.append(rightHtml);
        $myQuestionInput.val('');
        $dummyPois.parent().find('.load-container').remove();
        var loadingHtml = buildLoadingHtml();
        $dummyPois.append(loadingHtml);

        var url = baseUrl + '/v1/Conversation/'+conversationId+'/Test?text='+myQuestionInput;
        scrollToEnd();
        $.ajax({
            type: 'get',
            headers: {
                Accept: "application/json; charset=utf-8",
                Authorization: "bearer " + token
            },
            url: url,
            data: {},
            success: function ( response ) {
                if(response && response.fulfillmentText){
                    $dummyPois.parent().find('.load-container').remove();
                    var answerContent = response.fulfillmentText;
                    var answerHtml = buildLeftTooltipHtml(answerContent,'');
                    $dummyPois.append(answerHtml);
                }
                scrollToEnd();
            },
            timeout: 15000,
            error: function ( response ) {
                $dummyPois.parent().find('.load-container').remove();
            }
        })
    }
}


function monitorInput(){
    var $myQuestionInput = $("#my-question-input");
    $myQuestionInput.bind('keyup', function(event) {
        if (event.keyCode == "13") {
            sendEvent();
        }
    }).bind('focus',function(event){
        scrollToEnd();
    }).bind('click',function(event){
        scrollToEnd();
    });
}

function scrollToEnd(){//滚动到底部
    var h = $("#page-container").height() + 999999;
    $("#page-container").animate( {scrollTop: h}, 200);
}

function buildLeftTooltipHtml(content,animate){
    var html = '';
    html += '<div class="tooltip tooltip-left clrfix">\n' +
        '                    <div class="tooltip-item  animated">\n' +
        '                    </div>\n' +
        '                    <div class="tooltip-content '+animate+' animated">'+content+'</div>\n' +
        '                </div>'
    return html;
}
function buildRightTooltipHtml(content,animate){//bounceInRight
    var html = '';
    html += '<div class="tooltip tooltip-right clrfix">';
    html += '<div class="tooltip-item  animated">';
    html += '</div>';
    html +=  '<div class="tooltip-content '+animate+' animated">'+content+'</div>';
    html += '</div>';
    return html;
}

function showSpeaking() {
    var $obj = $("#search-input-question");
    $obj.addClass('on-speaking');
}
function hideSpeaking() {
    var $obj = $("#search-input-question");
    $obj.removeClass('on-speaking');
}

function buildQuestionInputHtml() {
    var html = '';
    html += '<div class="clrfix search d7" id="search-input-question">';
//    html += '<button id="start_button" onclick="startButton(event)" style="display: inline-block;"><img alt="Start" id="start_img" src="img/common/mic.gif"></button>';
    html += '<img src="img/common/mic.gif" onclick="showSpeaking();startButton();" class="img-mic"/>';
    html += '<img src="img/common/mic-animate.gif" onclick="hideSpeaking();startButton();" class="img-animate"/>';
    html += '<input type="text" autocomplete="false" class="my-question-input" id="my-question-input" placeholder="在这里输入..." />';
    html += '<button type="submit" id="sendButton" onclick="sendEvent();"></button></div>';
    html += '<div class="clrfix press-enter-tip">按回车键发送</div>';
    return html;
}

function buildLoadingHtml(){
    var html = '';
    html += '<div class="load-container load7">\n' +
        '                <div class="loader">Loading...</div>\n' +
        '            </div>';
    return html;
}

function urlPara (v){
    var url = window.location.search;
    if (url.indexOf(v) != -1){
        var start = url.indexOf(v)+v.length;
        var end = url.indexOf('&',start) == -1 ? url.length : url.indexOf('&',start);
        return url.substring(start,end);
    } else { return '';}
}