// 数字键盘遮罩层
var clicker,isFloat,i=0;
$(".t-keybord").mousedown(function(event) {
    $("#coverd").show();
    $("#t-keybord").show();
    clicker = $(this);
    var values = clicker.val();
    $(".numbers-txte").html(values);
    isFloat = $(this).attr("data-float");
});
// 点击关闭
$("body").on("click", "#t-close", function() {
    $("#coverd").hide();
    $("#t-keybord").hide();
    i=0;
});
// 点击清除
$("body").on("click", "#t-clear", function() {
    $(".numbers-txte").html("");
});
// 点击数字
$("body").on("mousedown", ".sum-btn-value", function() {
    var val ;
    if (i == 0) {
        val = "";
    }else {
        val = $(".numbers-txte").html();
    }
    var htm = $(this).html();
    if (!isNotEmpry(val) && htm == ".") {
        htm = "";
    }else if ((val == "0" || val == "0.0") && htm != ".") {
        val = "";
    } else if (val == "0.0" && htm == ".") {
        val = "0";
    }
    val += htm;
    if (clicker.attr("t-filter") == "int") {
        val = val.replace(/[^0-9]/g, '');
    }
    if (clicker.attr("t-filter") == "float") {
        val = val.replace(/[^0-9.]/g, '');
    }
    // var chang = $(".sum").html().length;
    val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两位个小数
    if (val.indexOf(".") < 0 && val != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val);
    }
    // if(val.length > chang){
    //     if (val.indexOf(".") == 2 ) {
    //         var result = val.substring(3, val.length - 1);
    //         if (isNotEmpry(result)) {
    //             val = val.substring(0, 2) +"."+ result;
    //         }
    //     }
    //     if (val.indexOf(".") == 3 ) {//12.85
    //         val = val.substring(0, 3);
    //     }
    // }
    // if (val <= $(".sum").html()) {
        $(".numbers-txte").html(val);
        i++;
    // }
});
//点击删除
$("body").on("click", "#t-del", function() {
    var val = $(".numbers-txte").html();
    if (val.length > 0) {
        val = val.substring(0, val.length - 1);
    }
    $(".numbers-txte").html(val);
});
// 点击确定
$("body").on("click", "#t-submit", function(event) {
    var valuer = $(".numbers-txte").html();
    // var isFloat = $(".isFloat").html();
    if (!isNotEmpry(valuer) ) {
        api.toast({
            msg: "请输入数量",
            duration: 2000,
            location: 'middle'
        });
    } else if (valuer == 0) {
        api.toast({
            msg: "数量不能为0",
            duration: 2000,
            location: 'middle'
        });
    }else {
        //商品是否允许小数，0允许，1禁止
        if (isFloat == 1) {
            var y = String(valuer).indexOf(".") + 1;
            if (y > 0) {
                api.toast({
                    msg: "不允许存在小数",
                    duration: 2000,
                    location: 'middle'
                });
                return;
            }
        }
        if (valuer.charAt(valuer.length - 1) == ".") {
            valuer += "0";
        }
        if (valuer.charAt(0) == ".") {
            valuer = "0" + valuer;
        }
        var varr = valuer.split("+");
        valuer = "";
        for (var s in varr) {
            varr[s] = parseFloat(varr[s]);
            if (isNaN(varr[s])) {
                valuer = "";
                api.toast({
                    msg: "请输入正确参数",
                    duration: 2000,
                    location: 'middle'
                });
                break;
            }
            if (s == 0) {
                valuer += varr[s];
            } else {
                valuer += "+" + varr[s];
            }
        }
        clicker.val(valuer);
        // if (isNotEmpry(attrList)) {
        if (is_activity == 1) {
            if ((Number(cart_num) + Number(valuer)) > Number(activity_num)) {
                var txt = "￥" + attr_price + "<del>￥" + attr_price + "</del>"
                $api.html($api.dom(".price"), txt);
            } else {
                var txt = "￥" + activity_price + "<del>￥" + attr_price+ "</del>"
                $api.html($api.dom(".price"), txt);
            }
          }
        // }
        $("#coverd").hide();
        $("#t-keybord").hide();
        i=0;
    }
});
