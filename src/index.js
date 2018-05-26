var userHost = 'http://149.28.132.134:127';
var host = 'http://149.28.132.134:128';
//var host = 'http://localhost:128';

$(document).ready(function () {

    //Animation init
    new WOW().init();

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

    var _hmt = _hmt || [];
    (function () {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?a0ffd8247abd4a38f87f03db9e6c79a7";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

    getUserInfo();
});

function getUserInfo() {
    $.ajax({
        url: userHost + '/account',
        type: "get",
        datType: "JSON",
        contentType: "application/json",
        data: {},
        success: function (response) {
            if(response && response.userName){
                $("#loginUserNameDisplay").html(response.userName).attr('userId',response.id);
            }
           console.dir([response]);
        },error: function(e) {
        }
    });
}

function getDateDiff(dateTimeStamp){
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var today=new Date();
    var now = today.getTime();
    var gmtHours = today.getTimezoneOffset()*60*1000;
    now=now+gmtHours;
    var diffValue = now - dateTimeStamp;
    if(diffValue < 0){return;}
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    if(monthC>=1){
        result="" + parseInt(monthC) + "月前";
    }
    else if(weekC>=1){
        result="" + parseInt(weekC) + "周前";
    }
    else if(dayC>=1){
        result=""+ parseInt(dayC) +"天前";
    }
    else if(hourC>=1){
        result=""+ parseInt(hourC) +"小时前";
    }
    else if(minC>=1){
        result=""+ parseInt(minC) +"分钟前";
    }else
    result="刚刚";
    return result;
}

function getDateTimeStamp(dateStr){
 return Date.parse(dateStr.replace(/-/gi,"/").replace(/T/gi," "));
}

function getQuery(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null)
        return decodeURI(r[2]);
    return null;
}