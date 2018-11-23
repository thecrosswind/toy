var currentPage = 1;
var pageSize = 2;
//
function render() {
  $.ajax({
    url: "/product/queryProductDetailList",
    type: "get",
    data: {
      page: currentPage,
      pageSize: pageSize
    },
    dataType: "json",
    success: function(res) {
      // console.log(res);
      var htmlStr = template("productTmp", res);
      $("tbody").html(htmlStr);
      $(".paginator").bootstrapPaginator({
        //设置版本号
        bootstrapMajorVersion: 3,
        // 显示第几页
        currentPage: res.page,
        // 总页数
        totalPages: Math.ceil(res.total / res.size),
        //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
        onPageClicked: function(a, s, w, page) {
          // 把当前点击的页码赋值给currentPage, 调用ajax,渲染页面
          currentPage = page;
          render();
        }
      });
    }
  });
}
render();

$("#addBtn").click(function() {
  $("#productModal").modal("show");

  $.ajax({
    url: "/category/querySecondCategoryPaging",
    type: "get",
    data: {
      page: 1,
      pageSize: 150
    },
    dataType: "json",
    success: function(info) {
      console.log(info);
      var htmlStr = template("dropdownTmp", info);
      $(".dropdown-menu").html(htmlStr);
    }
  });
});

$(".dropdown-menu").on("click", "a", function() {
  var ts = $(this).text();
  // console.log(ts);
  $("#ts").text(ts);

  var id = $(this).data("id");

  var ss = $('[name="categoryId"]').val(id);
  // console.log(ss);
});
