/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var userHost = 'http://om.yaya.ai';\nvar host = 'http://api.yaya.ai';\n//host = 'http://localhost:128';\n\n\n$(document).ready(function () {\n    $.ajaxSetup({\n        processData: false,\n        dataType: \"json\",\n        contentType: \"application/json\",\n        beforeSend: function (request, settings) {\n            settings.data = JSON.stringify(settings.data);\n            request.setRequestHeader(\"Authorization\", \"bearer \" + localStorage.token);\n        },\n        error: function (jqXHR, textStatus, errorThrown) {\n            //s_tip(JSON.stringify(jqXHR), 'fail');\n        }\n    });\n\n    var _hmt = _hmt || [];\n    (function () {\n        var hm = document.createElement(\"script\");\n        hm.src = \"https://hm.baidu.com/hm.js?a0ffd8247abd4a38f87f03db9e6c79a7\";\n        var s = document.getElementsByTagName(\"script\")[0];\n        s.parentNode.insertBefore(hm, s);\n    })();\n    getUserInfo();\n\n    //Animation init\n    new WOW().init();\n});\n\nfunction goIndexPage(){\n    var token = getItems('token');\n    if(!token){\n        window.location.href = '/src/account/login.html';\n    }\n}\n\nfunction checkLogin(){\n    var token = getItems('token');\n    if(token){\n        $(\"#hasLogin\").show();\n        $(\"#noHasLogin\").hide();\n    }else {\n        $(\"#hasLogin\").hide();\n        $(\"#noHasLogin\").show();\n    }\n}\n\nfunction getUserInfo() {\n    $.ajax({\n        url: userHost + '/account',\n        type: \"get\",\n        datType: \"JSON\",\n        contentType: \"application/json\",\n        data: {},\n        success: function (response) {\n            if(response && response.userName){\n                $(\"#loginUserNameDisplay\").html(response.userName).attr('userId',response.id);\n            }\n            checkLogin();\n           console.dir([response]);\n        },error: function(e) {\n            if(e.status == 401){\n                deleteItem('token');\n                $(\"#hasLogin\").hide();\n                $(\"#noHasLogin\").show();\n                console.dir([e]);\n            }\n        }\n    });\n}\n\nfunction getDateDiff(dateTimeStamp){\n    var minute = 1000 * 60;\n    var hour = minute * 60;\n    var day = hour * 24;\n    var halfamonth = day * 15;\n    var month = day * 30;\n    var today=new Date();\n    var now = today.getTime();\n    var gmtHours = today.getTimezoneOffset()*60*1000;\n    now=now+gmtHours;\n    var diffValue = now - dateTimeStamp;\n    if(diffValue < 0){return;}\n    var monthC =diffValue/month;\n    var weekC =diffValue/(7*day);\n    var dayC =diffValue/day;\n    var hourC =diffValue/hour;\n    var minC =diffValue/minute;\n    if(monthC>=1){\n        result=\"\" + parseInt(monthC) + \"月前\";\n    }\n    else if(weekC>=1){\n        result=\"\" + parseInt(weekC) + \"周前\";\n    }\n    else if(dayC>=1){\n        result=\"\"+ parseInt(dayC) +\"天前\";\n    }\n    else if(hourC>=1){\n        result=\"\"+ parseInt(hourC) +\"小时前\";\n    }\n    else if(minC>=1){\n        result=\"\"+ parseInt(minC) +\"分钟前\";\n    }else\n    result=\"刚刚\";\n    return result;\n}\n\nfunction getDateTimeStamp(dateStr){\n return Date.parse(dateStr.replace(/-/gi,\"/\").replace(/T/gi,\" \"));\n}\n\nfunction getQuery(name)\n{\n    var reg = new RegExp(\"(^|&)\"+ name +\"=([^&]*)(&|$)\");\n    var r = window.location.search.substr(1).match(reg);\n    if (r!=null)\n        return decodeURI(r[2]);\n    return null;\n}\n\nfunction _ajax_request(url, data, callback, type, method) {\n    if (jQuery.isFunction(data)) {\n        callback = data;\n        data = {};\n    }\n    return jQuery.ajax({\n        type: method,\n        url: url,\n        data: data,\n        success: callback,\n        dataType: type\n        });\n}\n\njQuery.extend({\n    put: function(url, data, callback, type) {\n        return _ajax_request(url, data, callback, type, 'PUT');\n    },\n    delete_: function(url, data, callback, type) {\n        return _ajax_request(url, data, callback, type, 'DELETE');\n    }\n});\n\n//localStorage存值永久有效\nfunction setItems(name,item){\n    localStorage.setItem(name,JSON.stringify(item));\n}\n//localStorage取值\nfunction getItems(name){\n    var data = localStorage.getItem(name);\n    return data;\n}\n\n//localStorage删除指定键对应的值\nfunction deleteItem(name){\n    localStorage.removeItem(name);\n    console.log(localStorage.getItem(name));\n}\n\nfunction showHideBotDialog() {\n    var $dialog_bot_switch = $(\"#dialog-bot-switch\");\n    var $dialog_bot = $(\"#dialog-bot\");\n    if(!$dialog_bot_switch.hasClass('open')){\n        $dialog_bot_switch.addClass('open');\n        $dialog_bot.fadeIn();\n    }else{\n        $dialog_bot_switch.removeClass('open');\n        $dialog_bot.fadeOut();\n    }\n}\n\nfunction urlPara (v){\n    var url = window.location.search;\n    if (url.indexOf(v) != -1){\n        var start = url.indexOf(v)+v.length;\n        var end = url.indexOf('&',start) == -1 ? url.length : url.indexOf('&',start);\n        return url.substring(start,end);\n    } else { return '';}\n}\nvar conversationId = '';\nfunction queryByAgentId(agentI, isReset) {\n    var agentId = urlPara ('agentId=');\n    var checkBot = setInterval(function() {\n        var bot =  getBotById(agentId);\n        if(bot){\n            clearInterval(checkBot);\n            if(bot.avatar){\n                $(\"#dialog_img\").attr('src',bot.avatar);\n            }\n        }\n    }, 100);\n\n    var url = host + '/v1/Conversation/'+agentId + '/start';\n    if(isReset){\n        url = host + '/v1/Conversation/'+conversationId+'/reset';\n\n    }\n    $.ajax({\n        type: 'get',\n        url: url,\n        data: {},\n        success: function ( response ) {\n            conversationId = response;\n            var $dialog_bot = $(\"#dialog-bot\");\n            var $iframe = $dialog_bot.find('iframe');\n            $dialog_bot.attr('agentId',agentId);\n            var language = urlPara ('language=');\n            var src = '../voicecoin/index.html?conversationId='+conversationId+'&token='+localStorage.token+'&language='+language;\n            console.dir([$iframe]);\n            $iframe.attr('src',src);\n        },\n        timeout: 15000,\n        error: function ( response ) {\n\n        }\n    })\n}\n\nfunction getBotById(agentId){\n    var bot = null;\n    if(agentId && menuBots && menuBots.length > 0){\n        for(var i = 0;i < menuBots.length;i++){\n            if(agentId == menuBots[i].id){\n                bot = menuBots[i];\n                break;\n            }\n        }\n    }\n    return bot;\n}\n\nfunction reloadIframe(agentId , isReset){\n    queryByAgentId(agentId, isReset);\n}\n\n\nfunction changeURLPar(destiny, par, par_value)\n{\n    var pattern = par+'=([^&]*)';\n    var replaceText = par+'='+par_value;\n    if (destiny.match(pattern))\n    {\n        var tmp = '/\\\\'+par+'=[^&]*/';\n        tmp = destiny.replace(eval(tmp), replaceText);\n        return (tmp);\n    }\n    else\n    {\n        if (destiny.match('[\\?]'))\n        {\n            return destiny+'&'+ replaceText;\n        }\n        else\n        {\n            return destiny+'?'+replaceText;\n        }\n    }\n    return destiny+'\\n'+par+'\\n'+par_value;\n}\n\nfunction changeUrlArg(url, arg, val){\n    var pattern = arg+'=([^&]*)';\n    var replaceText = arg+'='+val;\n    return url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\\?]') ? url+'&'+replaceText : url+'?'+replaceText);\n}\n\n\nfunction addToUrl(obj){\n    var aprotocol = location.protocol;\n    var ahost = location.host;\n    var apath = location.pathname;\n    var asearch = location.search;\n    var ahash = location.hash;\n    var result = '';\n    console.log(obj);\n    var joinObj = function(joinObj_obj){\n        var result = '';\n        for(var i in joinObj_obj){\n            result += i + '=' + joinObj_obj[i];\n        }\n        return result;\n    };\n    var splitSearchToObj = function(str){\n        var resObj = {};\n        var arr = str.split('&');\n        for(var i = 0; i < arr.length; i++){\n            resObj[arr[i]] = arr[i];\n        }\n        return resObj;\n    };\n    var existObjKey = function(existObjKey_obj, str){\n        for(var i in existObjKey_obj){\n            if(i == str){\n                return true;\n            }\n        }\n        return false;\n    };\n    var objExtend = function(obj, obj){\n        var result = {};\n        for(var i in obj){\n            if(existObjKey(obj, i)){\n                result[i] = obj[i];\n            }else{\n                result[i] = obj[i];\n            }\n        }\n    };\n    if(asearch == ''){\n        console.log(obj);\n        result = aprotocol + '//' + ahost + apath + '?' + joinObj(obj) + ahash;\n    }else{\n        var oldSearchObj = splitSearchToObj(asearch.substr());\n        result = aprotocol + '//' + ahost + apath + joinObj(objExtend(oldSearchObj, obj)) + ahash;\n    }\n    return result;\n}\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });