/*
 *    连点两次退出APP
 *    @Author: zcy
 */
function ExitApp() {
    var ci = 0;
    var time1, time2;
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        if (ci == 0) {
            time1 = new Date().getTime();
            ci = 1;

            api.toast({
                msg: '再按一次返回键退出'
            });
        } else if (ci == 1) {
            time2 = new Date().getTime();
            if (time2 - time1 < 3000) {
                api.closeWidget({
                    id: api.appId,
                    retData: {
                        name: 'closeWidget'
                    },
                    silent: true
                });
            } else {
                ci = 0;
                api.toast({
                    msg: '再按一次返回键退出'
                });
            }
        }
    });
}
