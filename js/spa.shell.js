spa.shell = (function () {
    var configMap = {
            anchar_schema_map: {
                chat: {open: true, closed: true}
            },
            main_html: String() + '<div class="spa-shell-head">'
            + '<div class="spa-shell-head-logo"></div>'
            + '  <div class="spa-shell-head-acct"></div>'
            + '  <div class="spa-shell-head-search"></div>'
            + '  </div>'
            + '  <div class="spa-shell-main ">'
            + '  <div class="spa-shell-main-nav"></div>'
            + '  <div class="spa-shell-main-content"></div>'
            + '</div>'
            + '  <div class="spa-shell-foot"></div>'
            + '  <div class="spa-shell-chat"></div>'
            + '   <div class="spa-shell-modal"></div>',
            chat_extnd_time: 1000,
            chat_retract_time: 300,
            chat_extend_height: 450,
            chat_retract_height: 15,
            chat_extended_title: 'Click to retract',
            chat_retracted_title: 'Click to extend'

        },
        stateMap = {
            $container: null,
            is_chat_retracted: true,
            anchar_map: {}
        },
        jqueryMap = {},
        setJqueryMap, initModule, toggleChat, copyAncharMap,
        changeAnchorPart, onHashchange, onClickChat, initModule;
    copyAncharMap = function () {
        return $.extend(true, {}, stateMap.anchar_map);
    };
    changeAnchorPart = function (arg_map) {
        var anchor_map_revise = copyAncharMap(), bool_return = true,
            key_name, key_name_dep;
        KEYVAL;
        for (key_name in arg_map) {
            if (arg_map.hasOwnProperty(key_name)) {
                if (key_name.indexOf('_') === 0) {
                    return KEYVAL;
                }
                anchor_map_revise[key_name] = arg_map[key_name];
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                } else {
                    delete  anchor_map_revise[key_name_dep];
                    delete  anchor_map_revise['_s' + key_name_dep];
                }
            }

        }
        try {
            $.uriAnchor.setAnchor(anchor_map_revise);

        } catch (error) {
            $.uriAnchor.setAnchor(stateMap.anchar_map, null, true);
            bool_return = false;
        }
        return bool_return;


    };
    onHashchange = function(event){
        var anchor_map_previous= copyAncharMap(),
            anchor_map_proposed,
            _s_chat_previous,_s_chat_proposed,
            s_chat_proposed;
        try{
            anchor_map_proposed= $.uriAnchor.makeAnchorMap();
        }catch(error){
            $.uriAnchor.setAnchor(anchor_map_previous,null,true);
            return false;
        }
        stateMap.anchar_map = anchor_map_proposed;
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;
        if(!anchor_map_previous || _s_chat_previous!==_s_chat_proposed){
            s_chat_proposed = anchor_map_proposed.chat;
            switch (s_chat_proposed){
                case 'open':toggleChat(true);break;
                case 'closed':toggleChat(false);break;
                default :toggleChat(false);
                    delete  anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed,null,true);
            }
        }

        return false;


    };
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $chat: $container.find('.spa-shell-chat')
        };
    };
    //toggleChat
    toggleChat = function (do_extend, callback) {
        var px_chat_ht = jqueryMap.$chat.height(),
            is_open = px_chat_ht === configMap.chat_extend_height,
            is_closed = px_chat_ht === configMap.chat_retract_height,
            is_sliding = !is_open && !is_closed;
        if (is_sliding) {
            return false
        }
        if (do_extend) {
            jqueryMap.$chat.animate({
                height: configMap.chat_extend_height

            }, configMap.chat_extnd_time, function () {

                jqueryMap.$chat.attr('title', configMap.chat_extended_title);
                stateMap.is_chat_retracted = false;
                if (callback) {
                    callback(jqueryMap.$chat);
                }

            });
            return true;
        }
        jqueryMap.$chat.animate({height: configMap.chat_retract_height},
            configMap.chat_retract_time,
            function () {
                jqueryMap.$chat.attr('title', configMap.chat_retracted_title);
                stateMap.is_chat_retracted = true;
                if (callback) {
                    callback(jqueryMap.$chat);
                }
            }
        );
        return true;

    };
    //toggleChat

    //event handle
    onClickChat = function (event) {
        if (toggleChat(stateMap.is_chat_retracted)) {
            $.uriAnchor.setAnchor({chat: (stateMap.is_chat_retracted ? 'open' : 'closed')});
        }
        return false;
    };
    //event handle

    initModule = function ($container) {
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        jqueryMap.$chat.attr('title', configMap.chat_retracted_title).click(onClickChat);
        //setTimeout(function () {
        //    toggleChat(true);
        //}, 3000);
        //
        //setTimeout(function () {
        //    toggleChat(false);
        //}, 8000);

        $.uriAnchor.configModule({schema_map:configMap.anchar_schema_map});
        spa.chat.cofigModule({});
        spa.chat.initModule(jqueryMap.$chat);
        $(window).bind('hashchange',onHashchange).trigger('hashchange');

    };
    return {initModule: initModule};

}());