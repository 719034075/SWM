/**
 * Created by 71903 on 2017/12/19.
 */

layui.use('carousel', function () {
    var carousel = layui.carousel;
    //建造实例
    carousel.render({
        elem: '#repair_dashboard'
        , height: '100%'
        ,interval:'3000'
        , width: '100%' //设置容器宽度
        , arrow: 'always' //始终显示箭头
    });
});