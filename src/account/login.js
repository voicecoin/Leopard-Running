$(document).ready(function () {
  
  //enrollValidate('#formReg');

  $("#loginbtn").click(function(){
    login();
    /*var bootstrapValidator = $("#formReg").data('bootstrapValidator');
    bootstrapValidator.validate();
    if (bootstrapValidator.isValid()) {
      login();
    }*/
  });

  $("#goenroll").click(function(){
    window.location.href='enroll.html';
  });

   $("body").off("keyup").on('keyup',function(e){
    e.stopPropagation();
    if(e.keyCode == 13){
      var bootstrapValidator = $("#formReg").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (bootstrapValidator.isValid()) {
          login();
      }
    }
  });
  
  function login(){
    $.post('http://149.28.132.134:127/token', {username: $("#email").val(), password: $("#password").val()})
    .done(function (token) {
      localStorage.token = token;
      window.location.href = '/src/dashboard/dashboard.html';
    }).fail(function (xhr, status, error) {
      toastr.error("邮箱或密码错误");
    });
  }
  
  function enrollValidate(id){
    $(id).bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        userName: {
          validators: {
            notEmpty: {
              message: '请输入邮箱'
            }
          }
        },
        
        pw: {
          validators: {
            notEmpty: {
              message: '请输入密码'
            },
            stringLength: {
              min: 6,
              max: 30,
              message: '密码长度在6到30之间'
            }
          }
        }
      }
    });
  }

})