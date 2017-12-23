/**
 * Created by 71903 on 2017/12/11.
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
        url: '/washmachine/findAllOfCondition/', //地址
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
                //绑定所有详情按钮事件
                $that.children('td:last-child').children('a[data-opt=appointment]').on('click', function () {
                    appointment($that.data('id'));
                });
                //绑定所有编辑按钮事件
                $that.children('td:last-child').children('a[data-opt=edit]').on('click', function () {
                    edit($that.data('id'));
                });
                //绑定所有删除按钮事件
                $that.children('td:last-child').children('a[data-opt=delete]').on('click', function () {
                    deleteWashmachine($that.data('id'));
                });
                //绑定所有提交异常按钮事件
                $that.children('td:last-child').children('a[data-opt=addRepairment]').on('click', function () {
                    addRepairment($that.data('id'));
                });
                //绑定所有使用按钮事件
                $that.children('td:last-child').children('a[data-opt=use]').on('click', function () {
                    use($that.data('id'));
                });
                if ($that.data('endtime')&&new Date($that.data('endtime'))>new Date()) {
                    var option = {};
                    option.element = document.getElementById('T' + $that.data('id'));
                    option.start_time = new Date();
                    option.end_time = new Date($that.data('endtime'));
                    option.pg=pg;
                    common.timeCutDown(option)
                }
            });
        }
    });

    //新建一台洗衣机
    $('#add').on('click', function () {
        var washmachineAdd = common.popUp.init({
            boxUrl: '/washmachine/washmachineForm/',
            tplType: 'washmachine',
            popType: 'add',
            success: function (layero, index) {
                var washmachineVue = new Vue({
                    el: '#washmachine',
                    data: {machine_id: '', dormitory_building_number: ''}
                });
                form.on('submit(edit)', function (data) {
                    axios.post('/washmachine/add/', data.field)
                        .then(function (response) {
                            common.responseMessage({pg: pg, response: response.data});
                            washmachineAdd.config.box = -1;
                            layer.close(index);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                    return false;
                });
            }
        })
    });

    //预约
    function appointment(id) {
        var confirmindex = layer.confirm('确定预约该台洗衣机吗？', {
            icon: 7,
            btn: ['确定', '取消']
        }, function () {
            layer.close(confirmindex);
            var loadindex = layer.load(2);
            axios.get('/appointment/add/' + id + '/')
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

    //提交异常信息
    function addRepairment(id) {
        var repairmentAdd = common.popUp.init({
            boxUrl: '/repairment/repairmentForm/',
            tplType: 'repairment',
            popType: 'add',
            id: id,
            success: function (layero, index) {
                form.on('submit(edit)', function (data) {
                    data.field.id = id;
                    axios.post('/repairment/add/', data.field)
                        .then(function (response) {
                            common.responseMessage({pg: pg, response: response.data});
                            repairmentAdd.config.box = -1;
                            layer.close(index);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                    return false;
                });
            }
        });
    }

    //洗衣机详情
    function details(id) {
        common.details.init({
            id: id,
            tplType: 'washmachine'
        })
    }

    //编辑洗衣机信息
    function edit(id) {

        var washmachineEdit = common.popUp.init({
            boxUrl: '/washmachine/washmachineForm/',
            tplType: 'washmachine',
            popType: 'edit',
            id: id,
            success: function (layero, index) {
                var washmachineVue = new Vue({
                    el: '#washmachine',
                    data: washmachineEdit.config.dataInfo
                });
                form.on('submit(edit)', function (data) {
                    data.field.id = id;
                    axios.post('/washmachine/modify/', data.field)
                        .then(function (response) {
                            common.responseMessage({pg: pg, response: response.data});
                            washmachineEdit.config.box = -1;
                            layer.close(index);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                    return false;
                });
            }
        });
    }

    //删除一台洗衣机
    function deleteWashmachine(id) {
        var confirmindex = layer.confirm('确定删除该台洗衣机吗？', {
            icon: 7,
            btn: ['确定', '取消']
        }, function () {
            layer.close(confirmindex);
            var loadindex = layer.load(2);
            axios.get('/washmachine/remove/' + id + '/')
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

    //使用一台洗衣机
    function use(id) {
        var confirmindex = layer.confirm('确定使用该台洗衣机吗？费用5元', {
            icon: 7,
            btn: ['确定', '取消']
        }, function () {
            layer.close(confirmindex);
            var loadindex = layer.load(2);
            axios.get('/washmachine/use/' + id + '/')
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