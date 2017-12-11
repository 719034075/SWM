/**
 * Paging 组件
 * @description 基于laytpl 、laypage、layer 封装的组件
 * @author Van zheng_jinfan@126.com
 * @link http://m.zhengjinfan.cn
 * @license MIT
 * @version 1.0.1
 */

layui.define(['layer', 'laypage', 'laytpl'], function (exports) {
    "use strict";
    var $ = layui.jquery,
        layer = parent.layui.layer === undefined ? layui.layer : parent.layui.layer,
        laytpl = layui.laytpl,
        defaultPageIndex=1;

    var Paging = function () {
        this.config =  {
            url: undefined, //数据远程地址
            type: 'POST', //数据的获取方式  get or post
            elem: undefined, //内容容器
            params: {}, //获取数据时传递的额外参数
            openWait: true, //加载数据时是否显示等待框
            tempElem: undefined, //模板容器
            tempType: 0,
            paged: true,
            pageConfig: { //参数应该为object类型
                elem: undefined,
                pageSize: undefined //分页大小
            },
            success: undefined, //type:function
            fail: function (msg) { layer.msg(msg, { icon: 2 }); }, //type:function
            complate: undefined, //type:function
            serverError: function (xhr, status, error) { //ajax的服务错误
                throwError("错误提示： " + xhr.status + " " + xhr.statusText);
            }
        };
    };
    /**
     * 版本号
     */
    Paging.prototype.v = '1.0.2';

    /**
     * 设置
     * @param {Object} options
     */
    Paging.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };
    /**
     * 初始化
     * @param {Object} options
     */
    Paging.prototype.init = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        var _config = that.config;
        if (_config.url === undefined) {
            throwError('Paging Error:请配置远程URL!');
        }
        if (_config.elem === undefined) {
            throwError('Paging Error:请配置参数elem!');
        }
        if ($(_config.elem).length === 0) {
            throwError('Paging Error:找不到配置的容器elem!');
        }
        if (_config.tempType === 0) {
            if (_config.tempElem === undefined) {
                throwError('Paging Error:请配置参数tempElem!');
            }
            if ($(_config.tempElem).length === 0) {
                throwError('Paging Error:找不到配置的容器tempElem!');
            }
        }
        if (_config.paged) {
            var _pageConfig = _config.pageConfig;
            if (_pageConfig.elem === undefined) {
                throwError('Paging Error:请配置参数pageConfig.elem!');
            }
        }
        if (_config.type.toUpperCase() !== 'GET' && _config.type.toUpperCase() !== 'POST') {
            throwError('Paging Error:type参数配置出错，只支持GET或者POST');
        }
        that.get({
            pageIndex: defaultPageIndex,
            pageSize: _config.pageConfig.pageSize
        });

        return that;
    };
    /**
     * 获取数据
     * @param {Object} options
     */
    Paging.prototype.get = function (options) {
        var that = this;
        var _config = that.config;
        var loadIndex = undefined;
        if (_config.openWait) {
            loadIndex = layer.load(2);
        }//如果开启了等待层

        $.extend(true, _config.params, options);
        axios({
            method: _config.type,
            url: _config.url,
            data: _config.params

        }).then(function (result, status, xhr) {
            $("input[lay-filter='allselector']").prop("checked",false);//消除全选之后，全选checkbox依旧选中
            console.log(result.data);
            if(result.data.total===0){
                layer.msg("暂无数据");
                // return;
            }
                if (result.data.data) {
                    //获取模板
                    var tpl = _config.tempType === 0 ? $(_config.tempElem).html() : _config.tempElem;
                    //渲染数据
                    laytpl(tpl).render(result.data, function (html) {
                        if (_config.renderBefore) {
                            _config.renderBefore(html, function (formatHtml) {
                                $(_config.elem).html(formatHtml);
                            });
                        }
                        else {
                            $(_config.elem).html(html);
                        }
                    });
                    if (_config.paged) {
                        var _pageConfig = _config.pageConfig;
                        var defaults = {
                            elem: _pageConfig.elem,
                            curr: _config.params.pageIndex,
                            count:result.data.total,
                            layout:['count', 'prev', 'page', 'next', 'limit', 'skip'],
                            jump: function (obj, first) {
                                //得到了当前页，用于向服务端请求对应数据
                                var curr = obj.curr;
                                var limit = obj.limit;
                                _pageConfig.limit=limit;//否则页面尺寸的组件渲染会异常
                                if (!first) {
                                    that.get({
                                        pageIndex: curr,
                                        pageSize: limit
                                    });
                                }
                            }
                        };
                        $.extend(defaults, _pageConfig); //参数合并
                        layui.laypage.render(defaults);
                        if (result.data.total === undefined||result.data.total === null || result.data.total === 0) {
                            throwError('Paging Error:请返回数据总数！');
                            return;
                        }
                    }
                    if (_config.success) {
                        _config.success(); //渲染成功
                    }
                } else {
                    if (_config.fail) {
                        _config.fail(result); //获取数据失败
                    }
                }
                if (_config.complate) {
                    _config.complate(); //渲染完成
                }
                if (loadIndex !== undefined) {
                    layer.close(loadIndex);
                }//关闭等待层

        })
            .catch(function (xhr, status, error) {
                console.log(xhr);
                if (loadIndex !== undefined)
                    layer.close(loadIndex); //关闭等待层
                _config.serverError(xhr, status, error); //服务器错误
            });
    };
    /**
     * 抛出一个异常错误信息
     * @param {String} msg
     */
    function throwError(msg) {
        throw new Error(msg);
    };

    var paging = new Paging();
    exports('paging', function (options) {
        return paging.set(options);
    });
});