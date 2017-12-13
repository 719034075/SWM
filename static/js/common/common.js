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
            offset: ['10%', '30%'],
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
            offset: ['10%', '30%'],
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
                case 'user':
                    tpl = that.detailsTpl.userDetailsTpl;
                    break;
                case 'normUser':
                    tpl = that.detailsTpl.normUserDetailsTpl;
                    break;
                case 'appUser':
                    tpl = that.detailsTpl.appUserDetailsTpl;
                    break;
                case 'app':
                    tpl = that.detailsTpl.appDetailsTpl;
                    break;
                case 'cert':
                    tpl = that.detailsTpl.certDetailsTpl;
                    break;
                case 'org':
                    tpl = that.detailsTpl.orgDetailsTpl;
                    break;
                case 'secretKey':
                    tpl = that.detailsTpl.secretKeyDetailsTpl;
                    break;
                case 'sysConf':
                    tpl = that.detailsTpl.sysConfDetailsTpl;
                    break;
                case 'docServer':
                    tpl = that.detailsTpl.docServerDetailsTpl;
                    break;
                case 'log':
                    tpl = that.detailsTpl.logDetailsTpl;
                    break;
                case 'whitelist':
                    tpl = that.detailsTpl.whitelistDetailsTpl;
                    break;
                case 'signpicname':
                    tpl = that.detailsTpl.signpicnameDetailsTpl;
                    break;
                case 'usedCert':
                    tpl = that.detailsTpl.usedcertDetailsTpl;
                    break;
                case 'CRLConf':
                    tpl = that.detailsTpl.crlConfDetailsTpl;
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
                case 'user':
                    title = '业务系统管理员详情';
                    break;
                case 'normUser':
                    title = '单列用户详情';
                    break;
                case 'appUser':
                    title = '业务系统用户详情';
                    break;
                case 'app':
                    title = '业务系统详情';
                    break;
                case 'cert':
                    title = '证书详情';
                    break;
                case 'org':
                    title = '组织详情';
                    break;
                case 'secretKey':
                    title = '密钥详情';
                    break;
                case 'sysConf':
                    title = '系统参数详情';
                    break;
                case 'docServer':
                    title = '签章服务器详情';
                    break;
                case 'log':
                    title = '日志详情';
                    break;
                case 'whitelist':
                    title = '白名单IP详情';
                    break;
                case 'signpicname':
                    title = '电子印章详情';
                    break;
                case 'usedCert':
                    title = '历史证书详情';
                    break;
                case 'CRLConf':
                    title = 'crl配置详情';
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
                case 'user':
                    area = '400px';
                    break;
                case 'normUser':
                    area = '400px';
                    break;
                case 'appUser':
                    area = '450px';
                    break;
                case 'app':
                    area = '400px';
                    break;
                case 'cert':
                    area = '400px';
                    break;
                case 'org':
                    area = '400px';
                    break;
                case 'secretKey':
                    area = '400px';
                    break;
                case 'sysConf':
                    area = '400px';
                    break;
                case 'docServer':
                    area = '400px';
                    break;
                case 'log':
                    area = '400px';
                    break;
                case 'whitelist':
                    area = '400px';
                    break;
                case 'signpicname':
                    area = '450px';
                    break;
                case 'usedCert':
                    area = '400px';
                    break;
                case 'CRLConf':
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
            //业务系统管理员详情模板
            userDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var regtime="-";}}'
                , '{{# if(item.regtime){regtime=layui.uniplug.date.datetimeFormat_2(item.regtime);}}}'
                , '<div>用户名：{{ item.username?item.username:"-"  }}</div>'
                , '<div>邮箱：{{ item.email?item.email:"-"  }}</div>'
                , '<div>手机：{{ item.mphone?item.mphone:"-"  }}</div>'
                , '<div>用户真实姓名：{{ item.realname?item.realname:"-"  }}</div>'
                , '<div>身份证：{{ item.socialsecid?item.socialsecid:"-"  }}</div>'
                , '<div>单位名称：{{ item.org?item.org:"-"  }}</div>'
                , '{{# if(item.apps.length===0){ }}'
                , '<div>业务系统： - </div>'
                , '{{# } }}'
                , '{{# if(item.apps.length!==0){ }}'
                , '<div>业务系统：'
                , '{{# layui.each(item.apps,function(appIndex,appItem){ }}'
                , '{{appItem.name}} '
                , '{{# }); }}'
                , '</div>'
                , '{{# } }}'
                , '<div>注册时间：{{ regtime }}</div>'
                , '<div>用户类型：{{ item.category===1?"业务系统管理员":"系统管理员" }}</div>'
                , '<div>用户状态：{{ item.state===1?"启用":"禁用" }}</div>'
                , '</div>'].join(''),

            //单列用户详情模板
            normUserDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var certype="-";}}'
                , '{{# if(item.idtype==1){certype="身份证" }}}'
                , '{{# if(item.idtype==2){certype="军官证" }}}'
                , '{{# if(item.idtype==3){certype="士兵证" }}}'
                , '{{# if(item.idtype==4){certype="护照" }}}'
                , '<div>区域：{{ item.province?item.province:"-" }}/{{ item.city?item.city:"-" }}/{{ item.region?item.region:"-" }}</div>'
                , '<div>姓名：{{ item.name?item.name:"-"  }}</div>'
                , '<div>性别：{{ item.sex?item.sex:"-" }}</div>'
                , '<div>单位/组织：{{ item.org?item.org:"-"  }}</div>'
                , '<div>证件类型：{{ certype  }}</div>'
                , '<div>证件号码：{{ item.idnum?item.idnum:"-"  }}</div>'
                , '<div>联系地址：{{ item.addr?item.addr:"-"  }}</div>'
                , '<div>邮政编码：{{ item.zipcode?item.zipcode:"-"  }}</div>'
                , '<div>绑定用户手机：{{ item.mphone?item.mphone:"-"  }}</div>'
                , '<div>是否发送短信：{{ item.sendsms==1?"发送":"不发送"  }}</div>'
                , '<div>证书id：{{ item.certid?item.certid:"-" }}</div>'
                , '<div>密钥id：{{ item.secretkeyid?item.secretkeyid:"-" }}</div>'
                , '</div>'].join(''),

            //业务系统用户详情模板
            appUserDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var certype="-";}}'
                , '{{# if(item.idtype==1){certype="身份证" }}}'
                , '{{# if(item.idtype==2){certype="军官证" }}}'
                , '{{# if(item.idtype==3){certype="士兵证" }}}'
                , '{{# if(item.idtype==4){certype="护照" }}}'
                , '<div>业务系统：{{ item.appid?item.appName:"-"  }}</div>'
                , '<div>绑定用户id：{{ item.userid?item.userid:"-"  }}</div>'
                , '<div>证件类型：{{ certype }}</div>'
                , '<div>证件号码：{{ item.idnum?item.idnum:"-"  }}</div>'
                , '<div>姓名：{{ item.name?item.name:"-"  }}</div>'
                , '<div>联系地址：{{ item.addr?item.addr:"-"  }}</div>'
                , '<div>邮政编码：{{ item.zipcode?item.zipcode:"-"  }}</div>'
                , '<div>绑定用户手机：{{ item.mphone?item.mphone:"-"  }}</div>'
                , '<div>是否发送短信：{{ item.sendsms==1?"发送":"不发送"  }}</div>'
                , '<div>证书id：{{ item.certid?item.certid:"-"  }}</div>'
                , '<div>密钥id：{{ item.secretkeyid?item.secretkeyid:"-" }}</div>'
                , '{{# if(!item.sealid) { }}'
                , '<div class="hasDocServer">签名图片：-</div>'
                , '{{#}}}'
                , '{{# if(item.sealid) { }}'
                , '<div class="hasDocServer">签名图片：<img id="pic"></div>'
                , '<div class="hasDocServer" id="slider"></div>'
                , '{{#}}}'
                , '</div>'].join(''),

            //业务系统详情模板
            appDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var regtime="-";}}'
                , '{{# if(item.regtime){regtime=layui.uniplug.date.datetimeFormat_2(item.regtime);}}}'
                , '<div>业务系统名称：{{ item.name?item.name:"-"  }}</div>'
                , '<div>业务系统ID：{{ item.appid  }}</div>'
                , '<div><span id="showSecret" style="display: none">业务系统密码：{{item.appsecret?item.appsecret:"-"}}</span>'
                , '<span id="hideSecret">业务系统密码：****** </span>'
                , '<a href="javascript:void(0);" id="showBtn" class="layui-btn layui-btn-normal layui-btn-mini">显示</a>'
                // ,'<a href="javascript:void(0);" style="display: none" id="hideBtn" class="layui-btn layui-btn-normal layui-btn-mini">隐藏</a>'
                , '</div>'
                // ,'<div class="hasDocServer">业务所属签章服务器：{{ item.docserverName?item.docserverName:"-" }}</div>'
                , '<div>所属组织/机构/部门：{{ item.org?item.org:"-"  }}</div>'
                , '<div>联系人：{{ item.contact?item.contact:"-"  }}</div>'
                , '<div>联系电话：{{ item.mphone?item.mphone:"-"  }}</div>'
                , '<div>业务系统IP：{{item.ip?item.ip:"-"}}</div>'
                , '<div>注册时间：{{ regtime }}</div>'
                , '{{# if(item.adminid===0){ }}'
                , '<div>业务系统管理员： - </div>'
                , '{{# } }}'
                , '{{# if(item.adminid!==0){ }}'
                , '<div>业务系统管理员：{{item.adminName}}</div>'
                , '{{# } }}'
                , '</div>'].join(''),

            //证书详情模板
            certDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var startdate="-";}}'
                , '{{# if(item.startdate){startdate=layui.uniplug.date.datetimeFormat_2(item.startdate);}}}'
                , '{{# var enddate="-";}}'
                , '{{# if(item.enddate){enddate=layui.uniplug.date.datetimeFormat_2(item.enddate);}}}'
                , '<div>证书名称：{{ item.name?item.name:"-" }}</div>'
                , '<div>证书颁发者：{{ item.issuer?item.issuer:"-" }}</div>'
                , '<div>证书拥有者：{{ item.subject?item.subject:"-" }}</div>'
                , '<div>证书序列号：{{ item.sn?item.sn:"-" }}</div>'
                , '<div>证书生效日期：{{ startdate }}</div>'
                , '<div>证书失效日期：{{ enddate }}</div>'
                , '<div>证书有效性：{{ item.available==1?"可用":"禁用" }}</div>'
                , '{{#  if(item.category==0){ }}'
                , '<div>证书类型：-</div>'
                , '{{#  } }}'
                , '{{#  if(item.category==1){ }}'
                , '<div>证书类型：个人证书</div>'
                , '{{#  } }}'
                , '{{#  if(item.category==2){ }}'
                , '<div>证书类型：组织证书</div>'
                , '{{#  } }}'
                , '{{#  if(item.category==3){ }}'
                , '<div>证书类型：根证书</div>'
                , '{{#  } }}'
                , '<div>证书文件名：{{ item.filename?item.filename:"-" }}</div>'
                , '</div>'].join(''),

            //组织详情模板
            orgDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var certype="-";}}'
                , '{{# if(item.idtype==1){certype="工商营业执照" }}}'
                , '{{# if(item.idtype==2){certype="组织机构代码证" }}}'
                , '{{# if(item.idtype==3){certype="事业法人登记证" }}}'
                , '{{# if(item.idtype==4){certype="社团登记证" }}}'
                , '{{# if(item.idtype==5){certype="其他" }}}'
                , '<div>组织名称：{{ item.name?item.name:"-"  }}</div>'
                , '<div>组织地址：{{ item.address?item.address:"-"  }}</div>'
                , '<div>证书类型：{{ certype }}</div>'
                , '<div>证书号码：{{ item.idnum?item.idnum:"-"  }}</div>'
                , '<div>邮政编码：{{ item.zipcode?item.zipcode:"-"  }}</div>'
                , '<div>联系人：{{ item.contact?item.contact:"-"  }}</div>'
                , '<div>联系人身份证号：{{ item.contactssn?item.contactssn:"-"  }}</div>'
                , '<div>联系电话：{{ item.mphone?item.mphone:"-"  }}</div>'
                , '<div>组织类别：{{ item.sendsms==1?"发送":"不发送"  }}</div>'
                , '<div>上级单位名称：{{ item.parentName?item.parentName:"-"  }}</div>'
                , '<div>证书id：{{ item.certid?item.certid:"-" }}</div>'
                , '<div>密钥id：{{ item.secretkeyid?item.secretkeyid:"-" }}</div>'
                , '</div>'].join(''),

            //密钥详情模板
            secretKeyDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '<div>板卡密钥号：{{ item.keynum?item.keynum:"-"  }}</div>'
                , '<div>算法：{{ item.alg==1?"RSA":"SM2"  }}</div>'
                , '<div>密钥长度：{{ item.bits?item.bits:"-"  }}</div>'
                , '<div>密钥有效性：{{ item.available==1?"可用":"禁用"  }}</div>'
                , '<div>是否已被绑定用户：{{ item.binduser==1?"是":"否" }}</div>'
                , '<div>是否已被绑定证书：{{ item.bindcert==1?"是":"否" }}</div>'
                , '<div><span id="showP10" style="display: none;word-break: break-all;">P10：{{item.p10?item.p10:"-"}}</span>'
                , '<span id="hideP10">P10：****** </span>'
                , '<a href="javascript:void(0);" id="showBtn" class="layui-btn layui-btn-normal layui-btn-mini">显示</a>'
                , '</div>'
                , '</div>'].join(''),

            //系统参数详情模板
            sysConfDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '<div>参数名：{{ item.paraname?item.paraname:"-"  }}</div>'
                , '<div>参数值：{{ item.paravalue?item.paravalue:"-"  }}</div>'
                , '<div>参数含义：{{ item.meaning?item.meaning:"-"  }}</div>'
                , '</div>'].join(''),

            //签章服务器详情模板
            docServerDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var deploy="-";}}'
                , '{{# if(item.deploy==1){deploy="硬件"; }}}'
                , '{{# if(item.deploy==2){deploy="软件"; }}}'
                , '{{# var os="-";}}'
                , '{{# if(item.os==1){os="Linux"; }}}'
                , '{{# if(item.os==2){os="Windows"; }}}'
                , '<div>签章服务器名称：{{ item.name?item.name:"-" }}</div>'
                , '<div>签章服务器IP地址：{{ item.ip?item.ip:"-" }}</div>'
                , '<div>部署方式：{{deploy}}</div>'
                , '<div>操作系统：{{os}}</div>'
                , '<div>部署位置：{{ item.where?item.where:"-" }}</div>'
                // ,'<div>业务系统数：{{ item.appnum?item.appnum:"-" }}</div>'
                , '</div>'].join(''),

            //日志详情模板
            logDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var operatetime="-"}}'
                , '{{# if(item.operatetime){operatetime=layui.uniplug.date.datetimeFormat_2(item.operatetime);}}}'
                , '{{# var usertype="-";}}'
                , '{{# if(item.usertype==1){usertype="超级管理员" }}}'
                , '{{# if(item.usertype==2){usertype="业务系统用户" }}}'
                , '{{# if(item.usertype==3){usertype="单列用户" }}}'
                , '{{# if(item.usertype==4){usertype="业务系统管理员" }}}'
                , '<div>用户名：{{ item.username?item.username:"-"  }}</div>'
                , '<div>用户类型：{{ usertype }}</div>'
                , '<div>模块名称：{{ item.modulename?item.modulename:"-" }}</div>'
                , '<div>操作名称：{{ item.operatename?item.operatename:"-" }}</div>'
                , '<div>操作时间：{{ operatetime }}</div>'
                , '<div>类名称：{{ item.classname?item.classname:"-" }}</div>'
                , '<div>方法名称：{{ item.methodname?item.methodname:"-" }}</div>'
                , '<div>传入参数：{{ item.params?item.params:"-" }}</div>'
                , '<div>操作IP：{{ item.ip?item.ip:"-" }}</div>'
                , '</div>'].join(''),

            //白名单详情模板
            whitelistDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '<div>IP地址：{{ item.ip?item.ip:"-"  }}</div>'
                , '<div>备注：{{ item.memo?item.memo:"-" }}</div>'
                , '{{# if(item.valid==1){ }}'
                , '<div>有效性：是</div>'
                , '{{# }}}'
                , '{{# if(item.valid==2){ }}'
                , '<div>有效性：否</div>'
                , '{{# }}}'
                , '</div>'].join(''),

            //签章图片详情模板
            signpicnameDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var validstart="-";}}'
                , '{{# if(item.validstart){validstart=layui.uniplug.date.datetimeFormat_2(item.validstart);}}}'
                , '{{# var validend="-";}}'
                , '{{# if(item.validend){validend=layui.uniplug.date.datetimeFormat_2(item.validend);}}}'
                , '<div>印章文件名：{{ item.sealfilename?item.sealfilename:"-" }}</div>'
                , '<div>印章版本号：{{ item.sealversion?item.sealversion:"-" }}</div>'
                , '<div>印章有效起始日期：{{ validstart }}</div>'
                , '<div>印章有效终止日期：{{ validend }}</div>'
                , '<div class="hasDocServer">签章图片：<img id="pic"></div>'
                , '<div class="hasDocServer" id="slider"></div>'
                , '</div>'].join(''),

            //历史证书详情模版
            usedcertDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var invalidtime="-";}}'
                , '{{# if(item.invalidtime){invalidtime=layui.uniplug.date.datetimeFormat_2(item.invalidtime);}}}'
                , '<div>用户唯一号：{{item.unicode}}</div>'
                , '<div>证书ID：{{item.certid}}</div>'
                , '{{# if(item.reason!=2&&item.reason!=3&&item.reason!=4&&item.reason!=5){}}'
                , '<div>失效原因：未知失效原因</div>'
                , '{{#}}}'
                , '{{# if(item.reason==2){}}'
                , '<div>失效原因：过期</div>'
                , '{{#}}}'
                , '{{# if(item.reason==3){}}'
                , '<div>失效原因：注销</div>'
                , '{{#}}}'
                , '{{# if(item.reason==4){}}'
                , '<div>失效原因：变更</div>'
                , '{{#}}}'
                , '{{# if(item.reason==5){}}'
                , '<div>失效原因：挂失</div>'
                , '{{#}}}'
                , '<div>失效时间：{{invalidtime}}</div>'
                , '</div>'].join(''),

            //CRL配置详情模版
            crlConfDetailsTpl: ['<div class="tplFont" style="margin: 15px;">'
                , '{{# var item=d.data;}}'
                , '{{# var startdate="-"}}'
                , '{{# var enddate="-"}}'
                , '{{# if(item.startdate){startdate=layui.uniplug.date.datetimeFormat_2(item.startdate);}}}'
                , '{{# if(item.enddate){enddate=layui.uniplug.date.datetimeFormat_2(item.enddate);}}}'
                , '<div>服务名称：{{ item.name?item.name:"-"  }}</div>'
                , '{{# if(!item.type){}}'
                , '<div>CRL分发点类型：-</div>'
                , '{{#}}}'
                , '{{# if(item.type===1){}}'
                , '<div>CRL分发点类型：LDAP</div>'
                , '{{#}}}'
                , '{{# if(item.type===2){}}'
                , '<div>CRL分发点类型：HTTP</div>'
                , '{{#}}}'
                , '{{# if(item.type===3){}}'
                , '<div>CRL分发点类型：上传</div>'
                , '{{#}}}'
                , '<div>CRL获取地址：{{ item.url?item.url:"-" }}</div>'
                , '<div>标识名：{{ item.dn?item.dn:"-" }}</div>'
                , '<div>过滤条件：{{ item.filter?item.filter:"-" }}</div>'
                , '<div>CRL本次更新时间：{{ startdate }}</div>'
                , '<div>CRL下次更新时间：{{ enddate }}</div>'
                , '<div>CRL文件名：{{ item.filename?item.filename:"-" }}</div>'
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