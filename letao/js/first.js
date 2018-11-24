//
var currentPage = 1;
var pageSize = 5;
function render() {
  $.ajax({
    url: "/category/queryTopCategoryPaging",
    type: "get",
    data: {
      page: currentPage,
      pageSize: pageSize
    },
    dataType: "json",
    success: function(res) {
      // console.log(res);
      var htmlStr = template("firstTmp", res);
      $("tbody").html(htmlStr);
      $("#pagination").bootstrapPaginator({
        //设置版本号
        bootstrapMajorVersion: 3,
        // 显示第几页
        currentPage: res.page,
        // 总页数
        totalPages: Math.ceil(res.total / res.size),
        //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
        onPageClicked: function(a, s, e, page) {
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
  $("#firstModal").modal("show");
});

// 3. 表单校验功能
$("#form").bootstrapValidator({
  // 配置小图标
  feedbackIcons: {
    valid: "glyphicon glyphicon-ok", // 校验成功
    invalid: "glyphicon glyphicon-remove", // 校验失败
    validating: "glyphicon glyphicon-refresh" // 校验中
  },

  // 配置字段
  fields: {
    categoryName: {
      // 配置校验规则
      validators: {
        // 配置非空校验
        notEmpty: {
          message: "请输入一级分类名称"
        }
      }
    }
  }
});

$("#firstBtn").click(function() {
  if ($(".form-control").val() != 0) {
    $.ajax({
      url: "/category/addTopCategory",
      type: "post",
      data: $("#form").serialize(),
      dataType: "json",
      success: function(info) {
        // console.log(info);
        if (info.success) {
          $("#firstModal").modal("hide");
          currentPage = 1;
          render();
          $("#form")
            .data("bootstrapValidator")
            .resetForm(true);
        }
      }
    });
  }
});
