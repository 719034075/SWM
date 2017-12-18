/**
 * Created by 71903 on 2017/12/17.
 */
layui.config({
    base: '/static/js/common/'
});
layui.use(['layer', 'element', 'form', 'laytpl', 'paging', 'common'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        element = layui.element,
        form = layui.form,
        laytpl = layui.laytpl,
        paging = layui.paging(),
        common = layui.common;
    laytpl.config({
        open: '<%',
        close: '%>'
    });
    var pg = paging.init({
        url: '/repairment/findAllOfCondition/', //地址
        elem: '#table_content', //内容容器
        params: { //额外发送到服务端的参数
        },
        type: 'POST',
        tempElem: '#tpl', //模块容器
        openWait: true,
        pageConfig: { //分页参数配置
            elem: 'paged', //分页容器
            pageSize: common.config.otherParams.defaultPageSize //分页大小
        },
        success: function () { //渲染成功的回调
        },
        fail: function (msg) { //获取数据失败的回调
        },
        complate: function () { //完成的回调
            var $table_content = $('#table_content');
            //重新渲染复选框
            form.render('checkbox');
            form.on('checkbox(allselector)', function (data) {
                var elem = data.elem;

                $table_content.children('tr').each(function () {
                    var $that = $(this);
                    //全选或反选
                    $that.children('td').eq(0).children('input[type=checkbox]')[0].checked = elem.checked;
                    form.render('checkbox');
                });
            });

            $table_content.children('tr').each(function () {
                var $that = $(this);
                //绑定所有详情按钮事件
                $that.children('td:last-child').children('a[data-opt=details]').on('click', function () {
                    details($that.data('id'));
                });
                   //绑定所有已维修按钮事件
                $that.children('td:last-child').children('a[data-opt=complete]').on('click', function () {
                    complete($that.data('id'));
                });
            });
        }
    });

    //报修详情
    function details(id) {
        common.details.init({
            id: id,
            tplType: 'repairment'
        })
    }

        //已处理，结束异常处理
    function complete(id) {
        var confirmindex = layer.confirm('确定已经处理异常了吗？', {
            icon: 7,
            btn: ['确定', '取消']
        }, function () {
            layer.close(confirmindex);
            var loadindex = layer.load(2);
            axios.get('/repairment/complete/' + id + '/')
                .then(function (response) {
                    layer.close(loadindex);
                    common.responseMessage({pg: pg, response: response.data});
                })
                .catch(function (error) {
                    console.error(error)
                });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    }

    //刷新
    $('#reload').on('click', function () {
        location.reload();
    });
});