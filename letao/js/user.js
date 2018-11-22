//

var currentPage = 1;
var pageSize = 5;
var currentId = 0;
var isDelete;
function render() {
  $.ajax({
    url: "/user/queryUser",
    type: "get",
    data: {
      page: currentPage,
      pageSize: pageSize
    },
    dataType: "json",
    success: function(res) {
      console.log(res);
      var htmlStr = template("tmp", res);
      $("tbody").html(htmlStr);
      $(".pagination").bootstrapPaginator({
        //设置版本号
        bootstrapMajorVersion: 3,
        // 显示第几页
        currentPage: res.page,
        // 总页数
        totalPages: Math.ceil(res.total / res.size),
        //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
        onPageClicked: function(c, w, s, page) {
          // 把当前点击的页码赋值给currentPage, 调用ajax,渲染页面
          currentPage = page;
          render();
        }
      });
    }
  });
}

render();

$("tbody").on("click", ".btn", function() {
  $("#userModal").modal("show");

  currentId = $(this)
    .parent()
    .data("id");
  isDelete = $(this).text() == "禁用" ? 0 : 1;
});

$("#userBtn").click(function() {
  console.log(111);
  $.ajax({
    url: "/user/updateUser",
    type: "post",
    data: {
      id: currentId,
      isDelete: isDelete
    },
    dataType: "json",
    success: function(info) {
      // console.log(info);
      if (info.success) {
        $("#userModal").modal("hide");
        render();
      }
    }
  });
});
