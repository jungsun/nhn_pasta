var ESMpopup = (function(jQuery){
    // 2016.6.7
    // copy from http://esmdev.nhncorp.com/nfi/esm/popup/js/nesm.popup.js
    // include 하지 않고 한번 감싸 쓰는 이유 : 아래 코드는 전역 변수와 각종 함수가 전역 공간을 더럽히도록 되어 있어
    // 기존 코드와의 격리와 pasta 코드에 대한 영향을 최소화 하기 위해 복사하여 사용합니다.
    // See Also http://wiki.navercorp.com/pages/viewpage.action?pageId=241803029

    // --------------- start of copy -------------------------

    /**
     * ESM 공통팝업
     */
    //document.domain = "nhncorp.com"; // 크로스 도메인 nhncorp.com
    function getSubDomain(documentDomain){
        if(documentDomain.indexOf("nhncorp.com") >= 0){
            return "nhncorp.com";
        }else if(documentDomain.indexOf("nsbc.co.kr") >= 0){
            return "nsbc.co.kr";
        }else if(documentDomain.indexOf("nhnent.com") >= 0){
            return "nhnent.com";
        }else if(documentDomain.indexOf("navercorp.com") >= 0){
            return "navercorp.com";
        }else if(documentDomain.indexOf("nhn-playart.com") >= 0){
            return "nhn-playart.com";
        }else if(documentDomain.indexOf("linecorp.com") >= 0) {
            return "linecorp.com";
        }else{
            alert(documentDomain + "는 ESM공통팝업에서 지원하지 않는 도메인형식입니다.");
            return documentDomain;
        }
    }

    document.domain = getSubDomain(document.domain);

    var nesmFindSchTxtArr = [];
    var MAPPING_URL_NHN = "/nfi/esm/popup";
    var MAPPING_WS_URL_NHN = "/nfi/ws/esm/popup";
    var MAPPING_SAVE_SERVICE_URL_NHN = "/nfi/wsAction.nhn?m=saveMyService";

    //var jQuery = $.noConflict();
    var nesmPopup = {
        open:function(opts){

            // check browser safari
            var ua = navigator.userAgent.toLowerCase();
            var browserName = "";
            if(ua.indexOf( "chrome" ) != -1 && ua.indexOf( "safari" ) != -1){
                browserName = "chrome";
            }else if(ua.indexOf( "safari" ) != -1){
                browserName = "safari";
            }
            var url = "";
            var width = 650;
            var height = 550;
            if(browserName == "safari"){
                height = 490;
            }

            // 브라우저의 언어 추출
            var userLang = opts.user_lang;
            if(userLang == null || userLang == "" || userLang == "undefined"){
                if (navigator.language) {
                    // 비 IE에서 작동
                    userLang = navigator.language;
                    //alert("비IE : " + userLang) // 요청 헤더에서 추출한 사용자 브라우저의 언어를 열거합니다.
                } else {
                    // IE에서 작동
                    /*
                     var ajaxCheckUrl = "http://ajaxhttpheaders.appspot.com";
                     if(opts.front_gate_way == "PUBLIC"){
                     ajaxCheckUrl = "https://ajaxhttpheaders.appspot.com";
                     }
                     jQuery.ajax({
                     url: ajaxCheckUrl,
                     dataType: 'jsonp',
                     success: function(headers) {
                     userLang = headers['Accept-Language'];
                     //alert("IE : " + userLang) // 요청 헤더에서 추출한 사용자 브라우저의 언어를 열거합니다.
                     }
                     });
                     */
                    userLang = navigator.userLanguage; // 시스템언어설정을 가져오는 것 같다.
                    //alert("IE : " + userLang) // 요청 헤더에서 추출한 사용자 브라우저의 언어를 열거합니다.
                }
            }

            // 팝업타입
            var fileName = "";
            if(opts.popup_type == "M"){
                if (userLang.indexOf("ja") >= 0) {
                    fileName = "esmMultiPopup_jp.jsp";
                    width = 690;
                } else if( userLang.indexOf("en") >= 0 ) {
                    fileName = "esmMultiPopup_en.jsp";
                    width = 690;
                } else if( userLang.indexOf("zh") >= 0 ) {
                    fileName = "esmMultiPopup_en.jsp";
                } else {
                    fileName = "esmMultiPopup.jsp";
                }
            }else if(opts.popup_type == "S"){
                if (userLang.indexOf("ja") >= 0) {
                    fileName = "esmSinglePopup_jp.jsp";
                } else if( userLang.indexOf("en") >= 0 ) {
                    fileName = "esmSinglePopup_en.jsp";
                }  else if( userLang.indexOf("zh") >= 0 ) {
                    fileName = "esmSinglePopup_en.jsp";
                } else {
                    fileName = "esmSinglePopup.jsp";
                }
                width = 342;
                height = 550;
                if(browserName == "safari"){
                    height = 490;
                }
                if( userLang.indexOf("en") >= 0 ) {
                    width = 360;
                }
            }

            var wOpener = document.documentElement.clientWidth;
            var hOpener = document.documentElement.clientHeight;
            if (window.screenX != undefined) {
                var yOpener = window.screenY;
                var xOpener = window.screenX;
            }else if (window.screenTop != undefined) {
                var yOpener = window.screenTop;
                var xOpener = window.screenLeft;
            }
            var xPopUp = xOpener + (wOpener - width)/2;
            var yPopUp = yOpener + (hOpener - height)/2;

            var top = yPopUp;
            var left = xPopUp;
            var scrollbars = "no";
            var toolbar = "no";
            var menubars = "no";
            var location = "no";
            var statusbar = "no";
            var resizable = "yes";
            var titlebar = "no";
            // 실행환경 설정
            var mappingUrl = MAPPING_URL_NHN;

            //alert("1. opts.server_type = " + opts.server_type + ", userLang = " + userLang + ", opts.user_lang = " + opts.user_lang);
            //opts.server_type = "sableLocal";
            //alert("2. opts.server_type = " + opts.server_type + ", userLang = " + userLang + ", opts.user_lang = " + opts.user_lang);
            if(opts.server_type == "local"){
                url = getHostDomain(opts.server_type, opts.corp_type, opts.front_gate_way) + ":8080" + mappingUrl + "/" + fileName;
            }else if(opts.server_type == "sableLocal"){
                url = "http://wesable.nhncorp.com:8080" + mappingUrl + "/" + fileName;
            }else if(opts.server_type == "dev"){
                url = getHostDomain(opts.server_type, opts.corp_type, opts.front_gate_way) + mappingUrl + "/" + fileName;
            }else if(opts.server_type == "live01"){
                url = getHostDomain(opts.server_type, opts.corp_type, opts.front_gate_way) + mappingUrl + "/" + fileName;
            }else if(opts.server_type == "live02"){
                url = getHostDomain(opts.server_type, opts.corp_type, opts.front_gate_way) + mappingUrl + "/" + fileName;
            }else if(opts.server_type == "live"){
                url = getHostDomain(opts.server_type, opts.corp_type, opts.front_gate_way) + mappingUrl + "/" + fileName;
            }

            opts.popup_url = getEsmPopupUrl(opts.server_type, opts.corp_type, opts.front_gate_way);
            //popup options
            var popup_options = "width=" + width + ",height=" + height;
            popup_options += ",left=" + left + ",top=" + top;
            popup_options += ",screenX=" + left + ",screenY=" + top;
            popup_options += ",scrollbars="  + scrollbars  + ",toolbar=" + toolbar + ",menubars=" + menubars;
            popup_options += ",location=" + location + ",statusbar=" + statusbar;
            popup_options += ",resizable="   + resizable + ",titlebar=" + titlebar;

            // div
            var nesmDiv = document.createElement("div");
            nesmDiv.id = "nesm_popup_form_wrap";
            nesmDiv.style.display = "none";
            document.body.appendChild(nesmDiv);
            // form
            var nesmForm = document.createElement("form");
            nesmForm.id = "nesm_popup_form";
            nesmForm.method = "post";
            nesmForm.target = "nesm_popup_window";
            nesmForm.action = url;
            nesmDiv.appendChild(nesmForm);
            // hidden
            setHiddenField("callback_function", opts.callback_function);
            setHiddenField("legacy_id", opts.legacy_id);
            setHiddenField("login_empno", opts.login_empno);
            setHiddenField("server_type", opts.server_type);
            setHiddenField("corp_type", opts.corp_type);
            setHiddenField("popup_url", opts.popup_url);
            setHiddenField("sch_txt", opts.sch_txt);
            setHiddenField("user_lang", userLang);

            function setHiddenField(name, value){
                var nesmHidden = document.createElement("input");
                nesmHidden.type = "hidden";
                nesmHidden.id = "nesm_" + name;
                nesmHidden.name = "nesm_" + name;
                nesmHidden.value = value;
                nesmForm.appendChild(nesmHidden);
            }

            document.getElementById(nesmForm.id).action = url;
            document.getElementById("nesm_callback_function").value = opts.callback_function;
            document.getElementById("nesm_legacy_id").value = opts.legacy_id;
            document.getElementById("nesm_login_empno").value = opts.login_empno;
            document.getElementById("nesm_server_type").value = opts.server_type;
            document.getElementById("nesm_corp_type").value = opts.corp_type;
            document.getElementById("nesm_popup_url").value = opts.popup_url;
            document.getElementById("nesm_sch_txt").value = opts.sch_txt;
            document.getElementById("nesm_user_lang").value = userLang;

            var nesmPopupWindow = null;
            if(opts.method == null || opts.method == "" || opts.method == "undefined"){
                opts.method = "GET";
            }

            if(opts.method == "GET"){
                url += "?nesm_callback_function=" + opts.callback_function;
                url += "&nesm_legacy_id=" + opts.legacy_id;
                url += "&nesm_login_empno=" + opts.login_empno;
                url += "&nesm_server_type=" + opts.server_type;
                url += "&nesm_corp_type=" + opts.corp_type;
                url += "&nesm_popup_url=" + opts.popup_url;
                url += "&nesm_sch_txt=" + encodeURIComponent(opts.sch_txt);
                url += "&nesm_user_lang=" + userLang;
                nesmPopupWindow = window.open(url,"nesm_popup_window",popup_options);
            }else{
                nesmPopupWindow = window.open(url,"nesm_popup_window",popup_options);
            }

            if(!nesmPopupWindow){
                if ( userLang.indexOf("ja") >= 0 ) {
                    alert("ポップアップブロックを解除してください。");
                } else if( userLang.indexOf("en") >= 0 || userLang.indexOf("zh") >= 0 ) {
                    alert("Please uncheck ‘block popup.’");
                } else {
                    alert("팝업차단을 해제해주세요.");
                }
                return;
            }

            if(opts.method == "POST"){
                nesmPopupWindow.focus();
                document.getElementById(nesmForm.id).submit();
            }
        },
        findOpen:function(opts){
            var schTxt = opts.sch_txt.replace(/^\s+|\s+$/g, ""); // trim
            if(schTxt == ""){
                this.open(opts);
                return;
            }
            // 웹서비스 url
            var esmPopupUrl = getEsmPopupUrl(opts.server_type, opts.corp_type, opts.front_gate_way);
            var schTxtUrl = esmPopupUrl + "/treejson";
            jQuery.getJSON(
                schTxtUrl, // url
                {legacyId: opts.legacy_id, schTxt:schTxt}, // parameter
                function(data){ // successhandler
                    nesmFindSchTxtArr = [];
                    var findResult = findOpenData(data, schTxt);
                    if(findResult && nesmFindSchTxtArr.length == 1){
                        nesmSetValue(nesmFindSchTxtArr, opts.callback_function);
                        // codepv
                        saveNesmService(nesmFindSchTxtArr, opts);
                        return;
                    }else{
                        nesmPopup.open(opts); // empty or 2건이상
                    }
                }
            );
        },
        findOpen2:function(opts){ // jsonp방식
            var schTxt = opts.sch_txt.replace(/^\s+|\s+$/g, ""); // trim
            if(schTxt == ""){
                this.open(opts);
                return;
            }
            // 웹서비스 url
            var esmPopupUrl = getEsmPopupUrl(opts.server_type, opts.corp_type, opts.front_gate_way);
            var schTxtUrl = esmPopupUrl + "/treejson";
            jQuery.ajax({
                async: false,
                type: "GET",
                url:  schTxtUrl,
                data: {legacyId: opts.legacy_id}, // parameter
                dataType: "jsonp",
                callback:"esmPopup",
                success: function(data, textStatus, XMLHttpRequest){
                    nesmFindSchTxtArr = [];
                    var findResult = findOpenData(data, schTxt);
                    if(findResult && nesmFindSchTxtArr.length == 1){
                        nesmSetValue(nesmFindSchTxtArr, opts.callback_function);
                        // codepv
                        saveNesmService2(nesmFindSchTxtArr, opts);
                        return;
                    }else{
                        nesmPopup.open(opts); // empty or 2건이상
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    alert("Error: Popup tree!");
                }
            });
        }
    }

    function nesmSetValue(data, callBackFunction) {
        if( data == null ) {
            alert("empty!");
            return;
        }

        eval(callBackFunction)(data);
    }

    function findOpenData(jsonData, schTxt){
        for(var i=0; i < jsonData.length; i++){
            if(nesmFindSchTxtArr.length > 1){
                return false;
            }
            findOpenDataHandler(jsonData[i], schTxt);
        }

        if(nesmFindSchTxtArr.length == 0){
            return false;
        }

        return true;
    }

    function findOpenDataHandler(jsonData, schTxt){
        if(nesmFindSchTxtArr.length > 1){
            return false;
        }

        var cdGbn = jsonData.attr.cdGbn;
        var dataNmAll = jsonData.attr.dataNmAll
        // 검색어 체크
        if(cdGbn){
            if(cdGbn != 'G' && (dataNmAll.toLowerCase().indexOf(schTxt.toLowerCase())) >= 0){
                var jsonObj = new Object();
                jsonObj["dataCd"] = jsonData.attr.dataCd;
                jsonObj["dataNm"] = jsonData.attr.dataNm;
                jsonObj["dataPath"] = jsonData.attr.dataPath;
                nesmFindSchTxtArr.push(jsonObj);
            }
        }

        if(jsonData.children){
            var children = jsonData.children;
            for(var i=0; i < children.length; i++){
                findOpenDataHandler(children[i], schTxt);
            }
        }
    }

    function saveNesmService(nesmFindSchTxtArr, opts){
        if(opts.login_empno == null || opts.login_empno == "" || opts.login_empno == "undefined"){
            return;
        }
        var jsonParam = new Object();
        jsonParam["loginEmpNo"] = opts.login_empno;
        jsonParam["myServiceCds"] = nesmFindSchTxtArr[0].dataCd
        // codepv
        jsonParam["legacyId"] = opts.legacy_id;
        jsonParam["codePvCds"] = nesmFindSchTxtArr[0].dataCd;
        var esmPopupUrl = getEsmPopupUrl(opts.server_type, opts.corp_type, opts.front_gate_way);
        jsonParam["url"] = esmPopupUrl + "/post/myservice/save";
        var ajaxParam = new Object();
        ajaxParam.url = esmPopupUrl + "/post/myservice";
        ajaxParam.data = makeCodePvJson(jsonParam);
        nesmAjaxPostSendHandler(ajaxParam,
            function(){
                // success
            }, function(){
                // error
                alert("최근사용코드 저장 에러!");
            });
    }

    // jsonp
    function saveNesmService2(nesmFindSchTxtArr, opts){
        if(opts.login_empno == null || opts.login_empno == "" || opts.login_empno == "undefined"){
            return;
        }
        var jsonParam = new Object();
        jsonParam["loginEmpNo"] = opts.login_empno;
        jsonParam["myServiceCds"] = nesmFindSchTxtArr[0].dataCd
        // codepv
        jsonParam["legacyId"] = opts.legacy_id;
        jsonParam["codePvCds"] = nesmFindSchTxtArr[0].dataCd;
        var saveMyServiceUrl = getSaveMyServiceUrl(opts.server_type, opts.corp_type, opts.front_gate_way);
        var ajaxParam = new Object();
        ajaxParam.data = makeCodePvJson(jsonParam);

        jQuery.ajax({
            type: "POST",
            async: false,
            timeout: 1000,
            url:  saveMyServiceUrl,
            data: {"postData":ajaxParam.data},
            dataType: "jsonp",
            callback:"esmPopup",
            contentType : "application/x-www-form-urlencoded",
            success: function(data, textStatus, XMLHttpRequest){
                if(data.result == "error"){
                    alert("최근사용코드 저장 에러!");
                }
                return true;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                alert("최근사용코드 저장 에러!");
                return false;
            }
        });

    }

    function makeCodePvJson(param){
        var jsonData = "{'loginEmpNo':'" + param.loginEmpNo
            + "','myServiceCds':'" + param.myServiceCds
            + "','legacyId':'" + param.legacyId
            + "','codePvCds':'" + param.codePvCds
            + "','url':'" + param.url +"'}";
        return jsonData;
    }

    // ajax전송함수
    function nesmAjaxPostSendHandler(param, successHandler, errorHandler){
        jQuery.ajax({
            type: "POST",
            async: true,
            timeout: 1000,
            url:  param.url,
            data: param.data,
            dataType: "text",
            contentType : "text/plain",
            success: successHandler,
            error: errorHandler
            /*
             success: function(data, textStatus, XMLHttpRequest){
             return true;
             },
             error: function(XMLHttpRequest, textStatus, errorThrown){
             return false;
             }
             */
        });
    }

    function getSaveMyServiceUrl(serverType, nesmType, frontGateWay){
        var hostDomain = getHostDomain(serverType, nesmType, frontGateWay);
        var mappingSaveServiceUrl = MAPPING_SAVE_SERVICE_URL_NHN;
        var saveServiceUrl = "";
        if(serverType == "local"){
            saveServiceUrl = hostDomain + ":8080";
        }else if(serverType == "dev"){
            saveServiceUrl = hostDomain;
        }else if(serverType == "live01"){
            saveServiceUrl = hostDomain;
        }else if(serverType == "live02"){
            saveServiceUrl = hostDomain;
        }else if(serverType == "live"){
            saveServiceUrl = hostDomain;
        }

        saveServiceUrl += mappingSaveServiceUrl;

        return saveServiceUrl;
    }

    function getEsmPopupUrl(serverType, nesmType, frontGateWay){
        var hostDomain = getHostDomain(serverType, nesmType, frontGateWay);
        var mappingWsUrl = MAPPING_WS_URL_NHN;
        var esmPopupUrl = "";
        if(serverType == "local"){
            esmPopupUrl = hostDomain + ":8080" + mappingWsUrl;
        }else if(serverType == "dev"){
            esmPopupUrl = hostDomain + mappingWsUrl;
        }else if(serverType == "live01"){
            esmPopupUrl = hostDomain + mappingWsUrl;
        }else if(serverType == "live02"){
            esmPopupUrl = hostDomain + mappingWsUrl;
        }else if(serverType == "live"){
            esmPopupUrl = hostDomain + mappingWsUrl;
        }
        return esmPopupUrl;
    }

    function getHostDomain(serverType, nesmType, frontGateWay){
        var mainDomain = "";
        var hostDomain = document.domain;
        var schemeHttp = "http://";
        if(frontGateWay == "PUBLIC"){
            schemeHttp = "https://";
        }
        if(serverType == "local"){
            mainDomain = schemeHttp + "kwonys.";
            if(nesmType == "nesment"){
                mainDomain = schemeHttp + "kwonysent.";
            }
        }else if(serverType == "dev"){
            mainDomain = schemeHttp + "esmdev.";
            if(nesmType == "nesment"){
                mainDomain = schemeHttp + "esmdevent.";
            }
        }else if(serverType == "live01"){
            mainDomain = schemeHttp + "nesm01.";
            if(nesmType == "nesment"){
                mainDomain = schemeHttp + "nesment01.";
            }
        }else if(serverType == "live02"){
            mainDomain = schemeHttp + "nesm02.";
            if(nesmType == "nesment"){
                mainDomain = schemeHttp + "nesment02.";
            }
        }else if(serverType == "live"){
            mainDomain = schemeHttp + "nesm.";
            if(nesmType == "nesment"){
                mainDomain = schemeHttp + "nesment.";
            }
            if(hostDomain == "nsbc.co.kr"){
                mainDomain = "http://neon-ess.";
            }
        }

        return mainDomain + hostDomain;
    }

    // --------------- end of copy -------------------------

    /**
     * @param callbackName String callback function name, must be string because it's used by popup window.
     * @param legacyId     String lagacy system id, it look like token of ESM.
     * @param empNo        String employee number of logined user
     * @param serverType   String "dev" or "live", envirement
     */
    return function popup(callbackName, legacyId, empNo, serverType){
        var opts = {
            "callback_function": callbackName, // 콜백함수명
            "legacy_id": legacyId,             // 레거시 시스템 id, 서비스 별로 달라지는 일종의 토큰
            "login_empno": empNo,              // 로그인유저사번
            "server_type":serverType,          // dev:개발, live:운영
            "popup_type": "S",                 // M:멀티형, S:싱글형
            "sch_txt": "",
        };
        nesmPopup.findOpen(opts);              // 단일검색결과리턴 및 검색연동 공통팝업
    }
})(jQuery);
