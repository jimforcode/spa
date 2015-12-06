/**
 * Created by zengjin on 2015/12/3.
 */
spa.chat = (function () {

        var configMap = {
            main_html: String()+'<div class="spa-chat">'
                +'<div class="spa-chat-head">' +
            '<div class="spa-chat-head-toggle">+<div>' +
            '<div class="spa-chat-head-title">' +
            'Chat' +
            '</div>' +
            '</div>' +
            '<div class="spa-chat-closed">X</div>' +
            '<div class="spa-chat-sizer">' +
            '<div class="spa-chat-msgs"></div>' +
            '<div class="spa-chat-box">' +
            '<input type="text" />' +
            '<div>send</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            settable_map: {
                slider_open_time:true,
                silder_close_time:true,
                slider_opened_em:true,
                slider_closed_em:true,
                slider_opened_title:true,
                slider_closed_title:true,
                chat_model:true,
                people_model:true,
                set_chat_anchor:true


            }


        },
        stateMap = {$container: null},
        jqueryMap = {},
    setJqueryMap, configModule, initModule,tests;
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
        };
    };
        alert(configMap.main_html);
    configModule = function (input_map) {

        spa.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map:configMap
    }
    )
    ;
    return true;


};
        tests= function(msg){

            alert(msg);
        };


initModule = function ($container) {
    $container.html(configMap.main_html);
    stateMap.$container = $container;
    setJqueryMap();
    return true;
};
return {
    cofigModule: configModule,
    initModule: initModule
};

}
()
)
;

