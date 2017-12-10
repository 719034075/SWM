/**
 * Created by 71903 on 2017/12/9.
 */

layui.use(['layer', 'element', 'form'], function () {
    var layer = layui.layer,
        element = layui.element,
        form = layui.form;
    if(login_message){
        layer.msg(login_message, {icon: 5,zIndex:19970531,time:1000,shade: [0.5, '#FFF'],shadeClose:true});
    }
});