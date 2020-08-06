var kAppSecret = 'cqwappcode';
//
function getSign(params) {
    if (typeof params == "string") {
        return paramsStrSort(params);
    } else if (typeof params == "object") {
        var arr = [];
        for (var i in params) {
            arr.push((i + "=" + params[i]));
        }
        return paramsStrSort(arr.join(("///")));
    }
}

//
function paramsStrSort(paramsStr) {
    var url = paramsStr;
    var urlStr = url.split("///").sort().join("///");
    var newUrl = urlStr + '///key=' + kAppSecret;
    newUrl = encodeURIComponent(newUrl);
    return hex_md5(newUrl);
}
