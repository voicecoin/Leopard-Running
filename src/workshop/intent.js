
var intents=[];
var intent=null;
var agentId=null;
var intentId=null;
//1 list 2 editor
var showModel=1;



function saveIntent(){
	genIntentData();
}

function genIntentData(){
	var $intentName = $("#intent-name");
	var intentName = $intentName.val();
	if(!intentName){
        jqueryAlert({
            'content' : '请输入意图名称'
        })
        return false;
	}
	var intentNow={};
    intentNow.agentId = agentId;
	intentNow.id=$("#intent-id").val();
	intentNow.name=$("#intent-name").val();
	if($("#tags_in").val().length>0)
		intentNow.contexts=$("#tags_in").val().split(",");
	else
		intentNow.contexts=[];
	intentNow.userSays=[];
	
	$.each($(".usersay"), function() {
        //console.log($(this).attr('id'));
        var usersay={};
        usersay.id=$(this).attr('id');
        usersay.intentId=intentNow.id;
		if(typeof(usersay.id)=="undefined"){
			usersay.id=''
		}
		usersay.text='';
		usersay.data=[];
        var texts=$(this).find(".usersaytext:first span");
        $.each(texts,function(){
        	var dataitem={};
        	if($(this).hasClass("isMeta")){
        		var metatexts=$(this).parent().parent().parent().find(".usersaymeta").children('div');
        		dataitem.alias=metatexts[0].innerHTML;
        		dataitem.meta=metatexts[1].firstChild.innerHTML;
        		dataitem.text=metatexts[2].innerHTML;
        		dataitem.color=metatexts[2].css('background-color');
        		if(dataitem.color==null){
        			dataitem.color='#FFCDF6';
        		}
        	}else{
        		dataitem.text=$(this).html();
        	}
        	usersay.text+=dataitem.text;
        	usersay.data.push(dataitem);
        	
        });
        intentNow.userSays.push(usersay);
        
    });  
	
	
	intentNow.responses=[];
	var response={};
	response.id=$("#responseId").val();
	response.intentId=intentId;
	if(response.intentId==null){
		response.intentId='';
	}
	response.affectedContexts=[];
	response.action=$("#action").val();


	if($("#tags_out").val().length>0){
		//console.log('$("#tags_out").val()='+$("#tags_out").val());
		var tarray=$("#tags_out").val().split(',');
		for(var i=0;i<tarray.length;i++){
			var t={};
			t.name=tarray[i].split('|')[0];
			t.lifespan=tarray[i].split('|')[1];
			response.affectedContexts.push(t);
		}
		
	}
	
	response.messages=[];
	
	$.each($("#replytable").find(".messagediv"),function(){
		var message={};
		message.id=$(this).attr('data-id');
		message.intentResponseId=$(this).attr('data-intentResponseId');
		message.type=$(this).attr('data-type');
		message.platform=$(this).attr('data-platform');
		message.speeches=[];
		$.each($(this).find(".speechdiv"),function(){
			message.speeches.push($(this).html());
		});
		response.messages.push(message);
	});
	
	response.parameters=[];
	

	$.each($(".parameterdiv"),function(){
		var parameter={};
		//parameter.isList=false;
		parameter.id=$(this).attr('id');
		if(parameter.id.indexOf('tmpparameter')>-1){
			parameter.id='';
		}
		parameter.name=$(this).find('.parameter-name:first').val();
		if(parameter.name.length==0){
			return true;
		}
		parameter.dataType=$(this).find('.parameter-dataType').val();
		parameter.value=$(this).find('.parameter-value').val();
		//parameter.defaultValue='';
		parameter.required=$(this).find('.parameter-required').is(':checked');
		parameter.prompts=JSON.parse($(this).find('.parameter-prompts').val());
		response.parameters.push(parameter);
	});

	intentNow.responses.push(response);
	console.dir(intentNow);

    if (intentNow.id.length > 0) {
        $.put(host + '/v1/Intents/' + intentNow.id, intentNow).done(function (json) {
            toastr.success("场景已保存", "ok");
            location.reload();
        }).fail(function (xhr, status, error) {
            jqueryAlert({
                'content' :error
            })
        });
    } else {
        $.post(host + '/v1/Intents/' + agentId, intentNow).done(function (json) {
            toastr.success("场景已保存", "ok");
            location.reload();
        }).fail(function (xhr, status, error) {
            jqueryAlert({
                'content' :error
            })
        });
    }
}


function showList(){
	showModel=1;
	$.get("/src/workshop/intentlist.html", function(data) {
        $('.ui_mid').html(data);
        loadIntents();
    }, "html"); 
}

function resetAgent(id){
	agentId=id;
	switch(showModel){
	case 1:
		loadIntents();
		break;
	case 2:
		showIntent();
		break;
	}
	loadRight();
}



function loadIntents(){
	initIntentsPage();
}

function initIntentsPage(){
	var key=$("#search").val();
	if(agentId!=null){
		$("#createIntent").off('click').on('click',function(){
			//showEntity('');
			showIntent('');
		});
		var url= host + '/v1/Intents/'+agentId+"/Query";
		if(key!=null && key.length>0){
			url+='?name='+key
		}
		$("#pageContainer").zPager({
			url:url,
			htmlBox: $('.list-group'),
			btnShow: false,
			dataRender: function(data){
				intents=data;
				initIntents();
			}
		});
	}
}

function initIntents(){
	var html='';
	if(intents && intents.length > 0){
        for(var i=0;i<intents.length;i++){
            html+='<li class="list-group-item ng-scope intent" id="'+intents[i].id+'"><a href="javascript:void(0)" class="name ng-binding">'+intents[i].name+'</a>';
            html+='<div class="ico-group right">';
            html+='<a class="ico-item del-icon" style="display:none"  href="javascript:void(0)"><span class="fa fa-trash-o" intent_id="'+intents[i].id+'"></span></a>';
            html+='</div></li>';
        }
        $(".list-group").html(html);
        $(".intent").off('click').on('click', function() {
            //alert("intent");
            showIntent($(this).attr('id'));
        });

        $(".intent").off('mouseenter').on('mouseenter', function() {
            $(this).find(".del-icon").show();
        });

        $(".intent").off('mouseleave').on('mouseleave', function() {
            $(this).find(".del-icon").hide();
        });

        $(".intent .del-icon").off('click').on('click', function(event) {
            event.stopPropagation();
            //alert("glyphicon-trash");
            var id = $(this).find("span.fa-trash-o").attr("intent_id");
            dialog = jqueryAlert({
                'title'   : '提示',
                'content' : '确定要删除吗？',
                'modal'   : true,
                'width'     : '300px',
                'height'     : '120px',
                'buttons' :{
                    '确定' : function(){
                        dialog.close();
                        delEntity(id);
                    },
                    '取消' : function(){
                        dialog.close();
                    }
                }
            })

        });
        $('#search').unbind();

        $('#search').bind('keyup', function(event) {
            if (event.keyCode == "13") {
                //回车执行查询
                initIntentsPage();
            }
        });
	}else{
		html += '<div style="font-size:14px;line-height: 30px;">';
		html += '<div><i class="fa  fa-gg-circle" style="font-size: 18px;margin: 0 5px 0 0;"></i>识别会话意图是聊天机器人最核心的一个能力，例如当用户说“明天天气如何？”或者“明天会下雨吗？”机器人就会识别出来这是一个“查询天气”的意图。当机器人正确识别意图之后，就可以给出相应的行动或者回复。</div>';
        html += '<div style="margin-top:10px;">你可以为机器人创建一系列的会话意图，并为每个意图添加若干句短语，我们的机器学习算法会教会机器人自动识别这些意图。</div>';
        html += '</div>';
        $(".list-group").parent().html(html);
	}
	
}

function delEntity(id){
    $.ajax({
        url: host + '/v1/Agents/'+id,
        type: "DELETE",
        datType: "JSON",
        contentType: "application/json",
        data: {},
        success: function () {
            toastr.success("删除成功",'ok');
            initIntents();
        },error: function(e) {
        	if(e && e.status == 200) {
                jqueryAlert({
                    'content' :e
                })
			}else{
                jqueryAlert({
                    'content' :'网络异常，请稍后再试。'
                })
			}
        }
    });
}

function intentEventHandle(){
	$("#intent-name").off("focus").on('focus',function(){
	    $("#intent-name-img").attr("src","/images/ui_03_b.jpg");
	    
	   // $(this).css("border-color", "#36A0FF");
	});
	
	$("#intent-name").off("blur").on('blur',function(){
	    $("#intent-name-img").attr("src","/images/ui_03.jpg");
	   // $(this).css("border-color", "transparent");
	    
	});

	/*$("#tags_in_tag").off("focus").on('focus',function(){
        $("#intent-state-img").attr("src","/images/ui_09_b.jpg");
    });
    $("#tags_in_tag").off("blur").on('focus',function(){
        $("#intent-state-img").attr("src","/images/ui_09.jpg");
    });

    $("#tags_out_tag").off("focus").on('focus',function(){
        $("#intent-state-img").attr("src","/images/ui_09_b.jpg");
    });
    $("#tags_out_tag").off("blur").on('focus',function(){
        $("#intent-state-img").attr("src","/images/ui_09.jpg");
    });*/
	
	$("#action").off("focus").on('focus',function(){
	    $("#action-img").attr("src","/images/ui_17_b.jpg");
	});
	
	$("#action").off("blur").on('blur',function(){
	    $("#action-img").attr("src","/images/ui_17.jpg");
	});
	$("#replyname").off("focus").on('focus',function(){
	    $("#replyname-img").attr("src","/images/ui_19_b.jpg");
	});
	
	
	$("#replyname").off("blur").on('blur',function(){
	    $("#replyname-img").attr("src","/images/ui_19.jpg");
	});
	$(".usersaytext").off("focus").on('focus',function(){
		console.log(".usersaytext");
	    $("#ui_Image1").attr("src","/images/ui_09_b.jpg");
	});
	
	$(".usersaytext").off("blur").on('blur',function(){
		$("#ui_Image1").attr("src","/images/ui_09.jpg")
	});
	
	$("#replyname").off("keyup").on('keyup',function(e){
		e.stopPropagation();
		if(e.keyCode == 13){
			if($(this).val().length>0){
				
				var speechDom=$(".messagediv");
				
				speechDom.append(genSpeechHTML($(this).val()));
				
				/*var speech={
                    "id":"",
                    "intentResponseId":"",
                    "speech":[$(this).val()],
                    "type":"Text",
                    "platform":0
                };
				var html=addSpeech(speech);
				$("#replytable").append(html);*/
				$(this).val('');
				messageEventHandler();
			}
		}
	});
	
	
	$(".template-editor-holder").off("blur").on('blur',function(){
		var v=$(this).html().replace('&nbsp;','').replace(/\r\n/g,'').replace(/\n/g,'');
		if(v.length==0){
			$(this).html('');
		}else{
			
		}
	});
	

	$(".template-editor-holder").off("click").on('click',function(){
		
		
		//$(this).css('border-left','3px solid #37a0e1');
		
		console.log('$(this).attr("contenteditable")='+$(this).attr("contenteditable"));
		var v=$(this).html().replace('&nbsp;','').replace(/\r\n/g,'').replace(/\n/g,'');
		console.log("v="+v);
		console.log("v.length="+v.length);
		//console.log("sizeof(v="+sizeof(v,'utf-8'));
		if(v.length==0){
			$(this).html('&nbsp;');
			var p =$(this).get()[0];//document.getElementById($(this).attr('id')) ,
		    s = window.getSelection(),
		    r = document.createRange();
			r.setStart(p, 0);
			r.setEnd(p, 0);
			s.removeAllRanges();
			s.addRange(r);
		}else{
			
		}
		
		
		
		//var div = document.getElementById('addUserSay');
		//setTimeout(function() {
		//	div.focus();
		//}, 0);
		
		//$(this).trigger('focusin');
		
		//#37a0e1
		//border: 3px solid #37a0e1;
	});
	
	$("#addUserSay").off("blur").on('blur',function(){
		//$(this).html("&nbsp;");
		$(this).val("");
		$(this).css('border-left','0px solid #37a0e1');
		$("#ui_Image1").attr("src","/images/ui_09.jpg")
		//#37a0e1
		//border: 3px solid #37a0e1;
	});
	
	$("#addUserSay").off("focus").on('focus',function(){
		$("#ui_Image1").attr("src","/images/ui_09_b.jpg")
	})

	$("#addUserSay").off("keyup").on('keyup',function(e){
		var v=$(this).val().replace('&nbsp;','').replace(/\r\n/g,'').replace(/\n/g,'');
		if(e.keyCode == 13){
			e.preventDefault();
			//e.preventDefault();
            var repeat = checkUsersayRepeat(v);
            if(repeat){
                jqueryAlert({
                    'content' :'提问内容已经存在'
                })
            	return false;
			}
			if(v.length==0){
                jqueryAlert({
                    'content' :'请输入用户提问'
                })
				$(this).val("");
			}else{
				var isLoading = false;
				if(isLoading) {
					return false;
				}
                $(this).val("");
                isLoading = true;
				$.ajax({
					url: host + '/v1/Intents/Markup?text='+v,
					type: "GET",
					datType: "JSON",
					contentType: "application/json",
					data: {},
					success: function (json) {
                        isLoading = false;
						//toastr.success("保存成功",'ok');
						//$(this).html('&nbsp;');
						var userSay={};
						userSay=json;
                        userSay.id='';
						var userSaysHtml=addUserSay(userSay);
						$(".usersaystable").append(userSaysHtml);
						usersayEventHandler();
						$("#addUserSay").val("");
					},error: function(e) {
                        isLoading = false;
						//toastr(e,'fail');
					}
				});
			}
			return true;
		}
	});
	
	usersayEventHandler();
	parameterEventHandler();
	messageEventHandler();
}

function checkUsersayRepeat(text){
	var repeat = false;
	$("#collapseTwo .usersay").each(function () {
		var $this = $(this);
		var usersaytext = $this.find(".usersaytext > span").html();
		if(text == usersaytext){
            repeat = true;
		}
    });
	return repeat;
}

function messageEventHandler(){
	
	$(".delspeech").off("click").on('click',function(e){
		console.log(".delspeech");
		$(this).parent().parent().remove();
	});
	
	/*$(".delspeech").off("click").on('click',function(){
		console.log(".delspeech");
		$(this).parent().parent().remove();
	});*/
	
}

function parameterEventHandler(){
	$(".parameter-name").off("input propertychange").on('input propertychange',function(e){
		$(this).parent().parent().find(".parameter-value:first").val("$"+$(this).val());
	});
	
	
	$(".parameter-dataType").off("input propertychange").on('input propertychange',function(e){
		console.log(".parameter-dataType="+$(this).attr('id'));
		autoCompleteEntity($(this).attr('id'),$(this).val());
	});
	
	$(".parameter-dataType").off("focus").on('focus',function(e){
		console.log(".parameter-dataType="+$(this).attr('id'));
		autoCompleteEntity($(this).attr('id'),'');
	});
	
	$(".parameter-required").off("change").on('change',function(e){
		console.log($(this).is(':checked'));
		if($(this).is(':checked')){
			//$(this).parent().parent().parent().find(".parameter-prompts:first").removeAttr("disabled"); 
			$(this).parent().parent().parent().find(".parameter-prompts:first").show();
		}else{
			$(this).parent().parent().parent().find(".parameter-prompts:first").hide();
			//var jparameterprompts=$(this).parent().parent().parent().find(".parameter-prompts:first").parent().hide();
			//jparameterprompts.attr("disabled",true); 
		}
		hideOrShowPrompts();
	});
	
	$(".parameter-prompts").off("focus").on('focus',function(e){
		var parent=$(this).parent().parent().parent();
		var parametername=parent.find(".parameter-name:first").val();
		var parameterdataType=parent.find(".parameter-dataType:first").val();
		var parametervalue=parent.find(".parameter-value:first").val();
		var parameterprompts=parent.find(".parameter-prompts:first").val();
		if(parameterprompts.length==0){
			parameterprompts=[];
		}
		var parameterid=parent.attr("id");
		nowParameterPrompts.id=parameterid;
		nowParameterPrompts.parametername=parametername;
		nowParameterPrompts.parameterdataType=parameterdataType;
		nowParameterPrompts.parametervalue=parametervalue;
		nowParameterPrompts.parameterprompts=JSON.parse(parameterprompts);
		initParameterPrompts();
	});
	
	$(".ppdiv").off("mouseover").on('mouseover',function(){
		 $(this).find('.iconcontainer').removeClass("uhide");
	});
	$(".ppdiv").off("mouseout").on('mouseout',function(){
		console.log(".ppdiv mouseout");
		 $(this).find('.iconcontainer').addClass("uhide");
	});
	$(".delparameter-prompts").off("click").on('click',function(){
		 $(this).parent().parent().find('.parameter-prompts:first').val('[]');
	});
	
	
	var $list=$("#parameters");
	$list.sortable({
		opacity: 0.6,
		revert: true,
		cursor: 'pointer',
		handle: '.m_drag'
	});
	
	
	var $list1 = $("#intent-param-prompts-editor");
	$list1.sortable({
		opacity: 0.6,
		revert: true,
		cursor: 'pointer',
		handle: '.m_drag',
		update: function(){
			
				resetNumber($("#intent-param-prompts-editor"));
			
		}
	});
}



var nowParameterPrompts={};

function initParameterPrompts(){
	$("#prompt-name").val(nowParameterPrompts.parametername);
	$("#prompt-datatype").val(nowParameterPrompts.parameterdataType);
	$("#prompt-value").html(nowParameterPrompts.parametervalue);
	var html='';
	for(var i=0;i<nowParameterPrompts.parameterprompts.length;i++){
		html+='<div class="prompt-row">';
		html+='<div class="prompt-cell prompt-cell-first">';
		html+=(i+1);
		html+='</div>';
		html+='<div class="prompt-cell prompt-cell-second">';
		html+='<div class="borderless" contenteditable="true" onkeydown="enter_parameter_prompt(this,event)" onkeyup="create_parameter_prompt(this,event)" placeholder="输入提示语句…">'+nowParameterPrompts.parameterprompts[i]+'</div>';
		html+='</div>';
		html+='<div class="prompt-cell prompt-cell-actions">';
		html+='<a href="javascript:void(0)" class="ico-item" style="display: none;"><span class="fa fa-trash-o ui-sortable-handle"></span></a>';
		html+='<a class="visible-on-hover prompt-remove" href="javascript:void(0)" onclick="prompt_remove_rows(this)" style="display: none;"><span class="fa fa-trash-o"></span></a>';
		html+='</div>';
		html+='</div>';
	}
	$("#ownParameterId").val(nowParameterPrompts.id);
	$(".intent-param-prompts-editor").html(html);
	
	create_empty_prompt();
	$("#default-window-box .title").html("为\""+nowParameterPrompts.parametername+"\"添加提示语");
	$("#default-window-box").show();
	$(".close").off("click").on('click',function(e){
		$("#default-window-box").hide();
	});
	
    $("#intent-param-prompts-editor").off("mouseover").on("mouseover",".prompt-row",function() {
		$(this).find(".prompt-cell-actions a").css("display", "inline-block");
	});
    $("#intent-param-prompts-editor").off("mouseout").on("mouseout",".prompt-row",function() {
		$(this).find(".prompt-cell-actions a").css("display", "none");
	});
	
    $("#prompt-datatype").off("focus").on("focus",function(){
    	autoCompleteEntity($(this).attr('id'), '');
    });
    
    
    $("#close_default_window").off('click').on('click',function(){

    	$("#"+nowParameterPrompts.id).find(".parameter-name:first").val($("#prompt-name").val());
    	$("#"+nowParameterPrompts.id).find(".parameter-value:first").val($("#prompt-value").html());
    	if ($(".default-window-box").find("#intent-param-prompts-editor").length > 0) {
            //保存强制参数为空时，回复提醒
            var _prompt_param = $(".default-window-box .prompt-cell-second").find(".borderless");
            var tmpprompts = [];
            $.each(_prompt_param, function(m, n) {
                if ($(n).html() != "") {
                	tmpprompts.push($(n).html());
                }
            });
            
            if (tmpprompts.length > 0) {
            	$("#"+nowParameterPrompts.id).find(".parameter-prompts:first").val(JSON.stringify(tmpprompts));
            } else {
            	$("#"+nowParameterPrompts.id).find(".parameter-prompts:first").val("[]");
            }
        }
    	$("#default-window-box").hide();
    }
    );
}

function prompt_remove_rows(obj) {
    var _this = $(obj).parents(".prompt-table");
    $(obj).parents(".prompt-row").remove();
    if(_this.attr("id") == "intent-param-prompts-editor"){
        resetNumber($("#intent-param-prompts-editor"));
    }
}

function create_empty_prompt(){
	var content = "<div class=\"prompt-row\">";
	content += "<div class=\"prompt-cell prompt-cell-first\"></div>";
	content += "<div class=\"prompt-cell prompt-cell-second\">";
	content += "<div class=\"borderless\" contenteditable=\"true\" onkeydown=\"enter_parameter_prompt(this,event)\" onkeyup=\"create_parameter_prompt(this,event)\" placeholder=\"输入提示语句...\"></div></div>";
	content += "<div class=\"prompt-cell prompt-cell-actions\">";
	content += "<a href=\"javascript:void(0)\" class=\"ico-item\"><span class=\"fa fa-trash-o\"></span></a>";
	content += "<a class=\"visible-on-hover prompt-remove\" href=\"javascript:void(0)\" onclick=\"prompt_remove_rows(this)\">";
	content += "<span class=\"fa fa-trash-o\"></span></a></div></div>";
	$("#intent-param-prompts-editor").append(content);
	resetNumber($("#intent-param-prompts-editor"));
}

function create_parameter_prompt(obj, event, type) {
    var _i = $(obj).parents(".prompt-row").find(".prompt-cell-first").html();
	var e = event || window.event;
	if($.trim($(obj).html()) != ""){

		var sum = $("#intent-param-prompts-editor .prompt-row").size();
		
		if($(obj).parents(".prompt-row").index()+1 == sum){
			create_empty_prompt();
			
		}
	}
}
function enter_parameter_prompt(obj,event,type){
	e = event || window.event;
	if($.trim($(obj).html()) == "" && e.keyCode == 13){
		$(obj).html("").focus();
		e.preventDefault();
	}else if($.trim($(obj).html()) != ""){
		if(e.keyCode == 13 && e.shiftKey == false){
			e.preventDefault();
			$(obj).parents(".prompt-row").next(".prompt-row").find(".borderless").focus();
		}
	}
}
function resetNumber(obj){
    var len = obj.find(".prompt-row").size();
    for(var i =0;i<len;i++){
        obj.find(".prompt-row").eq(i).find(".prompt-cell-first").html(i+1);
    }
}

function hideOrShowPrompts(){
	var showOrHide=null;
	$(".parameter-required").each(function(){
		if(showOrHide==null){
			showOrHide=$(this).is(':checked');
		}else{
			showOrHide=(showOrHide || $(this).is(':checked'));
		}
		
		
	});
	console.log("showOrHide="+showOrHide);
	if(showOrHide){
		$(".ppdiv").removeClass('uhide');
	}else{
		$(".ppdiv").addClass('uhide');
	}
	
}


function usersayEventHandler(){
	$(".usersay").off("click").on('click',function(){
		$(".usersayentity").addClass('uhide');
		 $(this).find('.usersayentity').removeClass('uhide');
	});
	
	
	$(".delusersayicon").off("click").on('click',function(){
		$(this).parent().parent().parent().remove();
	});
	
	
	$(".delusersaymetaicon").off("click").on('click',function(){
		$(this).parent().parent().parent().remove();
	});
	
	$(".usersay").off("mouseover").on('mouseover',function(){
		 $(this).find('.iconcontainer').removeClass("uhide");
	});
	$(".usersay").off("mouseout").on('mouseout',function(){
		
		 $(this).find('.iconcontainer').addClass("uhide");
	});
	
	
	
	$(".usersayentity .entityselect").off("click").on('click',function(e){
		
		var key=$(this).children('span').get(0).innerHTML;
		console.log("key="+key);
		key=key.replace('@','');
		if(key.length>1){
			var id=$(this).parent().parent().parent().attr('id');
			setTimeout("autoCompleteEntity('"+id+"','"+key+"')",200);
		}
		
	});
	
	var $list=$(".usersaystable");
	$list.sortable({
		opacity: 0.6,
		revert: true,
		cursor: 'pointer',
		handle: '.m_drag'
	});

}

function autoCompleteEntity(id,key){
	$.get(host + '/v1/Entities/'+agentId+'/Query?name='+key, function(json){
		initAutoCompleteDiv(id,json.items);
	})
}


function setValueToInput(id,value){
	if(id.indexOf("pd")>-1){
		$("#"+id).val(value);
	}else if(id.indexOf("prompt-datatype")>-1){
		$("#"+id).val(value);
		var nowParameterId=$("#ownParameterId").val();
		$("#pd"+nowParameterId).val(value);
	}else{
		var t=$("#"+id).find('.entityselect:first').children('span').get(0);
		t.innerHTML="@"+value;
	}
	
	$(".select-entity-menu").remove();
}
	
	
function initAutoCompleteDiv(id,data){
	if(data.length==0){
		return;
	}
	var _left=0;
	var _top=0;
	//参数类型
	if(id.indexOf("pd")>-1){
		_left=$("#"+id).offset().left;
		_top=$("#"+id).offset().top+20;
	}else if(id.indexOf("prompt-datatype")>-1){
		_left=$("#"+id).offset().left;
		_top=$("#"+id).offset().top+20;
	}else{
		_left=$("#"+id).offset().left+300;
		_top=$("#"+id).offset().top+120;
	}
	

	var html='<div class="select-entity-menu" style="left: '+_left+'px; top:'+_top+'px;">';
	html+='<ul class="select-menu">';
	html+='<div class="select-head">';
	html+='<input id="filterParam" type="text" placeholder="Filter..." class="filterParam" value="" name=""></div>';
	html+='<ul class="menu-list">';
	for(var i=0;i<data.length;i++){
		html+='<li><a href="javascript:void(0)" class="filterItem" onclick="setValueToInput(\''+id+'\',\''+data[i].name+'\');">'+data[i].name+'</a></li>';
	}
	html+='</ul>';
	
	html+='</ul>';
	html+='</div>';
	//$(".ui_mid").append(html);
	$(".select-entity-menu").remove();
	$("body").append(html);
	$(".select-entity-menu").off('click').on('click',function(e){
		var e = e || window.event;
		e.stopPropagation();
	});
	
	$("#filterParam").off("input propertychange").on('input propertychange', function () {
		$(".filterItem").each(function(){
			if($(this).html().indexOf($("#filterParam").val())>-1){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
	});
	$("body").off("click").on('click',function(e){
		$(".select-entity-menu").remove();
	});
}

function createIntent(){
	var intent={};
	intent.id='';
	intent.name='';
	intent.agentId=agentId;
	
	intent.contexts=[];
	intent.responses=[];
	intent.userSays=[];
	initIntent(intent);
	intentEventHandle();
}

function showIntent(id){
	console.log("showIntent");
	showModel=2;
	$.get("/src/workshop/intenteditor.html", function(data) {
        $('.ui_mid').html(data);
        loadIntent(id);
    }, "html"); 
}

function loadIntent(id){
	//alert(id);
	if(id==null || id.length==0){
		createIntent();
	}else{
		 var data={};
		 data.agentId = agentId;
		 intentId=id;
		 data.intentId =id;// '059a2116-6b02-47b7-9b74-1f40fd4d68cf';//id;
		 var self=this;

		$.ajax({
			url: host + '/v1/Intents/'+id,
			type: 'GET',
			data: {},
			success: function(json) {
				self.intent=json;
				initIntent(self.intent);
				intentEventHandle();
			},error: function(e) {
				self.entity=null;
                jqueryAlert({
                    'content' :e
                })
			}
		});

/*
		 $.post('https://api.yaya.ai/api/Intents/GetIntent', data,function(json) {
			 //console.log(json)
			 self.intent=json;
			 initIntent(self.intent);
			 intentEventHandle();
		 });*/
	}
	
}

function addUserSay(userSay){
	 var userSaysHtml='';

	 var datahtml='';
	 var metaarray=[];
	 if(userSay && userSay.data){
         var data=userSay.data;
         for(var j=0;j<data.length;j++){

             datahtml+='<span';
             if(data[j].meta!=null){
                 datahtml+=' class="isMeta" style="background-color:'+data[j].color+'"';
                 metaarray.push(data[j]);
             }
             datahtml+='>';
             datahtml+=data[j].text;
             datahtml+='</span>';
         }
	 }
	 
	 userSaysHtml+='<div class="ub ub-ver usersay" id="'+userSay.id+'">';
	 userSaysHtml+='<div  class="ub" style="width:100%;min-height:40px;height:auto;margin-bottom: -1px; border: 1px solid rgb(221, 221, 221);">';
		 userSaysHtml+='<div class="ub ub-ver ub-ac ub-pc" style="width:10%">';
		 userSaysHtml+='<i class="fa ng-scope fa-quote-right" style="color: #b7bbc4;"></i>';
		 userSaysHtml+='</div>';
		 userSaysHtml+='<div class="ub ub-ver ub-pc template-editor-holder usersaytext" contenteditable="" placeholder="Add User expression" style="width:80%;word-wrap: break-word;word-break: break-all;">'+datahtml+'</div>';
		 userSaysHtml+='<div class="ub ub-ver ub-ac ub-pc uhide iconcontainer" style="width:10%">';
//		 userSaysHtml+='<a href="javascript:void(0)" class="ico-item"><span class="fa fa-trash-o"></span></a>';
		 userSaysHtml+='<a href="javascript:void(0)" class="ico-item delusersayicon"><span class="fa fa-trash-o del_icon"></span></a>';
		 userSaysHtml+='</div>';
	 userSaysHtml+='</div>';
	 
	 if(metaarray.length>0){
		 userSaysHtml+='<div class="ub usersayentity ub-ver uhide">';
		 userSaysHtml+='<div class="ub" style="background: #f4f5f5;height:40px;color: #9399a6;">';
		 userSaysHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:30%">';
		 userSaysHtml+='名称';
		 userSaysHtml+='</div>';
		 userSaysHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:30%">';
		 userSaysHtml+='类型';
		 userSaysHtml+='</div>';
		 userSaysHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:30%">';
		 userSaysHtml+='取值';
		 userSaysHtml+='</div>';
		 userSaysHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:10%">';
		 userSaysHtml+='</div>';
		 userSaysHtml+='</div>';
		 for(var n=0;n<metaarray.length;n++){
			 userSaysHtml+='<div class="ub usersaymeta" style="background: #f8f8f8;min-height:40px;height:auto;color: #9399a6;">';
			 userSaysHtml+='<div class="ub ub-f1 ub-ac ub-pc template-editor-holder " contenteditable="" style="width:30%;word-wrap: break-word;word-break: break-all;">';
			 userSaysHtml+=metaarray[n].alias;
			 userSaysHtml+='</div>';
			 userSaysHtml+='<div class="ub ub-f1 ub-ac ub-pc entityselect"  style="width:30%"><span style="background-color:rgb(255, 205, 246)">';
			 userSaysHtml+=metaarray[n].meta;
			 userSaysHtml+='</span></div>';
			 userSaysHtml+='<div class="ub ub-f1 ub-ac ub-pc"  style="width:30%">';
			 userSaysHtml+=metaarray[n].text;
			 userSaysHtml+='</div>';
			 userSaysHtml+='<div class="ub ub-f1 ub-ac ub-pc"  style="width:10%">';
			 userSaysHtml+='<a href="javascript:void(0)" class="ico-item no-result delusersaymetaicon" style="display: inline;"><span class="glyphicon glyphicon-remove"></span></a>';
			 userSaysHtml+='</div>';
			 userSaysHtml+='</div>';
		 }
		 userSaysHtml+='</div>';
	 }
	 userSaysHtml+='</div>';
	 return userSaysHtml;
}

function addParameter(){
	var parametersHtml=genParameter(null);
	$("#parameters").append(parametersHtml);
	//intentEventHandle();
	parameterEventHandler();
}

function genParameter(parameter){
	 if(parameter==null){
		 parameter={};
		 //parameter.isList=false;
		 parameter.name='';
		 parameter.dataType='';
		 parameter.value=[];
		 //parameter.defaultValue='';
		 parameter.required=true;
		 parameter.prompts=[];
		 var date=new Date();
		 parameter.id='tmpparameter'+date.getTime();
	 }
	 var parametersHtml='';
	 parametersHtml+='<div id="'+parameter.id+'"class="ub parameterdiv" style="width:100%;background: #f8f8f8;min-height:40px;height:auto;color: #9399a6;">';
	 parametersHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:10%;word-wrap: break-word;word-break: break-all;">';
	 parametersHtml+='<div class="checkbox checkbox-primary checkbox-single">';
	 
	 if(parameter.required){
		 parametersHtml+='<input type="checkbox" class="parameter-required" checked="checked" aria-label="Single checkbox Two">';
	 }else{
		 parametersHtml+='<input type="checkbox" class="parameter-required" aria-label="Single checkbox Two">';
	 }
	 
	 
	 parametersHtml+='<label style="height:15px;"></label>';
	 parametersHtml+='</div>';
	 parametersHtml+='</div>';
	 parametersHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:16%">';
	 parametersHtml+='<input type="text" class="parameter-name" value="'+parameter.name+'" placeholder="添加参数名称...">';
	 parametersHtml+='</div>';
	 
	 parametersHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:16%">';
	 parametersHtml+='<input type="text" id="pd'+(parameter.id)+'" class="entityselect parameter-dataType" value="'+parameter.dataType+'" placeholder="选择类型...">';
	 parametersHtml+='</div>';
	 
	 parametersHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:16%">';
	 parametersHtml+='<input type="text" class="parameter-value" value="'+parameter.value+'" placeholder="添加参取值...">';
	 parametersHtml+='</div>';
	 
	 
	 //parametersHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:16%">';
	 //parametersHtml+='<input type="text" class="parameter-defaultValue" value="'+(parameter.defaultValue==null?'':parameter.defaultValue)+'" placeholder="添加默认值...">';
	 //parametersHtml+='</div>';
	 
	 parametersHtml+='<div class="ub ub-f1 ub-ac ub-pc ppdiv" style="width:16%">';
	 
	 parametersHtml+='<div class="ub ub-f1 ub-ac ub-pc" style="width:80%">';
	 var showprompts=JSON.stringify(parameter.prompts==null?"[]":parameter.prompts);
	 parametersHtml+="<input type='text' class='parameter-prompts' value='"+showprompts+"' placeholder='添加提示...'>";
	 parametersHtml+='</div>';
	 
	 parametersHtml+='<div class="ub ub-f1 ub-ac ub-pc iconcontainer uhide" style="width:20%;">';
//	 parametersHtml+='<a href="javascript:void(0)" class="ico-item"><span class="fa fa-trash-o"></span></a>';
	 parametersHtml+='<a href="javascript:void(0)" class="ico-item delparameter-prompts"><span class="fa fa-trash-o del_icon"></span></a>';
	 parametersHtml+='</div>';
	 
	 parametersHtml+='</div>';
	 
	 
	 parametersHtml+='</div>';
	 return parametersHtml;
}

function initIntent(intent){
	
	
	
	 $("#intent-id").val(intent.id);
	 $("#intent-name").val(intent.name);
	 
	 var tags_in_value='';
	 if(intent && intent.contexts && intent.contexts.length > 0){
         for(var i=0;i<intent.contexts.length;i++){
             tags_in_value+=intent.contexts[i];
             if(i!=(intent.contexts.length-1)){
                 tags_in_value+=',';
             }
         }
	 }

	 $('#tags_in').val(tags_in_value);
	 $('#tags_in').tagsInput({width:'100%',defaultText:'添加输入状态',height:'auto',hide:false,autosize:true,leftNumHide:true});
	 $('#tags_in').setEditModel(false);
	 $('#tags_in').setEditModel(true);
	 
	 
	 
	 $("#tags_in_tag").off('keyup').on('keyup',function(e){
			if(e.keyCode == 13){
				var values=$("#tags_in").val().split(',');
				if(values.length>0){
					 var lastEnter=values[values.length-1];
					 var newOutValue=lastEnter+"|5";
					 $('#tags_out').addTag(newOutValue,{focus:true,unique:true});
					 $('#tags_out_tag').trigger('focus');
				 }
			}
     });

	 	
	 
	 
	 var tags_out_value='';
	 var affectedContexts='';
	 if(intent.responses.length>0){
		 affectedContexts=intent.responses[0].affectedContexts;
		 for(var i=0;i<affectedContexts.length;i++){
			 var t=affectedContexts[i];
			 tags_out_value+=t.name+"|"+t.lifespan;
			 if(i!=(affectedContexts.length-1)){
				 tags_out_value+=',';
			 }
		 }
	 }

	 $('#tags_out').val(tags_out_value);
	 $('#tags_out').tagsInput({width:'100%',defaultText:'添加输出状态',height:'auto',hide:false,autosize:true,leftNumHide:false});
	 $('#tags_out').setEditModel(false);
	 $('#tags_out').setEditModel(true);
	 
	 var userSays=intent.userSays;
	 var userSaysHtml='';
	 for(var i=0;i<userSays.length;i++){
		 var userSay=userSays[i];
		 userSaysHtml+=addUserSay(userSay);
	 }
	 $(".usersaystable").html(userSaysHtml);
	 
	 
		
	 if(intent.responses.length>0){	
	 	 $("#action").val(intent.responses[0].action);
	 	 $("#responseId").val(intent.responses[0].id);
	 	
	 }
	 var parametersHtml='';
	 if(intent.responses.length>0){	
		 var parameters=intent.responses[0].parameters;
		
		 for(var i=0;i<parameters.length;i++){
			 
			 parametersHtml+=genParameter(parameters[i]);
			 
		 }
	 }
	 
	 $("#parameters").html(parametersHtml);
	 
	 var speechhtml='';
	 var tmpmessage=null;
	 if(intent.responses.length>0){
		 var speech=intent.responses[0].messages;
		 if(speech.length>0){
			 for(var i=0;i<speech.length;i++){
				 speechhtml+=addSpeech(speech[i]);
			 } 
		 }else{
			 tmpmessage={};
			 tmpmessage.id='';
			 tmpmessage.intentResponseId='';
			 tmpmessage.type='text';
			 tmpmessage.platform='';
			 tmpmessage.speeches=[];			 
		 }
	 }else{
		 tmpmessage={};
		 tmpmessage.id='';
		 tmpmessage.intentResponseId='';
		 tmpmessage.type='text';
		 tmpmessage.platform='';
		 tmpmessage.speeches=[];			
	 }
	 
	 if(tmpmessage!=null){
		 speechhtml+=addSpeech(tmpmessage);
	 }
	 
	 $("#replytable").html(speechhtml);	 
		 
	 /*$("#entity_id").val(entity.id);
	 $("#entity-name").val(entity.name);
	 for(var i=0;i<entity.entries.length;i++){
		 addEntry(entity.entries[i],i);
	 }
	 entityEventHander();*/
}

function genSpeechHTML(speech){
	var speechhtml='<div class="ub" style="margin-bottom: -1px;border: 1px solid rgb(221, 221, 221);">';
	speechhtml+='<div class="ub ub-ver ub-pc template-editor-holder speechdiv"  contenteditable="" placeholder="输入机器人回复" data-distinguish="true" style="width:90%;">'+speech+'</div>';
	speechhtml+='<div class="ub ub-ver ub-ac ub-pc" style="width:10%">';
	speechhtml+='<a href="javascript:void(0)" class="ico-item no-result delspeech"><span class="fa fa-trash-o del_icon"></span></a>';
	speechhtml+='</div>';
	speechhtml+='</div>';
	return speechhtml;
}

function addSpeech(speech){
	var speechhtml='';
	speechhtml+='<div data-id="'+speech.id+'" data-intentResponseId="'+speech.intentResponseId+'" data-type="'+speech.type+'" data-platform="'+speech.platform+'" class="ub ub-ver messagediv" style="width:100%;height:auto;margin-bottom: -1px;">';

	if(speech && speech.speeches && speech.speeches.length > 0 ){
        for(var i=0;i<speech.speeches.length;i++){

            speechhtml+=genSpeechHTML(speech.speeches[i]);
            /*speechhtml+='<div class="ub">';
            speechhtml+='<div class="ub ub-ver ub-pc template-editor-holder speechdiv" contenteditable="" placeholder="输入机器人回复" data-distinguish="true" style="width:90%;">'+speech.speech[i]+'</div>';
            speechhtml+='<div class="ub ub-ver ub-ac ub-pc" style="width:10%">';
            speechhtml+='<a href="javascript:void(0)" class="ico-item no-result delspeech" style="display: inline;"><span class="fa fa-trash-o del_icon"></span></a>';
            speechhtml+='</div>';
            speechhtml+='</div>';*/
        }
	}
	speechhtml+='</div>';
    return speechhtml;
}


$(document).ready(function(){ 
	agentId=getQuery('agentId');
	if(agentId!=null){
		showList();
  }
  
	loadRight();
	loadLeft();
});

function loadRight(){
	$.get("/src/workshop/bottest.html", function(data) {
        $('.ui_right').html(data);
    }, "html");
}

function loadLeft(){
	$.get("/src/workshop/left.html", function(data) {
        $('#leftmenu').html(data);
        loadBots();
    }, "html"); 
}