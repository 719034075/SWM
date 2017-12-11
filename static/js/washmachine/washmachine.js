/**
 * Created by 71903 on 2017/12/11.
 */

layui.use(['layer', 'element', 'form', 'laytpl'], function () {
    var layer = layui.layer,
        element = layui.element,
        form = layui.form,
        laytpl = layui.laytpl;
    laytpl.config({
        open: '<%',
        close: '%>'
    });
});