/**
 * Created by 71903 on 2017/12/12.
 * Description:
 */

layui.define(['layer', 'laytpl', 'form'], function (exports) {
    "use strict";
    var mod_name = 'common',
        layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form,
        $ = layui.jquery;

    var Common = function () {
        this.config = {
            otherParams: {//杂项参数
                defaultPageSize: 10 //默认页码尺寸
            }
        }
    };

    /**
     * 版本号
     * @type {string}
     */
    Common.prototype.v = '3.0.1';

    /**
     * 时间操作
     * @type {{datetimeFormat_2: datetimeFormat_2, getMonth: getMonth, getDay: getDay, getHours: getHours, getMinutes: getMinutes, getSeconds: getSeconds}}
     */
    Common.prototype.date = {
        /**
         * 时间戳转换成yyyy-MM-dd格式日期
         * @param timeStamp
         * @returns {string|*}
         */
        datetimeFormat_2: function (timeStamp) {
            var that = this;
            var datetimeType;
            var date = new Date();
            date.setTime(timeStamp);
            datetimeType = date.getFullYear() + "-" + that.getMonth(date) + "-" + that.getDay(date);//yyyy-MM-dd格式日期
            return datetimeType;
        },
        /**
         * 时间戳转换成yyyy-MM-dd hh:mm:ss格式日期
         * @param timeStamp
         * @returns {string|*}
         */
        datetimeFormat_3: function (timeStamp) {
            var that = this;
            var datetimeType;
            var date = new Date();
            date.setTime(timeStamp);
            datetimeType = date.getFullYear() + "-" + that.getMonth(date) + "-" + that.getDay(date) + ' ' + that.getHours(date) + ':' + that.getMinutes(date) + ':' + that.getSeconds(date);//yyyy-MM-dd hh:mm:ss格式日期
            return datetimeType;
        },
        /**
         * 获取月份
         * @param date
         * @returns {*}
         */
        getMonth: function (date) {
            var month;
            month = date.getMonth() + 1; //getMonth()得到的月份是0-11
            if (month < 10) {
                month = "0" + month;
            }
            return month;
        },
        /**
         * 获取日期
         * @param date
         * @returns {*}
         */
        getDay: function (date) {
            var day;
            day = date.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            return day;
        },
        /**
         * 获取时
         * @param date
         * @returns {*}
         */
        getHours: function (date) {
            var hours;
            hours = date.getHours();
            if (hours < 10) {
                hours = "0" + hours;
            }
            return hours;
        },
        /**
         * 获取分
         * @param date
         * @returns {*}
         */
        getMinutes: function (date) {
            var minute;
            minute = date.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }
            return minute;
        },
        /**
         * 获取秒
         * @param date
         * @returns {*}
         */
        getSeconds: function (date) {
            var second;
            second = date.getSeconds();
            if (second < 10) {
                second = "0" + second;
            }
            return second;
        },
        /**
         * 判断yyyy-MM-dd格式日期有效性
         * @param dateString
         * @returns {number}
         */
        isValidate: function (dateString) {
            var objRegExp = "^(\\d{4})\\-(\\d{2})\\-(\\d{2})$";
            var stateCodes = {valid: 0, formatError: 1, monthError: 2, dayError: 3};

            if (!new RegExp(objRegExp).test(dateString)) {
                return stateCodes.formatError;
            }
            else {
                var arrayDate = dateString.split("-");
                var intDay = parseInt(arrayDate[2], 10);
                var intYear = parseInt(arrayDate[0], 10);
                var intMonth = parseInt(arrayDate[1], 10);

                if (intMonth > 12 || intMonth < 1) {
                    return stateCodes.monthError;
                }

                var arrayLookup = {
                    '1': 31, '3': 31, '4': 30, '5': 31, '6': 30, '7': 31,
                    '8': 31, '9': 30, '10': 31, '11': 30, '12': 31
                };

                if (arrayLookup[parseInt(arrayDate[1])] !== null) {
                    if (intDay <= arrayLookup[parseInt(arrayDate[1])] && intDay !== 0)
                        return stateCodes.valid;
                }

                if (intMonth - 2 === 0) {
                    var booLeapYear = (intYear % 4 === 0 && (intYear % 100 !== 0 || intYear % 400 === 0));
                    if (((booLeapYear && intDay <= 29) || (!booLeapYear && intDay <= 28)) && intDay !== 0)
                        return stateCodes.valid;
                }
            }
            return stateCodes.dayError;
        }
    };

    /**
     * 接收后端response信息
     * @param option
     */
    Common.prototype.responseMessage = function (option) {
        if (option.response.success === false) {
            layui.layer.msg(option.response.message, {
                icon: 5,
                zIndex: 19970531,
                time: 1000,
                shade: [0.5, '#FFF'],
                shadeClose: true
            });
        }
        else if (option.response.success === true) {
            layui.layer.msg(option.response.message, {
                icon: 1,
                zIndex: 19970531,
                time: 1000,
                shade: [0.5, '#FFF'],
                shadeClose: true
            }, function () {
                option.pg.get({});//动态渲染页面不需要全部重置
            });
        }
    };

    Common.prototype.timeCutDown = function (option) {
        CountDown.openTimeCountByStartAndEndDate({
            Ele: option.element,
            StartDate: option.start_time,
            EndDate: option.end_time,
            Sign: 'flypie',
            Divider: ':',
            EndFunc: function () {
                option.pg.get({});
            },
            // additionToggle: {
            //     seconds: 10,
            //     callback: function () {
            //         alert('soon');
            //     }
            // }
        });
    };

    Common.prototype.stringToNull = function (value) {
        return value === "null" ? null : value;
    };


    /**
     * 新建和编辑弹窗的模版
     * @type {{config: {id: undefined, boxUrl: undefined, tplType: undefined, type: number, btn: [string,string], shade: [number,string], offset: [string,string], area: [string,string], zIndex: number, yes: yes, success: undefined, box: number, popType: undefined, dataInfo: undefined}, init: init, getAdd: getAdd, getEdit: getEdit, getBox: getBox, getArea: getArea, getTitle: getTitle}}
     */
    Common.prototype.popUp = {
        /**
         * 弹窗参数
         */
        config: {
            id: undefined,//if popType==='edit',id is necessary
            // requestUrl:undefined,
            boxUrl: undefined,
            tplType: undefined,
            type: 1,
            btn: ['保存', '取消'],
            shade: [0.5, '#FFF'],
            offset: ['30%', '35%'],
            area: 'auto',
            zIndex: 19950924,
            yes: function (index) {
                $('form.layui-form').find('button[lay-filter=edit]').click();
            },
            success: undefined,//type:function
            box: -1,
            popType: undefined,
            dataInfo: {}
        },
        /**
         * 弹窗参数初始化
         * @param option
         */
        init: function (option) {
            var that = this;
            $.extend(true, that.config, option);
            var _config = that.config;
            if (_config.boxUrl === undefined) {
                throw new Error('PopUp Error:请配置boxUrl');
            }
            // if(_config.requestUrl===undefined){throw new Error('Add Error:请配置requestUrl');}
            if (_config.tplType === undefined) {
                throw new Error('PopUp Error:请配置tplType');
            }
            if (_config.popType === undefined) {
                throw new Error('PopUp Error:请配置popType');
            }
            if (_config.popType === 'edit' && _config.id === undefined) {
                throw new Error('PopUp Error:请配置id');
            }
            if (_config.box !== -1) {
                return;
            }
            if (_config.popType === 'add') {
                that.getAdd();
            } else if (_config.popType === 'edit') {
                that.getEdit();
            }
            return that;
        },
        /**
         * 新建获取
         * @param option
         */
        getAdd: function (option) {
            var that = this;
            $.extend(true, that.config, option);
            var _config = that.config;
            $.get(_config.boxUrl, null, function (addForm) {
                that.getBox({title: '新建', _config: _config});
            });
        },
        /**
         * 编辑获取
         * @param option
         */
        getEdit: function (option) {
            var that = this;
            $.extend(true, that.config, option);
            var _config = that.config;
            axios.get('/' + _config.tplType + '/findOne/' + _config.id)
                .then(function (response) {
                    _config.dataInfo = response.data.data; //缓存数据
                    that.getBox({title: '编辑', _config: _config});
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        /**
         * 获取弹窗
         * @param option
         */
        getBox: function (option) {
            var that = this;
            $.extend(true, that.config, option);
            var _config = that.config;
            $.get(_config.boxUrl, null, function (popUpForm) {
                _config.box = layer.open({
                    type: 1,
                    title: _config.title + that.getTitle(_config.tplType),
                    content: popUpForm,
                    btn: _config.btn,
                    shade: _config.shade,
                    offset: _config.offset,
                    area: that.getArea(_config.tplType),
                    resize: false,
                    shadeClose: true,
                    zIndex: _config.zIndex,
                    yes: _config.yes,
                    success: _config.success,
                    end: function () {
                        _config.box = -1;
                    }
                });
            });
        },
        /**
         * 获取对应尺寸
         * @param tplType
         * @returns {*}
         */
        getArea: function (tplType) {
            var area;
            switch (tplType) {
                case 'washmachine':
                    area = '600px';
                    break;
                case 'repairment':
                    area = ['600px', '300px'];
                    break;
                case 'recharge':
                    area = '600px';
                    break;

            }
            return area;
        },
        /**
         * 获取对应Title
         * @param tplType
         * @returns {*}
         */
        getTitle: function (tplType) {
            var title;
            switch (tplType) {
                case 'washmachine':
                    title = '洗衣机';
                    break;
                case 'repairment':
                    title = '异常';
                    break;
                case 'recharge':
                    title = '充值';
                    break;
            }
            return title;
        }
    };

    /**
     * 详情通用模板
     * @type {{config: {id: undefined, type: number, tplType: undefined, shade: [number,string], offset: [string,string], area: [string,string], zIndex: number, yes: undefined, success: undefined}, init: init, get: get, getTpl: getTpl, getTitle: getTitle, getArea: getArea, detailsTpl: {userDetailsTpl: string, normUserDetailsTpl: string, appUserDetailsTpl: string, appDetailsTpl: string, certDetailsTpl: string, orgDetailsTpl: string, secretKeyDetailsTpl: string, sysConfDetailsTpl: string, docServerDetailsTpl: string, logDetailsTpl: string, whitelistDetailsTpl: string}}}
     */
    Common.prototype.details = {
        /**
         * 详情参数
         */
        config: {
            id: undefined,
            type: 1,
            url: undefined,
            tplType: undefined,
            shade: [0.5, '#FFF'],
            offset: ['30%', '35%'],
            area: 'auto',
            zIndex: 19950924,
            yes: undefined,//type:function
            success: undefined,//type:function
            detailsBox: -1,
            data: undefined
        },

        /**
         * 详情参数初始化
         * @param option
         */
        init: function (option) {
            var that = this;
            $.extend(true, that.config, option);
            var _config = that.config;
            if (_config.tplType === undefined) {
                throw new Error('Details Error:请配置tplType');
            }
            if (_config.id === undefined) {
                throw new Error('Details Error:请配置ID');
            }
            if (_config.detailsBox !== -1) {
                return;
            }
            that.get();
            _config.url = undefined;
            return that;
        },

        /**
         * 获取详情
         * @param option
         */
        get: function (option) {
            var that = this;
            $.extend(true, that.config, option);
            var _config = that.config;
            axios.get((_config.url + _config.id) || ('/' + _config.tplType + '/findOne/' + _config.id))
                .then(function (response) {
                    _config.data = response.data.data;
                    _config.detailsBox = layer.open({
                        type: _config.type,
                        title: that.getTitle(_config.tplType),
                        content: laytpl(that.getTpl(_config.tplType)).render(response.data),
                        shade: _config.shade, //模态框,
                        offset: _config.offset,
                        area: that.getArea(_config.tplType),
                        zIndex: _config.zIndex,
                        yes: _config.yes,
                        resize: false,
                        shadeClose: true,
                        success: _config.success,
                        end: function () {
                            _config.detailsBox = -1;
                        }
                    });
                })
                .catch(function (error) {
                    console.error(error);
                })
        },

        /**
         * 获取对应Tpl
         * @param tplType
         * @returns {*}
         */
        getTpl: function (tplType) {
            var that = this;
            var tpl;
            switch (tplType) {
                case 'washmachine':
                    tpl = that.detailsTpl.washmachineDetailsTpl;
                    break;
                case 'appointment':
                    tpl = that.detailsTpl.appointmentDetailsTpl;
                    break;
                case 'repairment':
                    tpl = that.detailsTpl.repairmentDetailsTpl;
                    break;
                case 'money':
                    tpl = that.detailsTpl.moneyDetailsTpl;
                    break;
                default:
                    tpl = '详情模版选择错误';
                    break;
            }
            return tpl;

        },

        /**
         * 获取对应Title
         * @param tplType
         * @returns {*}
         */
        getTitle: function (tplType) {
            var title;
            switch (tplType) {
                case 'washmachine':
                    title = '洗衣机详情';
                    break;
                case 'appointment':
                    title = '预约详情';
                    break;
                case 'repairment':
                    title = '报修详情';
                    break;
                case 'money':
                    title = '交易详情';
                    break;
                default:
                    title = '详情';
                    break;
            }
            return title;
        },

        /**
         * 获取对应尺寸
         * @param tplType
         * @returns {*}
         */
        getArea: function (tplType) {
            var area;
            switch (tplType) {
                case 'washmachine':
                    area = '400px';
                    break;
                case 'appointment':
                    area = '400px';
                    break;
                case 'repairment':
                    area = '400px';
                    break;
                case 'money':
                    area = '400px';
                    break;
                default:
                    area = '400px';
                    break;
            }
            return area;
        },

        /**
         * 对应模板
         */
        detailsTpl: {
            //洗衣机详情模板
            washmachineDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '<%# var item=d.data;%>'
                , '<div>洗衣机编号：<% item.machine_id?item.machine_id:"-" %></div>'
                , '<div>寝室楼号：<% item.dormitory_building_number?item.dormitory_building_number:"-" %></div>'
                , '<div>运行状态：'
                , '<%# if(!item.state){ %>'
                , '-'
                , '<%# }%>'
                , '<%# if(item.state==="F"){ %>'
                , '空闲'
                , '<%# }%>'
                , '<%# if(item.state==="W"){ %>'
                , '工作中'
                , '<%# }%>'
                , '<%# if(item.state==="B"){ %>'
                , '故障'
                , '<%# }%>'
                , '<%# if(item.state==="D"){ %>'
                , '待清洁'
                , '<%# }%></div>'
                , '</div>'].join(''),
            //预约详情模板
            appointmentDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '<%# var item=d.data;%>'
                , '<%# var start_time="-"; %>'
                , '<%# var end_time="-"; %>'
                , '<%# if(item.start_time){start_time=layui.common.date.datetimeFormat_3(item.start_time);} %>'
                , '<%# if(item.end_time){end_time=layui.common.date.datetimeFormat_3(item.end_time);} %>'
                , '<div>洗衣机编号：<% item.machine_id?item.machine_id:"-" %></div>'
                , '<div>预约账号：<% item.account?item.account:"-" %></div>'
                , '<div>起始时间：<% start_time %></div>'
                , '<div>结束时间：<% end_time %></div>'
                , '<div>预约状态：'
                , '<%# if(!item.state){ %>'
                , '-'
                , '<%# }%>'
                , '<%# if(item.state==="A"){ %>'
                , '预约中'
                , '<%# }%>'
                , '<%# if(item.state==="O"){ %>'
                , '已过期'
                , '<%# }%>'
                , '<%# if(item.state==="E"){ %>'
                , '已完成'
                , '<%# }%>'
                , '<%# if(item.state==="C"){ %>'
                , '已取消'
                , '<%# }%></div>'
                , '</div>'].join(''),
            //报修详情模板
            repairmentDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '<%# var item=d.data;%>'
                , '<%# var repair_time="-"; %>'
                , '<%# var complete_time="-"; %>'
                , '<%# if(item.complete_time){complete_time=layui.common.date.datetimeFormat_3(item.complete_time);} %>'
                , '<%# if(item.repair_time){repair_time=layui.common.date.datetimeFormat_3(item.repair_time);} %>'
                , '<div>洗衣机编号：<% item.machine_id?item.machine_id:"-" %></div>'
                , '<div>提交异常账号：<% item.repair_account?item.repair_account:"-" %></div>'
                , '<div>提交异常时间：<% repair_time %></div>'
                , '<div>处理异常账号：<% item.complete_account?item.complete_account:"-" %></div>'
                , '<div>处理异常时间：<% complete_time %></div>'
                , '<div>备注：<% item.remarks?item.remarks:"-" %></div>'
                , '<div>异常处理状态：'
                , '<%# if(!item.state){ %>'
                , '-'
                , '<%# }%>'
                , '<%# if(item.state==="R"){ %>'
                , '待修理'
                , '<%# }%>'
                , '<%# if(item.state==="W"){ %>'
                , '待清洗'
                , '<%# }%>'
                , '<%# if(item.state==="E"){ %>'
                , '已完成'
                , '<%# }%>'
                , '<%# if(item.state==="C"){ %>'
                , '已取消'
                , '<%# }%></div>'
                , '</div>'].join(''),
            //交易详情模板
            moneyDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '<%# var item=d.data;%>'
                , '<%# var transaction_time="-"; %>'
                , '<%# if(item.transaction_time){transaction_time=layui.common.date.datetimeFormat_3(item.transaction_time);} %>'
                , '<div>交易用户：<% item.trading_account?item.trading_account:"-" %></div>'
                , '<div>交易时间：<% transaction_time %></div>'
                , '<div>交易金额：<% item.trading_amount?item.trading_amount:"-" %></div>'
                , '<div>交易余额：<% item.balance?item.balance:"-" %></div>'
                , '<div>交易类型：'
                , '<%# if(!item.transaction_type){ %>'
                , '-'
                , '<%# }%>'
                , '<%# if(item.transaction_type==="R"){ %>'
                , '充值'
                , '<%# }%>'
                , '<%# if(item.transaction_type==="P"){ %>'
                , '支付'
                , '<%# }%>'
                , '<%# if(item.transaction_type==="B"){ %>'
                , '返现'
                , '<%# }%></div>'
                , '</div>'].join('')
        }
    };

    /**
     * Vue动态表单验证
     * @type {{mphoneTips: mphoneTips, zipcodeTips: zipcodeTips, ipTips: ipTips, socialsecidTips: socialsecidTips, emailTips: emailTips, passwordTips: passwordTips}}
     */
    Common.prototype.verifyTips = {

        /**
         * 验证手机
         * @param mphone
         * @returns {string}
         */
        mphoneTips: function (mphone) {
            var tip = '';
            if (mphone && !new RegExp("^1(3|4|5|7|8)[0-9]\\d{8}$").test(mphone)) {
                tip = '手机号码输入格式有误';
            }
            return tip;
        },

        /**
         * 验证邮编（不严格）
         * @param zipcode
         * @returns {string}
         */
        zipcodeTips: function (zipcode) {
            var tip = '';
            if (zipcode && !new RegExp("^[0-9]{6}$").test(zipcode)) {
                tip = '邮编输入格式有误';
            }
            return tip;
        },

        /**
         * 验证ip
         * @param ip
         * @returns {string}
         */
        ipTips: function (ip) {
            var tip = '';
            if (ip && !new RegExp("^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
                    + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
                    + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
                    + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$").test(ip)) {
                tip = 'ip输入格式有误';
            }
            return tip;
        },

        /**
         * 验证身份证
         * @param socialsecid
         * @returns {string}
         */
        socialsecidTips: function (socialsecid) {
            var tip = '';
            if (socialsecid) {
                if ((socialsecid.length !== 18 && socialsecid.length !== 15) || !new RegExp("^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\\d{4}((19\\d{2}(0[13-9]|1[012])(0[1-9]|[12]\\d|30))|(19\\d{2}(0[13578]|1[02])31)|(19\\d{2}02(0[1-9]|1\\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\\d{3}(\\d|X|x)?$").test(socialsecid)) {
                    tip = '身份证输入格式有误';
                }
            }
            return tip;
        },

        /**
         * 验证邮箱
         * @param email
         * @returns {string}
         */
        emailTips: function (email) {
            var tip = '';
            if (email && !new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$").test(email)) {
                tip = '邮箱输入格式有误';
            }
            return tip;
        },

        /**
         * 验证密码
         * @param newPassword
         * @param againPassword
         * @returns {string}
         */
        passwordTips: function (newPassword, againPassword) {
            var tip = '';
            if (newPassword === againPassword)
                tip = '';
            else
                tip = '两次密码不相等';
            return tip;
        }
    };

    /**
     * 下拉框选项加载
     * @type {{config: {url: undefined, method: string, data: undefined, resContent: string, $form: undefined, name: undefined, type: undefined}, init: init, getOption: getOption, loadSelectOption: loadSelectOption}}
     */
    Common.prototype.loadOption = {
        /**
         * 下拉框加载参数
         */
        config: {
            url: undefined,
            method: 'get',
            data: undefined,
            resContent: "",
            $form: undefined,
            name: undefined,
            type: undefined
        },
        /**
         * 下拉框加载参数初始化
         * @param option
         */
        init: function (option) {
            var that = this;
            $.extend(true, that.config, option);
            var _config = that.config;
            if (_config.url === undefined) {
                throw new Error('LoadOption Error:请配置URL');
            }
            if (_config.method === 'post' && _config.data === undefined) {
                throw new Error('LoadOption Error:请配置DATA');
            }
            if (_config.type === undefined) {
                throw new Error('LoadOption Error:请配置TYPE');
            }
            return that;
        },

        /**
         * 获得选项
         * @param option
         */
        getOption: function (option) {
            var that = this;
            $.extend(true, that.config, option);
            var _config = that.config;
            if (_config.resContent === '') {
                axios({
                    method: _config.method,
                    url: _config.url,
                    data: _config.data
                }).then(function (response) {
                    _config.resContent = response.data.data;
                    that.loadSelectOption();
                }).catch(function (error) {
                    console.error(error);
                });
            } else {
                that.loadSelectOption();
            }
        },

        /**
         * 加载选项
         */
        loadSelectOption: function () {
            var that = this;
            var _config = that.config;
            var proHtml = '';
            var val = undefined;

            for (var i = 0; i < _config.resContent.length; i++) {
                if (_config.type === 'app') {
                    val = _config.resContent[i].appid;
                } else if (_config.type === 'docServer') {
                    val = _config.resContent[i].id;
                }
                proHtml += '<option value="' + val + '">' + _config.resContent[i].name + '</option>';
            }
            _config.$form.find('select[name=' + _config.name + ']').append(proHtml);
            form.render();
        }

    };


    exports(mod_name, new Common());

});