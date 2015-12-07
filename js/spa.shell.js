spa.shell = (function () {
    var configMap = {
            anchar_schema_map: {
                chat: {opened: true, closed: true}
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
            + '   <div class="spa-shell-modal"></div>',
            chat_extnd_time: 1000,
            chat_retract_time: 300,
            chat_extend_height: 450,
            chat_retract_height: 15,
            chat_extended_title: 'Click to retract',
            chat_retracted_title: 'Click to extend',
            resize_interval:200

        },
        stateMap = {
            $container:undefined,
            anchar_map: {},
            resize_idto:undefined
        },
        jqueryMap = {},
        setJqueryMap, initModule, toggleChat, copyAncharMap,setChatAnchor,
        changeAnchorPart, onHashchange, onClickChat, initModule,onResize;
    copyAncharMap = function () {
        return $.extend(true, {}, stateMap.anchar_map);
    };

    onResize= function () {
      if(stateMap.resize_idto){return true}
        spa.chat.handleResize();
        stateMap.resize_idto=setTimeout(
            function () {
            stateMap.resize_idto = undefined;
            },
            configMap.resize_interval
        );
       return true;
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
        var

            _s_chat_previous,_s_chat_proposed,
            s_chat_proposed,
            anchor_map_proposed,
            is_ok = true,
           anchor_map_previous= copyAncharMap();
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
                case 'opened':
                    is_ok = spa.chat.setSliderPosition('opened');
                     break;
                case 'closed':
                    is_ok = spa.chat.setSliderPosition('closed');
                 break;
                default :
                    spa.chat.setSliderPosition('closed');
                    delete  anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed,null,true);
            }
        }

        if(!is_ok){
            if(anchor_map_previous){
                $.uriAnchor.setAnchor(anchor_map_previous,null,true);
                stateMap.anchar_map=anchor_map_previous;
            }else{
                delete  anchor_map_proposed.chat;
                $.uriAnchor.setAnchor(anchor_map_proposed,null,true);
            }
        }

        return false;


    };

    setChatAnchor = function(position_type){
        return changeAnchorPart({chat:position_type});
    };
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
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
        //jqueryMap.$chat.attr('title', configMap.chat_retracted_title).click(onClickChat);


        $.uriAnchor.configModule({schema_map:configMap.anchar_schema_map});
        spa.chat.configModule({
            set_chat_anchor:setChatAnchor,
            chat_model:spa.model.chat,
            people_model:spa.model.people
        });
        spa.chat.initModule(jqueryMap.$container);
        $(window).bind('resize',onResize).bind('hashchange',onHashchange).trigger('hashchange');

    };
    return {initModule: initModule};

}());