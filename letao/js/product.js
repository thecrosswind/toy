var currentPage = 1;
var pageSize = 2;

var picAddr = [];
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

  var ss = $('[name="brandId"]').val(id);
  // console.log(ss);
  $("#form")
    .data("bootstrapValidator")
    .updateStatus("brandId", "VALID");
});

$("#fileupload").fileupload({
  dataType: "json",
  //e：事件对象
  //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
  done: function(e, data) {
    // console.log(data);
    var ts = data.result;
    picAddr.unshift(ts);

    var picUrl = ts.picAddr;
    // console.log(picUrl);
    // console.log(picAddr);
    $("#imgBox").prepend(' <img src="' + picUrl + '" style="width: 100px;">');

    if (picAddr.length > 3) {
      picAddr.pop();
      $("#imgBox img:last-of-type").remove();
    }

    if (picAddr.length == 3) {
      $("#form")
        .data("bootstrapValidator")
        .updateStatus("picStatus", "VALID");
    }
  }
});

//表单验证
$("#form").bootstrapValidator({
  //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
  excluded: [],

  //2. 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: "glyphicon glyphicon-ok",
    invalid: "glyphicon glyphicon-remove",
    validating: "glyphicon glyphicon-refresh"
  },

  //3. 指定校验字段
  fields: {
    //校验用户名，对应name表单的name属性
    brandId: {
      validators: {
        notEmpty: {
          message: "请选择二级分类"
        }
      }
    },
    proName: {
      validators: {
        notEmpty: {
          message: "请输入商品名称"
        }
      }
    },
    proDesc: {
      validators: {
        notEmpty: {
          message: "请输入商品描述"
        }
      }
    },
    num: {
      validators: {
        notEmpty: {
          message: "请输入商品库存"
        },
        //正则校验, 非零(1-9)
        // \d  0-9
        // *    表示0次或多次
        // +    表示1次或多次
        // ?    表示0次或一次
        // {m,n}
        regexp: {
          regexp: /^[1-9]\d*$/,
          message: "商品库存必须是非零开头的数字"
        }
      }
    },
    size: {
      validators: {
        notEmpty: {
          message: "请输出商品尺码"
        },
        regexp: {
          regexp: /^\d{2}-\d{2}$/,
          message: "必须是xx-xx的格式, xx是两位数字, 例如: 36-44"
        }
      }
    },
    oldPrice: {
      validators: {
        notEmpty: {
          message: "请输入商品原价"
        }
      }
    },
    price: {
      validators: {
        notEmpty: {
          message: "请输入商品现价"
        }
      }
    },
    picStatus: {
      validators: {
        notEmpty: {
          message: "请上传3张图片"
        }
      }
    }
  }
});

$("#form").on("success.form.bv", function(e) {
  e.preventDefault();
  var formStr = $("#form").serialize();
  formStr += "&picName1 = "+picAddr[0].picName+" $picAddr1="+picAddr[0].picAddr;
  formStr += "&picName1 = "+picAddr[1].picName+" $picAddr1="+picAddr[1].picAddr;
  formStr += "&picName1 = "+picAddr[2].picName+" $picAddr1="+picAddr[2].picAddr;
  console.log(formStr);

   $.ajax({
     url: '/product/addProduct',
     type: 'post',
     data: formStr,
     dataType: 'json',
     success:function(info){
      // console.log(info);
        if(info.success){
           $("#productModal").modal("hide");

           currentPage = 1;
           render();
           $('form').data('bootstrapValidator').resetForm(true);
             $('[name="brandId"]').val('请选择二级分类');
             picAddr = [];
             $('#imgBox img').remove();
        }
     }
   })
});
