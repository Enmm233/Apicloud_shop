// 数字键盘遮罩层
var clicker, isFloat,id,attrs;

function keybord(obj,itemId,attr) {
    clicker = $(obj);
    var values = clicker.val();
    if (isNotEmpry(values) && values != 0) {
        $("#coverd").show();
        $("#t-keybord").show();
        $(".numbers-txte").html(values);
        isFloat = $(obj).attr("data-float");
        id = itemId;
        attrs = attr;
    }
}
// 点击关闭
$("body").on("click", "#t-close", function() {
    $("#coverd").hide();
    $("#t-keybord").hide();
});
// 点击清除
$("body").on("click", "#t-clear", function() {
    $(".numbers-txte").html("");
});

function sumBtnValue(obj) {
    var val = $(".numbers-txte").html();
    var htm = $(obj).html();
    if (!isNotEmpry(val) && htm == ".") {
        htm = "";
    } else if ((val == "0" || val == "0.0") && htm != ".") {
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
    // var chang = $(".sum2").html().length;
    val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两位个小数
    if (val.indexOf(".") < 0 && val != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val);
    }
    // if (val.length > chang) {
    //     if (val.indexOf(".") == 2) {
    //         var result = val.substring(3, val.length - 1);
    //         if (isNotEmpry(result)) {
    //             val = val.substring(0, 2) + "." + result;
    //         }
    //     }
    //     if (val.indexOf(".") == 3) {
    //         val = val.substring(0, 3);
    //     }
    // }
    // if (val <= $(".sum2").html()) {
        $(".numbers-txte").html(val);
        // i++;
    // }
}
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
    if (!isNotEmpry(valuer)) {
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
    } else {
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
        var attrId=0;
        if (isNotEmpry(attrs)) {
            attrId = attrs.id;
        }
        var timeStamp = timestamp();
        var sign = getSign("appid=" + $api.getStorage("appid") + "&attr_id=" + attrId + "&item_num=" + valuer + "&item_id=" + id + "&timeStamp=" + timeStamp);
        api.showProgress({
            title: '努力加载中...',
            modal: false
        });
        api.ajax({
            url: $api.getStorage("URL") + '/mobileOrder/changeNum',
            method: 'POST',
            headers: {
                   'Authorization': $api.getStorage('token')
                },
            returnAll:true,
            data: {
                values:{
                    appid: $api.getStorage("appid"),
                    active: 2,
                    attr_id:attrId,
                    item_num:valuer,
                    item_id:id,
                    timeStamp: timeStamp,
                    sign: sign
                }
            }
        },function(ret, err){
            if (ret) {
                var body = ret.body;
                var headers = ret.headers;
                if (isNotEmpry(headers.Authorization)) {
                    $api.setStorage('token', headers.Authorization);
                }
                if (body.code == 200) {
                    // $api.html($api.dom(".countNum"), body.data.countNum);
                    chengMoney(body.data)
                    getShopCratList();
                    // 判断是否显示价格 0否1是
                    if (body.data.is_look == 1) {
                      if(body.data.activity_type==1 && body.data.discount != 0){
                        $(".del").show()
                        var money = (body.data.countPrice-body.data.discount).toFixed(2)
                          $api.html($api.dom(".countPrice"), money);
                          $api.html($api.dom(".countDel"), body.data.countPrice);
                      }else{
                        $(".del").hide()
                        $api.html($api.dom(".countPrice"), body.data.countPrice);
                      }
                    } else {
                        $api.html($api.dom(".countPrice"), "***");
                    }
                    $("#coverd").hide();
                    $("#t-keybord").hide();
                    clicker.val(valuer);
                } else {
                    api.toast({
                        msg: body.msg,
                        duration: 2000,
                        location: 'middle'
                    });
                }
            } else {
                api.toast({
                    msg: JSON.stringify(err),
                    duration: 2000,
                    location: 'middle'
                });
            }
            api.hideProgress();
        });

    }
});
