var dialog;
var entity=null;
var agentId=null;
var entityId=null;
var showModel=1;
var totalIndex=0;
function delEntity(id){
    $.ajax({
        url: host + '/v1/Entities/'+id,
        type: "DELETE",
        datType: "JSON",
        contentType: "application/json",
        data: {},
        success: function () {
            toastr.success("删除成功",'ok');
            //window.location.reload();
            initPage();
        },error: function(e) {
            jqueryAlert({
                'content' :e
            })
        }
    });
	/*$.delete(host + '/v1/Entities/'+id, function(){
		toastr.success("删除成功",'ok');
	})*/
}

function showEntity(id){
	showModel=2;
	entityId=id;
	$.get("entityeditor.html", function(data) {
        $('.ui_mid').html(data);
        loadEntity(entityId);
    }, 'html'); 
}

function cacheEntityEntries(data){
	var currentEntries=entity.entries;
	for(var j=0;j<data.length;j++){
		var exsitFlag=false;
		var t=data[j];
		if(currentEntries.length>0){
			for(var i=0;i<currentEntries.length;i++){
				if(t.id==currentEntries[i].id){
					currentEntries[i]=t;
					exsitFlag=true;
					break;
				}
			}
		}
		if(!exsitFlag){
			currentEntries.push(t);
		}
	}

}

function delEntityEntriesFromCache(id){
	var currentEntries=entity.entries;
	for(var i=0;i<currentEntries.length;i++){
		if(id==currentEntries[i].id){
			currentEntries.splice(i,1);
			break;
		}
	}
}

function initEntititesPage(id){
	if(id!=null && id.length>0){
		$("#pageContainer1").show();
		var url=host + "/v1/EntityEntries/"+id+"/Query";
		$("#pageContainer1").zPager({
			url:url,
			htmlBox: $('#entity-editor'),
			btnShow: false,
			dataRender: function(data){
				initEntityEntries(data);
				updateSynonyms();
			}
		});
	}else{
		$("#pageContainer1").hide();
	}

}

function loadEntity(id){
	//alert(id);
	if(id.length==0){
		$("#save_btn").show();
		entity={};
		entity.id='';
		entity.name='';
		entity.entries=[{id:'',value:'',synonyms:[]},{id:'',value:'',synonyms:[]},{id:'',value:'',synonyms:[]},{id:'',value:'',synonyms:[]},{id:'',value:'',synonyms:[]}];
		initEntity(entity);
	}else{
         $("#save_btn").hide();   
		 var self=this;
	      $.ajax({
	    	  url: host + '/v1/Entities/'+id,
	    	  type: 'GET',
	    	  data: {},
	    	  success: function(json) {
	    		  self.entity=json;
				  initEntity(self.entity);
				  self.entity.entries=[];
				  initEntititesPage(self.entity.id);
	    	  },error: function(e) {
	    		  self.entity=null;
                  jqueryAlert({
                      'content' :e
                  })
	    	  }
	    });

	}
	
}

function initEntityEntries(entries){
	$("#entity-editor").empty();

	for(var i=0;i<entries.length;i++){
		totalIndex+=1;
		console.log("index="+(totalIndex));
		addEntry(entries[i],totalIndex);
	}
	entityEventHander();
}

function initEntity(entity){
	 $("#entity_id").val(entity.id);
	 $("#entity-name").val(entity.name);
	 if(!entity.isEnum){
		 $(".ng-empty-synonyms").toggleClass("ng-checked",true);
		 $("#synonyms-data").val("1");
		 $(".alert-operation-tip").show();
	 }else{
		 $(".ng-empty-synonyms").removeClass("ng-checked",false);
		 $("#synonyms-data").val("0");
		 $(".alert-operation-tip").hide();
	 }
	 if(entity.entries!=null && entity.entries !== undefined && entity.entries.length>0){
		for(var i=0;i<entity.entries.length;i++){
			addEntry(entity.entries[i],i);
		}
		entityEventHander();
	 }
	 
}


function removeTagCallBack(obj){
	console.dir(obj);
	updateEntryEntities(obj.parent().parent());
}

function updateEntryEntities(entryDom){
	//var entryDom=obj.parent().parent().parent().parent();
	
	var id=entryDom.attr('data-id');
	var jid=entryDom.attr('id');
	
	//新增条目
	var data={};
	var t=$("#"+jid).find(".entryname:first").val();
	if(t.length>0){
		data.value=t;
		data.synonyms=[];
		if($("#synonyms-data").val()==1){
			console.log("synonyms-data="+$("#"+jid).find(".tags:first").val());
			data.synonyms=$("#"+jid).find(".tags:first").val().split(',');
		}
		if(id.length==0){
			$.ajax({
		    	  url: host + '/v1/EntityEntries/'+entity.id,
		    	  type: 'POST',
		    	  data: JSON.stringify(data),
		    	  datType: "JSON",
	    		  contentType: "application/json",
		    	  success: function(json) {
		    		  //entity.name=$("#entity-name").val();
		    		  //toastr.success('','fail');
		    		  console.log(json);
		    		  entryDom.attr("data-id",json)
		    		  toastr.success('已同步','ok');
		    	  },error: function(e) {
		    		  //currentBot=null;
                    jqueryAlert({
                        'content' :e
                    })
		    	  }
		    	});
		}else{
			data.id=id;
			//更新条目
			$.ajax({
		    	  url: host + '/v1/EntityEntries/'+id,
		    	  type: 'PUT',
		    	  data: JSON.stringify(data),
		    	  datType: "JSON",
	    		  contentType: "application/json",
		    	  success: function(json) {
		    		  console.log(json);
		    		  toastr.success('已同步','ok');
		    	  },error: function(e) {
		    		  //currentBot=null;
                    jqueryAlert({
                        'content' :e
                    })
		    	  }
		    });
		}
		
	}
	
	
	
	console.log('entityentityid='+$(this).parent().parent().parent().parent().attr('data-id'));
}


function entityEventHander(){
	$("#inner-header").off("click").on('click','#save_btn',function(){
		submitEntity();
	});
	
	$("#entity-name").off("blur").on("blur",function(){
		if(entity.id.length>0){
			if($(this).val()!=entity.name && $(this).val().length>0){
				  var data={};
				  data.id=entity.id;
				  data.name=$(this).val();
				  
			      $.ajax({
			    	  url: host + '/v1/Entities/'+entity.id,
			    	  type: 'PUT',
			    	  data: JSON.stringify(data),
			    	  datType: "JSON",
		    		  contentType: "application/json",
			    	  success: function(json) {
			    		  entity.name=$("#entity-name").val();
			    		  toastr.success('已同步','ok');
			    	  },error: function(e) {
                          jqueryAlert({
                              'content' :e
                          })
			    	  }
			    	});
			}
		}
	});
	
	
	
	
	$(".realinput").off("keyup").on("keyup",function(e){
		if(e.keyCode == 13){
			//已有的词库
			if(entity.id.length>0){
				updateEntryEntities($(this).parent().parent().parent().parent());
			}
		}
	});

	//校验词条名称
	$('#entity-name').off("input propertychange").on('input propertychange', function () {
        var s = $(this).val();
       	if($.trim(s) != "") {
			if(isNumberOr_Letter(s) == false){
				$(this).css("border-color", "#f76949").next("div").show().find("font").html("实体名称只能包含中文、字母、数字、中划线及下划线");
			}else{
				$(this).css("border-color", "#36A0E1").next("div").hide();
			}
        }else{
        	$(this).css("border-color", "#36A0E1").next("div").hide();
        }
    });
	
	//显示同义词或者不显示
	$(".ng-empty-synonyms").off("click").on('click',function(e){
		e.stopPropagation();
		$(this).toggleClass("ng-checked");
		//定义同义词显示的样式
		$(".entity_from").toggleClass("entity_from_noChk");
		if($(this).hasClass("ng-checked")){
			$("#synonyms-data").val("1");
			$(".alert-operation-tip").show();
			//operare_entity._fnShowStyle();
		}else{
			$("#synonyms-data").val("0");
			$(".alert-operation-tip").hide();
			//$(".entry-value-input").removeAttr("readonly");
		}
		if(entity.id.length>0){
			var newsynony=($("#synonyms-data").val()==1);
			//if(newsynony!=entity.isEnum){
				//entity.isEnum=newsynony;
				var data={};
				data.id=entity.id;
				data.name=$("#entity-name").val();
                data.isEnum = newsynony ? "False" : "True";
				$.ajax({
					url: host + '/v1/Entities/'+entity.id,
					type: 'PUT',
					data: JSON.stringify(data),
					datType: "JSON",
					contentType: "application/json",
					success: function(json) {
						showEntity(entity.id);
						toastr.success('已同步','ok');
					},error: function(e) {
                        jqueryAlert({
                            'content' :e
                        })
					}
				});
			//}
		}




	});
	
	//隐藏创建词条提示
	$(".alert-operation-tip").off('click', '.close').on('click', '.close',function () {
		$(".alert-operation-tip").hide();
    });
	//条目鼠标移进
	$(".entry").off("mouseenter").on('mouseenter',function(){
		 $(this).find('.ico-item').show();
	});
	
	//条目鼠标移除
	$(".entry").off("mouseleave").on('mouseleave',function(){
		 $(this).find('.ico-item').hide();
	});
	
	//点我编辑
	$("#entity-editor").off('click','.entry').on('click','.entry',function(){
		//如果是新建的
		$("#entity-editor").find(".entry").each(function(){
			$('#tags_'+$(this).attr('id').replace('entry_','')).setEditModel(false);
	    });
		var id=$(this).attr('id');
		//alert(id);
		$("#"+id).css('height','auto');
		var tag_id=$(this).find('.tags:first').attr('id');
		if($("#synonyms-data").val()==1){
			$('#'+tag_id).setEditModel(true);
		}else{
			$('#'+tag_id).setEditModel(false);
		}
		
		if($(this).find('.entryname:first').val().length==0){
			$(this).find('.entryname:first').focus();
		}
		
	});
	
	//关键字输入框失去焦点
	$(".entryname").off('focusout').on('focusout',function(){
		if($(this).val().length>0 && $("#synonyms-data").val()==1){
			var entityId=$(this).parent().parent().attr('id');
			$('#tags_'+entityId.replace('entry_','')).importTags($(this).val());
		}
	});
	
	$('.entryname').off("input propertychange").on('input propertychange', function () {
		if($("#synonyms-data").val()==0 && $(this).val().indexOf('@')>-1){
				var key=$(this).val().substring($(this).val().indexOf('@'),$(this).val().length);
				if(key.length>1){
					key=key.replace('@','');
					setTimeout("autoCompleteEntity('"+$(this).attr('id')+"','"+key+"')",1000);
				}
				
		}
	});
	
	$(".entryname").off('keyup').on('keyup',function(e){
		console.log('keyup');
		if(e.keyCode == 13){
			if($(this).val().length==0){
				toastr.success("请输入关键字",'fail');
			}else{
				$(this).parent().parent().find("input:last").focus();
			}
		}
	});

	//删除条目
	$("#entity-editor .del_icon").off('click').on('click',function(){
		console.log('data-id'+$(this).parent().parent().parent().attr('data-id'));
		$(this).parent().parent().parent().remove();
		delEntryEntities($(this).parent().parent().parent().attr('data-id'));
	});

	//新增或修改条目
	$("#entity-editor .upload_icon").off('click').on('click',function(){
		console.log('upload_icon data-id'+$(this).parent().parent().parent().attr('data-id'));

		//已有词库
		if(entity.id.length>0){
			
			updateEntryEntities($(this).parent().parent().parent());
			
			
			/*var nowEntry=$(this).parent().parent().parent();
			var entry={};
			var t=nowEntry.find(".entryname:first").val();
			if(t.length>0){
				entry.id=nowEntry.attr('data-id');
				entry.value=t;
				entry.synonyms=[];
				if($("#synonyms-data").val()==1){
					entry.synonyms=nowEntry.find(".tags:first").val().split(',');
				}
			}
			if(entry.id.length==0){
				//新增条目
				$.ajax({
					url: host + '/v1/EntityEntries/'+entity.id,
					type: 'POST',
					datType: "JSON",
					contentType: "application/json",
					data: JSON.stringify(entry),
					success: function(json) {
						$("#pageContainer1").zPager('pageData',$("#pageContainer1"),$("#pageContainer1").find(".current").attr("page-id"));
						toastr.success("条目已保存","ok");
					},error: function(e) {
						//self.entity=null;
						jqueryAlert({
							'content' :e
						})
					}
				});
			}else{
				//修改条目
				$.ajax({
					url: host + '/v1/EntityEntries/'+entry.id,
					type: 'PUT',
					datType: "JSON",
					contentType: "application/json",
					data: JSON.stringify(entry),
					success: function(json) {
						toastr.success("条目已保存","ok");
						$("#pageContainer1").zPager('pageData',$("#pageContainer1"),$("#pageContainer1").find(".current").attr("page-id"));
						//$("#pageContainer1").find(".current").trigger('click');
					},error: function(e) {
						//self.entity=null;
						jqueryAlert({
							'content' :e
						})
					}
				});
			}
*/

		}else{
			//新词库不做处理统一保存
		}
		//$(this).parent().parent().parent().remove();
		//delEntryEntities($(this).parent().parent().parent().attr('data-id'));
	});
}

/**
 * 删除指定条目
 * */
function delEntryEntities(id){
	delEntityEntriesFromCache(id);
	$.ajax({
		url: host + '/v1/EntityEntries/'+id,
		type: "DELETE",
		datType: "JSON",
		contentType: "application/json",
		data: {},
		success: function () {
            jqueryAlert({
                'content' :'删除成功'
            })
		},error: function(e) {
            jqueryAlert({
                'content' :e
            })
  	  	}
	});
}


/**
 * @出filter
 * */
function autoCompleteEntity(id,key){
	$.get(host + '/v1/Entities/'+agentId+'/Query?name='+key, function(json){
		initAutoCompleteDiv(id,json.items);
	})
}


/**
 * filter点选设置值
 * */
function setValueToInput(id,value){
	//alert("setValueToInput");
	$("#"+id).val(value);
	$(".select-entity-menu").remove();
}

/**
 * 生成filter窗口
 * */
function initAutoCompleteDiv(id,data){
	if(data.length==0){
		return;
	}
	var _left=$("#"+id).offset().left+60;
	var _top=$("#"+id).offset().top;
	var html='<div class="select-entity-menu" style="left: '+_left+'px; top:'+_top+'px;">';
	html+='<ul class="select-menu">';
	html+='<div class="select-head">';
	html+='<input id="filterParam" type="text" placeholder="Filter..." class="filterParam" value="" name=""></div>';
	html+='<ul class="menu-list">';
	for(var i=0;i<data.length;i++){
		html+='<li><a href="javascript:void(0)" class="filterItem" onclick="setValueToInput(\''+id+'\',\''+data[i].name+'\');">'+data[i].name+'</a></li>';
	}
	html+='</ul>';
	html+='<div class="add-box">';
	html+='<a href="javascript:void(0)" onclick="createNewEntity()" id="createNewEntity" class="create-new">';
	html+='<span class="flaticon stroke plus"></span>创建新词库</a>';
	html+='</div>';
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

/**
 * 同义词点选事件处理
 * */
function updateSynonyms(){
	if($("#synonyms-data").val()==1){
		$(".tags").each(function(){
			var id=$(this).attr('id');
			$(this).removeAttr('disabled');
			$("#"+id).setEditModel(true);
		});
	}else{
		$(".tags").each(function(){
			var id=$(this).attr('id');
			console.log("id="+id);
			$("#"+id).importTags('');
			$("#"+id).setEditModel(false);
			$(this).attr('disabled', true);
		 });
	}
}


/**
 * 添加一行
 * */
function addRow(){
	//entity.entries.push({id:'',value:'',synonyms:[]});
	var tmpEntry={id:'',value:'',synonyms:[]};
	totalIndex+=1;
	addEntry(tmpEntry,totalIndex);
	entityEventHander();
}

/**
 * 生成单行条目
 * */
function addEntry(entry,idIndex){
	
	var tagsValue='';
	if(entry.synonyms.length>0){
		for(var j=0;j<entry.synonyms.length;j++){
			tagsValue+=entry.synonyms[j].synonym || '';
			if(j!=entry.synonyms.length-1){
				tagsValue+=',';
			}
		}
	}
	
	var html='';
	
	
	
	html+='<div id="entry_'+idIndex+'" data-id="'+entry.id+'" class="ub entry" style="min-height: 40px;height:auto;margin-bottom: -1px;border: 1px solid #ddd;">';
	
	
	
	
	if(entry.synonyms.length==0 && entry.value.length==0){
		//html+='<div id="entry_'+i+'_new" class="ub ub-ver ub-ac ub-pc" style="width:100%"></div>';
	}
	//html+='<div id="entry_'+i+'_update">';
	html+='<div class="ub ub-ver ub-ac ub-pc" style="width:5%"></div>';
	html+='<div class="ub ub-ver ub-ac ub-pc" style="width:10%">';
	html+='<input id="ui_input_'+idIndex+'" data-auto="0" class="input-lg form-input entryname" type="text" placeholder="添加关键字" value="'+entry.value+'">';
	html+='</div>';
	html+='<div class="ub ub-ver ub-ac ub-pc" style="width:70%">';
	html+='<input id="tags_'+idIndex+'" type="text" class="tags" value="'+tagsValue+'" placeholder="点击这里进入编辑"/>';
	html+='</div>';
	html+='<div class="ub ub-ver ub-ac ub-pc icodiv" style="width:15%">';
	html+='	<a href="javascript:void(0)" class="ico-item no-result"><span class="glyphicon glyphicon-upload upload_icon"></span></a>'
	html+='	<a href="javascript:void(0)" class="ico-item no-result"><span class="fa fa-trash-o del_icon"></span></a>';
	//html+='</div>';
	html+='</div>';
	html+='</div>';
	
	$("#entity-editor").append(html);
	
	$('#tags_'+idIndex).tagsInput({width:'100%',defaultText:'按回车(Enter)添加同义词',height:'auto',hide:false,autosize:true});
	$('#tags_'+idIndex).setEditModel(false);
	//$('tags_'+i+'_tagsinput').show();
	//$('tags_'+i+'_tagsinput').hide();
}


function showList(){
	showModel=1;
	$.get("entitylist.html", function(data) {
        $('.ui_mid').html(data);
        $("#createEntity").on('click',function(){
    		//alert("#createEntity");
    		showEntity('');
    	});
		initPage();
    },'html');
}



function initPage(){
	var key=$("#search").val();
	if(agentId!=null){
		var url=host + "/v1/Entities/"+agentId+"/Query";
		if(key!=null && key.length>0){
			url+='?name='+key
		}
		$("#pageContainer").zPager({
			url:url,
			htmlBox: $('.list-group'),
			btnShow: false,
			dataRender: function(data){
				initEntities(data);
		    }
		});
	}
}

/*
 function loadMoreEntities(){
 console.log('pageNo='+pageNo+",pageSize="+pageSize+",totalNum="+totalNum);
 if(pageNo*pageSize>totalNum){

 }else{
 loadEntities($("#search").val(),(pageNo+1));
 }
 }
function loadEntities(key,pno){
	if(agentId!=null){
		var url=host + "/v1/Entities/"+agentId+"/Query";
		if(key!=null && key.length>0){
			url+='?name='+key+"&page="+pno;
		}else{
			url+='?page='+pno;
		}
		var self=this;
		$.get(url, null,function(json) {
			self.pageNo=json.page;
			self.totalNum=json.total;
			self.pageSize=json.size;
			self.entities=json.items;
	  	    initEntities(self.pageNo>1);
			
		});

	}
	
}
*/
function startSearch(){
	initPage();
}

function initEntities(entities){
	var html='';
	if(entities && entities.length > 0){
        for(var i=0;i<entities.length;i++){
            html+='<li class="list-group-item ng-scope entity" id="'+entities[i].id+'"><a href="javascript:void(0)" class="name ng-binding">'+entities[i].name+'</a>';
            html+='<div class="ico-group right">';
            html+='<a class="ico-item del-icon" style="display:none;    margin-top: 8px;"  href="javascript:void(0)"><span class="fa fa-trash-o" entity_id="'+entities[i].id+'"></span></a>';
            html+='</div></li>';
        }
        $(".list-group").html(html);

        $(".entity").off('click').on('click', function() {
            showEntity($(this).attr('id'));
        });

        $(".entity").off('mouseenter').on('mouseenter', function() {
            $(this).find(".del-icon").show();
        });

        $(".entity").off('mouseleave').on('mouseleave', function() {
            $(this).find(".del-icon").hide();
        });

        $(".entity .del-icon").off('click').on('click',function(event) {
        	var $this = $(this);
            event.stopPropagation();
            dialog = jqueryAlert({
                'title'   : '提示',
                'content' : '确定要删除吗？',
                'modal'   : true,
               	'width'     : '300px',
               'height'     : '120px',
                'buttons' :{
                    '确定' : function(){
                        var id =$this.find(".fa-trash-o").attr("entity_id");
                        dialog.close();
                        delEntity(id);
                    },
                    '取消' : function(){
                        dialog.close();
                    }
                }
            })
        });

	}else {
        html += '<div style="font-size:14px;line-height: 30px;">';
        html += '<div><i class="fa  fa-gg-circle" style="font-size: 18px;margin: 0 5px 0 0;"></i>用户词库是用户定义的便于机器人识别的一系列关键词及它们的近义词，同时对关键词进行了分类，这个分类我们就叫“实体”。例如在一个“查询天气”的意图识别场景中，我们可以创建“温度”，“穿着”这些实体，温度这个实体下包含的关键词可能有：“冷”，“热”，“暖和”等；而穿着这个实体下可能包含：“外套”，“裙子”，“短袖”，“棉裤”等关键词。</div>';
        html += '<div style="margin-top:10px;">实体以及它对应的关键词是机器人执行动作的必要参数，只有识别了实体以及对应关键词，机器人才能正确的帮我们执行某一项任务。例如当用户说：查询明天上海的天气，机器人会识别出来“明天”这个关键词属于“日期”这个实体，“上海”这个关键词属于“地点”这个实体，机器人知道了日期和地点，自然就能查询到天气的结果。\n</div>';
        html += '</div>';
        $("#wrapper").parent().html(html);
	}






}

function submitEntity(){
	//alert('submitEntity');
	var data={};
	var apiurl="";
	data.id=$("#entity_id").val();
	if($("#entity_id").val().length==0){
		apiurl=host + '/v1/Entities/'+agentId;
		//data.id=$("#entity_id").val();
		data.name=$("#entity-name").val();
		if(data.name.length==0){
            jqueryAlert({
                'content' :'词库名称不能为空'
            })
			return;
		}
	}else{
		data.entityId=$("#entity_id").val();
	}

	data.entries=[];
    data.isEnum = ($("#synonyms-data").val() == 1) ? "False" : "True";
	$("#entity-editor").find(".entry").each(function(){
		var entry={};
		var t=$(this).find(".entryname:first").val();
		if(t.length>0){
			entry.value=t;
			entry.synonyms=[];
			
			if($("#synonyms-data").val()==1){
				entry.synonyms=$(this).find(".tags:first").val().split(',');
			}
			data.entries.push(entry);
		}
    });
	//新增
	if($("#entity_id").val().length==0){
		if(data.entries.length>0)
		{
			data.agentId =agentId;
			$.post(apiurl, data, function(){
				toastr.success("保存成功",'ok');
				location.reload();
			})
		}else{
            jqueryAlert({
                'content' :'请添加关键字'
            })
		}
	}else{
		//对比name

		//对比同义词checkBox

		//如果同义词有继续对比是否有修改的条目
	}

	
}

function loadRight(){
	$.get("bottest.html", function(data) {
        $('.ui_right').html(data);
    }, 'html');
}
function loadLeft(){
	$.get("left.html", function(data) {
        $('#leftmenu').html(data);
        loadBots();
    }, 'html'); 
}

function resetAgent(id){
	agentId=id;
	switch(showModel){
	case 1:
		initPage();
		break;
	case 2:
		loadEntity(entityId);;
		break;
	}
	loadRight();
}

$(document).ready(function(){ 
	agentId=getQuery('agentId');
	showList();
	loadLeft();
	loadRight();
});