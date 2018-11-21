//判断是否已经登录
(function() {
  if (location.href.indexOf("login.html") === -1) {
    $.ajax({
      type: "get",
      url: "/employee/checkRootLogin",
      success: function(res) {
        // console.log(res);
        if (res.error === 400) {
          // 进行拦截, 拦截到登录页
          location.href = "login.html";
        }
        if (res.success) {
          console.log("已登录");
        }
      }
    });
  }
})();

$(document).ajaxStart(function() {
  // console.log("ajaxStart在开始一个ajax请求时触发");
  NProgress.start();
});
$(document).ajaxStop(function() {
  // console.log("ajaxStart在开始一个ajax请求时触发");
  //关闭进度条

  setTimeout(function() {
    NProgress.done();
  }, 500);
});

$(".icon_logout").click(function() {
  $("#myModal").modal("show");
});

$("#logoutBtn").click(function() {
  $.ajax({
    type: "get",
    url: "/employee/employeeLogout",
    success: function(info) {
      // console.log(info);
      if (info.success) {
        location.href = "login.html";
      }
    }
  });
});

//
$(".icon_menu").click(function() {
  $(".lt_main").toggleClass("ss");
  $(".lt_topbar").toggleClass("ss");
  $(".lt_aside").toggleClass("ss");
});
//
$(".category").click(function() {
  $(".child")
    .stop()
    .slideToggle("current");
});
