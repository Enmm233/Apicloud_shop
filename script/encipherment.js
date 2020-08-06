// function jsonSort(jsonObj) {
//     let arr = [];
//     for (var key in jsonObj) {
//         arr.push(key)
//     }
//     arr.sort();
//     let str = '';
//     for (var i in arr) {
//         str += arr[i] + "=" + jsonObj[arr[i]] + "&"
//     }
//     return str.substr(0, str.length - 1)
// }

var kAppSecret = 'StJfzJcXmya6k6Ar';
// 得到参与加密数据，并以&拼接
function getSign(params) {
    if (typeof params == "string") {
        return paramsStrSort(params);
    } else if (typeof params == "object") {
        var arr = [];
        for (var i in params) {
            arr.push((i + "=" + params[i]));
        }
        return paramsStrSort(arr.join(("&")));
    }
}

// 对加密数据进行字典升序排序，得到加密数据
function paramsStrSort(paramsStr) {
    var url = paramsStr;
    var urlStr = url.split("&").sort().join("&");
    var newUrl = urlStr + kAppSecret;
    return md5(newUrl);
}


// 共用判断
function judgement(code, msg) {
    // alert(code)
    if (code == 401) {
        api.toast({
            msg: '请先登录',
            duration: 1000,
            location: 'middle'
        });
        setTimeout(function() {
            api.openWin({
                name: 'login',
                url: 'login.html',
                reload: true,
                slidBackEnabled: false
            });
        }, 2000);
        return false
    }
    if (code == 403) {
        api.toast({
            msg: '账号已禁用或审核中',
            duration: 2000,
            location: 'middle'
        });
        setTimeout(function() {
            api.openWin({
                name: 'login',
                url: 'login.html',
                reload: true,
                slidBackEnabled: false
            });
        }, 2000);
        return false
    }
    if (code == 400) {
        api.toast({
            msg: msg,
            duration: 2000,
            location: 'middle'
        });
        return false
    }
    if (code == 406) {
        // if (data_type == true) {
        //     api.toast({
        //         message: msg,
        //         duration: 1000,
        //         location: 'middle'
        //     });
        //     return false
        // } else {
        api.toast({
            message: "超过活动库存",
            duration: 1000,
            location: 'middle'
        });
        return false
            // }
    }
    if (code == 407) {
        api.toast({
            message: "超过限制数量",
            duration: 1000,
            location: 'middle'
        });
        return false
    }
}
