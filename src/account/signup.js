var host = 'http://149.28.132.134:127';
//var host = 'http://localhost:127';

$(document).ready(function(){

    //Animation init
    new WOW().init();


  $("#regButton").on('click',function(){
    submitEnroll();
  });


  function submitEnroll(){
    var data= {
      email: $("#email").val(),
      password: $('#password').val(),
      fullName: $('#fullName').val()
    };

      $.post(host + '/account', data).done(function (msg) {
        toastr.success("创建成功");
          setTimeout(function() {
            window.location.href = '/src/account/login.html';
      },
      2000);
          
      }).fail(function (xhr, status, error) {
        toastr.error(xhr.responseText);
      });
  }
});