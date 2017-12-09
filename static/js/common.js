/**
 * Created by 71903 on 2017/9/16.
 * Description:
 */

layui.define(['layer','laytpl','form'],function (exports) {
    "use strict";
    var mod_name='common',
        layer=layui.layer,
        laytpl = layui.laytpl,
        form = layui.form,
        $=layui.jquery;

    var Common=function () {
      this.config={
          otherParams:{//杂项参数
          }
      }
    };

    /**
     * 版本号
     * @type {string}
     */
    Common.prototype.v='3.0.1';

    /**
     * 时间操作
     * @type {{datetimeFormat_2: datetimeFormat_2, getMonth: getMonth, getDay: getDay, getHours: getHours, getMinutes: getMinutes, getSeconds: getSeconds}}
     */
    Common.prototype.date={
        /**
         * 时间戳转换成yyyy-MM-dd格式日期
         * @param timeStamp
         * @returns {string|*}
         */
        datetimeFormat_2:function (timeStamp) {
            var that=this;
            var datetimeType;
            var date = new Date();
            date.setTime(timeStamp);
            datetimeType = date.getFullYear()+"-"+that.getMonth(date)+"-"+that.getDay(date);//yyyy-MM-dd格式日期
            return datetimeType;
        },
        /**
         * 获取月份
         * @param date
         * @returns {*}
         */
        getMonth:function (date) {
            var month;
            month = date.getMonth() + 1; //getMonth()得到的月份是0-11
            if(month<10){
                month = "0" + month;
            }
            return month;
        },
        /**
         * 获取日期
         * @param date
         * @returns {*}
         */
        getDay:function (date) {
            var day;
            day = date.getDate();
            if(day<10){
                day = "0" + day;
            }
            return day;
        },
        /**
         * 获取时
         * @param date
         * @returns {*}
         */
        getHours:function (date) {
            var hours;
            hours = date.getHours();
            if(hours<10){
                hours = "0" + hours;
            }
            return hours;
        },
        /**
         * 获取分
         * @param date
         * @returns {*}
         */
        getMinutes:function (date) {
            var minute;
            minute = date.getMinutes();
            if(minute<10){
                minute = "0" + minute;
            }
            return minute;
        },
        /**
         * 获取秒
         * @param date
         * @returns {*}
         */
        getSeconds:function (date) {
            var second;
            second = date.getSeconds();
            if(second<10){
                second = "0" + second;
            }
            return second;
        },
        /**
         * 判断yyyy-MM-dd格式日期有效性
         * @param dateString
         * @returns {number}
         */
        isValidate:function (dateString) {
            var objRegExp = "^(\\d{4})\\-(\\d{2})\\-(\\d{2})$";
            var stateCodes={valid:0,formatError:1,monthError:2,dayError:3};

            if(!new RegExp(objRegExp).test(dateString)){
                return stateCodes.formatError;
            }
            else{
                var arrayDate = dateString.split("-");
                var intDay = parseInt(arrayDate[2],10);
                var intYear = parseInt(arrayDate[0],10);
                var intMonth = parseInt(arrayDate[1],10);

                if(intMonth > 12 || intMonth < 1) {
                    return stateCodes.monthError;
                }

                var arrayLookup = { '1' : 31,'3' : 31, '4' : 30,'5' : 31,'6' : 30,'7' : 31,
                    '8' : 31,'9' : 30,'10' : 31,'11' : 30,'12' : 31};

                if(arrayLookup[parseInt(arrayDate[1])] !== null) {
                    if(intDay <= arrayLookup[parseInt(arrayDate[1])] && intDay !== 0)
                        return stateCodes.valid;
                }

                if (intMonth-2 ===0) {
                    var booLeapYear = (intYear % 4 === 0 && (intYear % 100 !== 0 || intYear % 400 === 0));
                    if( ((booLeapYear && intDay <= 29) || (!booLeapYear && intDay <=28)) && intDay !==0)
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
    Common.prototype.responseMessage=function (option) {
        if(option.response.code!==0){layui.layer.msg(option.response.message, {icon: 5,zIndex:19970531,time:1000,shade: [0.5, '#FFF'],shadeClose:true});}
        else {layui.layer.msg(option.response.message, {icon: 1,zIndex:19970531,time:1000,shade: [0.5, '#FFF'],shadeClose:true},function () {
            option.pg.get({});//动态渲染页面不需要全部重置
        });}
    };

    Common.prototype.stringToNull=function (value) {
        return value==="null"?null:value;
    };

    /**
     * 图片头数据加载就绪事件 - 更快获取图片尺寸
     * @version	2011.05.27
     * @see		http://blog.phpdr.net/js-get-image-size.html
     * @param	{String}	图片路径
     * @param	{Function}	尺寸就绪
     * @param	{Function}	加载完毕 (可选)
     * @param	{Function}	加载错误 (可选)
     * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
		alert('size ready: width=' + this.width + '; height=' + this.height);
	});
     */
    Common.prototype.imgReady=(function () {
        var list = [], intervalId = null;

            // 用来执行队列
        var tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                }
                !list.length && stop();
            };

            // 停止所有定时器队列
        var stop = function () {
                clearInterval(intervalId);
                intervalId = null;
            };

        return function (url, ready, load, error) {
            var onready, width, height, newWidth, newHeight,
                img = new Image();
            img.src = url;

            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete) {
                ready.call(img);
                load && load.call(img);
                return;
            }

            width = img.width;
            height = img.height;

            // 加载错误后的事件
            img.onerror = function () {
                error && error.call(img);
                onready.end = true;
                img = img.onload = img.onerror = null;
            };

            // 图片尺寸就绪
            onready = function () {
                newWidth = img.width;
                newHeight = img.height;
                if (newWidth !== width || newHeight !== height ||
                    // 如果图片已经在其他地方加载可使用面积检测
                    newWidth * newHeight > 1024
                ) {
                    ready.call(img);
                    onready.end = true;
                }
            };
            onready();

            // 完全加载完毕的事件
            img.onload = function () {
                // onload在定时器时间差范围内可能比onready快
                // 这里进行检查并保证onready优先执行
                !onready.end && onready();

                load && load.call(img);

                // IE gif动画会循环执行onload，置空onload即可
                img = img.onload = img.onerror = null;
            };

            // 加入队列中定期执行
            if (!onready.end) {
                list.push(onready);
                // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                if (intervalId === null) intervalId = setInterval(tick, 40);
            }
        };
    })();

    exports(mod_name,new Common());

});