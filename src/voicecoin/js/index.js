var sesstionId = '';
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
    var hg = winHg - $pageHeader.height() - 80;
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
function sendApi(){
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
        if(!sesstionId){
            sesstionId = new Date().getTime();
        }
        var url = 'http://149.28.132.134:128/v1/Conversation/'+sesstionId+'/50dbb57981654aa1a6bbf24f612f207f?text='+myQuestionInput;
        scrollToEnd();
        $.ajax({
            type: 'get',
            url: url,
            data: {},
            success: function ( response ) {
                $dummyPois.parent().find('.load-container').remove();
                var answerContent = response;
                var answerHtml = buildLeftTooltipHtml(answerContent,'');
                $dummyPois.append(answerHtml);
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
            sendApi();
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

function buildQuestionInputHtml() {
    var html = '';
    html += '<div class="clrfix search d7">\n' +
        '  <input type="text" class="my-question-input" id="my-question-input" placeholder="在这里输入..." />\n' +
        ' <button type="submit" onclick="sendApi();"></button>           </div>';
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