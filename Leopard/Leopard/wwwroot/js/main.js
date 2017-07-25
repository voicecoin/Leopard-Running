var host = 'http://api.yaya.ai';
//1var host = 'http://localhost:9000';


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

function s_tip(context,s_class){
	var content = "<div class=\"s_tip\">";
		content += context;
		content += "<span class=\"flaticon stroke x-1\"></span></div>";
	$("body").append(content);
	setTimeout(function(){
		$(".s_tip").addClass(s_class);
	},100);
	setTimeout(function(){
		$(".s_tip").removeClass(s_class).remove();
	},5000);
}


function showagree(){
	
	if($('#fullpage').length>0){
		$.fn.fullpage.setAllowScrolling(false);
	}
	
	
	$.get("agreement.html",function(data){
		$("#dialog-modal").html(data);
		$("#dialog-modal").dialog(
		  		{
		  			modal: true,
		  			height:500,
		  			width:750,
		  			beforeClose: function( event, ui ) {
		  				if($('#fullpage').length>0){
		  					$.fn.fullpage.setAllowScrolling(true);
		  				}
		  			}
		  		}
			);
	});
  
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
    put: function (url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PUT');
    },
    delete_: function (url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'DELETE');
    }
});

$(document).ready(function () {

    $.ajaxSetup({
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "bearer " + $.cookie("access_token"));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            s_tip(JSON.stringify(jqXHR), 'fail');
        }
    });

});