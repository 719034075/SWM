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
            // pageSize: common.config.otherParams.defaultPageSize //分页大小
            page_size: 10 //分页大小

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
                $that.children('td:last-child').children('a[data-opt=delete]').on('click', function () {
                    console.log($that.data('id'))
                    deleteWashmachine($that.data('id'));
                });
            });
        }
    });
    $('#add').on('click', function () {
        var appAdd = uniplug.popUp.init({
            boxUrl: '/washmachineForm',
            tplType: 'washmachine',
            popType: 'add',
            success: function (layero, index) {
                var $addForm = $('#app');

                //弹出窗口成功后渲染表单
                var app = new Vue({
                    el: '#app',
                    data: {name: '', docserverid: '', org: '', contact: '', mphone: '', ip: '', hasDocServer: true}, //兼容ie
                    computed: {
                        mphoneTips: function () {
                            return uniplug.verifyTips.mphoneTips(this.mphone);
                        },
                        ipTips: function () {
                            return uniplug.verifyTips.ipTips(this.ip);
                        }
                    },
                    methods: {
                        setDocServerIdValue: function () {
                            this.docserverid = this.$refs.docserverid.value;
                        }
                    }
                });
                if (servicetype == 1) {
                    app.hasDocServer = false
                } else {
                    app.hasDocServer = true;
                }
                form.on('select(docserverid)', function (data) {
                    app.setDocServerIdValue();
                });
                form.render('select');
                form.on('submit(edit)', function (data) {
                    data.field.adminid = userID;
                    //这里可以写ajax方法提交表单
                    axios.post('/app/add', data.field)
                        .then(function (response) {
                            uniplug.responseMessage({pg: pg, response: response.data});
                            appAdd.config.box = -1;
                            layer.close(index);
                        })
                        .catch(function (error) {
                            // console.log(error);
                        });
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
            }
        })
    });

    //删除一台洗衣机
    function deleteWashmachine(id) {
           var confirmindex =layer.confirm('确定删除该台洗衣机吗？',{
            icon:7,
            btn:['确定','取消']
        },function () {
            layer.close(confirmindex);
            var loadindex= layer.load(2);
            axios.get('/washmachine/remove/'+id+'/')
                .then(function (response) {
                    layer.close(loadindex);
                    common.responseMessage({pg:pg,response:response.data});
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