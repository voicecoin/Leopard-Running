var userHost = 'http://om.yaya.ai';
var host = 'http://api.yaya.ai';
//host = 'http://localhost:128';


$(document).ready(function () {
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

    //Animation init
    new WOW().init();
});

function goIndexPage(){
    var token = getItems('token');
    if(!token){
        window.location.href = '/src/account/login.html';
    }
}

function checkLogin(){
    var token = getItems('token');
    if(token){
        $("#hasLogin").show();
        $("#noHasLogin").hide();
    }else {
        $("#hasLogin").hide();
        $("#noHasLogin").show();
    }
}

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
            checkLogin();
           console.dir([response]);
        },error: function(e) {
            if(e.status == 401){
                deleteItem('token');
                $("#hasLogin").hide();
                $("#noHasLogin").show();
                console.dir([e]);
            }
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

function _ajax_request(url, data, callback, type, method) {
    if (jQuery.isFunction(data)) {
        callback = data;
        data = {};
    }
    return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type
        });
}

jQuery.extend({
    put: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PUT');
    },
    delete_: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'DELETE');
    }
});

//localStorage存值永久有效
function setItems(name,item){
    localStorage.setItem(name,JSON.stringify(item));
}
//localStorage取值
function getItems(name){
    var data = localStorage.getItem(name);
    return data;
}

//localStorage删除指定键对应的值
function deleteItem(name){
    localStorage.removeItem(name);
    console.log(localStorage.getItem(name));
}

function showHideBotDialog() {
    var $dialog_bot_switch = $("#dialog-bot-switch");
    var $dialog_bot = $("#dialog-bot");
    if(!$dialog_bot_switch.hasClass('open')){
        $dialog_bot_switch.addClass('open');
        $dialog_bot.fadeIn();
    }else{
        $dialog_bot_switch.removeClass('open');
        $dialog_bot.fadeOut();
    }
}

function urlPara (v){
    var url = window.location.search;
    if (url.indexOf(v) != -1){
        var start = url.indexOf(v)+v.length;
        var end = url.indexOf('&',start) == -1 ? url.length : url.indexOf('&',start);
        return url.substring(start,end);
    } else { return '';}
}
var conversationId = '';

var defaultBotAvatars = {
    default: [
        "/src/voicecoin/img/avatar/default0.png",
        "/src/voicecoin/img/avatar/default1.png",
    ],
    Voicebot: [
        "/src/voicecoin/img/avatar/default0.png",
        "/src/voicecoin/img/avatar/default1.png",
    ],
    AppleStore: [
        "/src/voicecoin/img/avatar/apple1.png",
        "/src/voicecoin/img/avatar/apple1.png",
    ],
    Yayabot: [
        "/src/voicecoin/img/avatar/yaya0.png",
        "/src/voicecoin/img/avatar/yaya1.png",
    ],
    Spotify: [
        "/src/voicecoin/img/avatar/spotify0.png",
        "/src/voicecoin/img/avatar/spotify1.png",
    ],
};

function checkBotAvatar(sender, active) {
    var avatar = defaultBotAvatars[sender];
    if (!avatar) {
        avatar = defaultBotAvatars["default"];
    }
    if (active) {
        return avatar[1];
    }
    return avatar[0];
}

function queryByAgentId(agentI, isReset) {
    var agentId = urlPara ('agentId=');
    var checkBot = setInterval(function() {
        var bot =  getBotById(agentId);
        if(bot){
            clearInterval(checkBot);
            if(bot.avatar){
                $("#dialog_img").attr('src',bot.avatar);
            } else{
                $("#dialog_img").attr('src',checkBotAvatar(bot.name, true));
            }
        }
    }, 100);

    var url = host + '/v1/Conversation/'+agentId + '/start';
    if(isReset){
        url = host + '/v1/Conversation/'+conversationId+'/reset';

    }
    $.ajax({
        type: 'get',
        url: url,
        data: {},
        success: function ( response ) {
            conversationId = response;
            var $dialog_bot = $("#dialog-bot");
            var $iframe = $dialog_bot.find('iframe');
            $dialog_bot.attr('agentId',agentId);
            var language = urlPara ('language=');
            var src = '../voicecoin/index.html?conversationId='+conversationId+'&token='+localStorage.token+'&language='+language;
            console.dir([$iframe]);
            $iframe.attr('src',src);
        },
        timeout: 15000,
        error: function ( response ) {

        }
    })
}

function getBotById(agentId){
    var bot = null;
    if(agentId && menuBots && menuBots.length > 0){
        for(var i = 0;i < menuBots.length;i++){
            if(agentId == menuBots[i].id){
                bot = menuBots[i];
                break;
            }
        }
    }
    return bot;
}

function reloadIframe(agentId , isReset){
    queryByAgentId(agentId, isReset);
}


function changeURLPar(destiny, par, par_value)
{
    var pattern = par+'=([^&]*)';
    var replaceText = par+'='+par_value;
    if (destiny.match(pattern))
    {
        var tmp = '/\\'+par+'=[^&]*/';
        tmp = destiny.replace(eval(tmp), replaceText);
        return (tmp);
    }
    else
    {
        if (destiny.match('[\?]'))
        {
            return destiny+'&'+ replaceText;
        }
        else
        {
            return destiny+'?'+replaceText;
        }
    }
    return destiny+'\n'+par+'\n'+par_value;
}

function changeUrlArg(url, arg, val){
    var pattern = arg+'=([^&]*)';
    var replaceText = arg+'='+val;
    return url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText);
}


function addToUrl(obj){
    var aprotocol = location.protocol;
    var ahost = location.host;
    var apath = location.pathname;
    var asearch = location.search;
    var ahash = location.hash;
    var result = '';
    console.log(obj);
    var joinObj = function(joinObj_obj){
        var result = '';
        for(var i in joinObj_obj){
            result += i + '=' + joinObj_obj[i];
        }
        return result;
    };
    var splitSearchToObj = function(str){
        var resObj = {};
        var arr = str.split('&');
        for(var i = 0; i < arr.length; i++){
            resObj[arr[i]] = arr[i];
        }
        return resObj;
    };
    var existObjKey = function(existObjKey_obj, str){
        for(var i in existObjKey_obj){
            if(i == str){
                return true;
            }
        }
        return false;
    };
    var objExtend = function(obj, obj){
        var result = {};
        for(var i in obj){
            if(existObjKey(obj, i)){
                result[i] = obj[i];
            }else{
                result[i] = obj[i];
            }
        }
    };
    if(asearch == ''){
        console.log(obj);
        result = aprotocol + '//' + ahost + apath + '?' + joinObj(obj) + ahash;
    }else{
        var oldSearchObj = splitSearchToObj(asearch.substr());
        result = aprotocol + '//' + ahost + apath + joinObj(objExtend(oldSearchObj, obj)) + ahash;
    }
    return result;
}
