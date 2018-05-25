var vm = new Vue({
  el: '#bots',
  data: {
    bots: []
  }
})

$(document).ready(function () {

  $.get(host + '/v1/Agents/MyAgents', function(data) {
    vm.bots = data.items;
  });

  /*$.get("head.html", function(data) {
    $('#header').html(data);
 }, "html");*/

  $("#name").focus(function(){
     $("#sn_img1").attr("src","images/zhuce_01_b.png");
  });
  $("#name").blur(function(){
    $("#sn_img1").attr("src","images/zhuce_01.png");
  });
  $("#description").focus(function(){
    $("#sn_img2").attr("src","images/zhuce_03_b.png");
  });
  $("#description").blur(function(){
    $("#sn_img2").attr("src","images/zhuce_03.png");
  });
});
  var bots = [];
  var currentBot=null;
  
  function delBot(id){
      $.ajax({
        url: host + '/v1/Agents/'+id,
        type: 'DELETE',
        data: {},
        success: function(json) {
          botsList();
           //console.dir(json);
        },error: function(e) {
              toastr.error(e,'fail');
        }
      });

  }
  //avatar
  function editBot(id){
      $.ajax({
        url: host + '/v1/Agents/'+id,
        type: 'GET',
        data: {},
        success: function(json) {
          currentBot=json;
          $("#modal_bot").modal('show');
             
              initBotInfo();
        },error: function(e) {
          currentBot=null;
              toastr.error(e,'fail');
        }
      });
  }
  
  
  var image = '';
  function selectImage(file){
    if(!file.files || !file.files[0]){
     return;
    }
    image = '';
  var reader = new FileReader();
  reader.onload = function(evt){
    document.getElementById('avatar').src = evt.target.result;
    image = evt.target.result;
    //updateBot();
    
    }
  reader.readAsDataURL(file.files[0]);
  }
  
  function openfile(){
    document.getElementById('file_image').click();
  }
  
    function createBot(){
        var $name = $("#name");
        var name = $name.val();
        var $description = $("#description");
        var description = $description.val();
        var isPublic = $("input[name='isPublic']:checked").val();
        if(!name){
            toastr.error('请输入机器人名称', '错误');
            return false;
        }
        var data={};
      data.name=name;
      data.description=description;
      data.published= isPublic == 1 ? true:false;
      data.userId=$("#loginUserNameDisplay").attr('userId');//$.cookie("userId");
      data.avatar=image;
      $.ajax({
        url: host + '/v1/Agents',
        type: "POST",
        datType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            toastr.success("创建成功",'ok');
            window.location.reload();
        },error: function(e) {
              toastr.error(e,'fail');
            }
      });
      
    }
    
    
    function updateBot() {
      var data = {};
           data.id = $("#updateId").val();
           data.name=$("#name").val();
         data.description=$("#description").val();
         data.isPublic=$('#isPublic').is(':checked')?1:0;
         data.avatar=image;
         $.ajax({
        url: host + '/v1/Agents/'+currentBot.id,
        type: "PUT",
        datType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            toastr.success("已更新",'ok');
            window.location.reload();
        },error: function(e) {
                 toastr.error(e,'fail');
            }
      });
    }

      


    function getBot(id){
      for (var i = 0; i < bots.length; i++) {
        if(bots[i].id==id){
          bots[i].avatar='';
          return bots[i];
        }
      }
      return null;
    }
    
    function editIntent(id){
      //id='f3123461-cdeb-4f0f-bdea-8b2c984115e8';
      console.log("id="+id);
      var currentBot=getBot(id);
      $.cookie("currentBot",JSON.stringify(currentBot),{"expires":1});
      
      window.location.href='intent.html?agentId='+id;
    }
    
    function editEntity(id){
      var currentBot=getBot(id);
      var s=JSON.stringify(currentBot);
      console.log(s);
      $.cookie("currentBot",JSON.stringify(currentBot),{"expires":1});
      window.location.href='entities.html?agentId='+id;
    }
    
    function testdialog(id){
    var currentBot=getBot(id);
    $.cookie("currentBot",JSON.stringify(currentBot),{"expires":1});
  $("#dialog-modal").dialog(
      {
        modal: true,
        height:500,
        title:currentBot.name+" 会话测试"
      }
    ); 
  
  $("#testtxt").off("keyup").on('keyup',function(e){
    var v=$(this).val().replace('&nbsp;','').replace(/\r\n/g,'').replace(/\n/g,'');
    if(e.keyCode == 13 ){
      if(v.length>0){
        sendTest();
      }
      return false;
    }
  });
  
  }
    
    
    
    
    function sendTest(){
      var testtxt=$("#testtxt").val();
      if(testtxt.length>0){
        
        var html='<div class="ui_right_right">';
        
        html+='<span>'+testtxt+'</span>';
        html+='<img  src="images/ui_10.jpg" />';
        html+='</div>';
        $("#testcontent").append(html);
        
        var currentBot=JSON.parse($.cookie("currentBot"));
        var url=host + "/v1/Conversation/Text?ClientAccessToken="+currentBot.clientAccessToken+"&SessionId="+currentBot.userId+"&Text="+testtxt;

              $.get(url, null, function (json) {
                  var html = '<div class="ui_right_mid">';

                  html += '<img  src="images/ui_06.jpg" />';
                  html += '<span>' + json + '</span>';
                  html += '</div>';
                  $("#testcontent").append(html);

                  console.log("$('#testcontent').height()=" + $('#testcontent').get(0).scrollHeight);
                  $('#testcontent').animate({ scrollTop: $('#testcontent').get(0).scrollHeight }, 300);
                  $("#testtxt").val('');
              }, 'text');
      }
    }


function showCreate(){
    var bot={};
    bot.id='';
    bot.name='';
    bot.description='';
    bot.isPublic=false;
    $("#modal_bot").modal('show');
    currentBot=bot;
    initBotInfo();
}

function initBotInfo() {
    if(currentBot.id.length==0){
        $("#start").html('+ 创建');
        $("#bottitle").html("创建聊天机器人");
    }else{
        $("#start").html('  保存');
        $("#bottitle").html("设置聊天机器人");
    }
    $("#updateId").val(currentBot.id);
    $("#name").val(currentBot.name);
    $("#description").val(currentBot.description);
    $('#isPublic:first').attr("checked", currentBot.isPublic);
    if(currentBot.avatar!=null)
        $('#avatar').attr("src", currentBot.avatar);
}