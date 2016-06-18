instax = window.instax || {}
instax.project = instax.project || {}
instax.project.create = (function() {
    // default config
    var config = {
        nssApiEndpoint: "http://imapi-dev.navercorp.com",
        limit: 10,
        esm: {
            serverType: "dev"
        }
    };

    function initUserSearcher(){
        var options = {
            plugins: ['remove_button'],
            valueField: 'empNo',
            labelField: 'dispNm',
            searchField: ['dispNm','deptNm'],
            create : false,
            render: {
                option: function(item, escape){
                    return [
                        '<div>',
                        '<span>%</span>'.replace("%", item.dispNm),
                        (item.deptNm ? '<span>[ % ]</span>'.replace("%", item.deptNm) : ""),
                        '</div>'
                    ].join(" ")
                }
            },
            load: function(query, callback){
                // TODO querying user
                // mainDomain + "/imDataService/getAutoCompleteJSONP";

                $.ajax({
                    url: config.nssApiEndpoint + "/imDataService/getAutoCompleteJSONP",
                    type: "POST",
                    dataType: 'jsonp',
                    async: true,
                    data: {
                        'method' : "autoCompleteJSONP",
                        'keyword' : query,
                        'type' : "empdept",
                        'limit' : config.limit,
                        'userDispYn' : "NO", //display All user (include hide user)
                        'language' : "ko_KR",
                        'reqDate' : new Date().getTime()
                    },
                    success: function(res) {
                        callback(res);
                    },
                    error: function(){
                        console.log("error");
                        callback();
                    }
                });
            }
        };

        $("select[name=admin]").selectize(options);
        $("select[name=users]").selectize(options);
    }

    function initESMCodeSearcher(){
        // XXX
        // EMS code 측에서 callback function처리를 잘못하여 항상 nesmSetValue로 callback을 하게 되어 있음.
        // callback function name에는 아무 문자열이나 들어가도 상관 없음.
        window["nesmSetValue"] = function(data, callbackName){
            esmCallback(data);
        }

        $("#esm .search").on("click", function(){
            ESMpopup(
                "__dummy__function__",
                config.esm.legacyId, //lagacy id
                config.esm.empNo, //empNo
                config.esm.serverType // serverType
            );
        });

        function esmCallback(data){
            $("#esm .text").val(data[0].dataCd);
        }

        /*
         function makeRamdomCallback(callback){
         var name = "__random_callback_" + Math.round(Math.random() * 3872472) + "__";

         window[name] = function(){
         callback.apply(this, arguments);
         }

         return name;
         }
         */
    }

    return {
        init : function(opt){
            config.nssApiEndpoint = opt.nssApiEndpoint || config.nssApiEndpoint;

            config.esm.legacyId   = opt.esm && opt.esm.legacyId   ? opt.esm.legacyId   : config.esm.legacyId;
            config.esm.empNo      = opt.esm && opt.esm.empNo      ? opt.esm.empNo      : config.esm.empNo;
            config.esm.serverType = opt.esm && opt.esm.serverType ? opt.esm.serverType : config.esm.serverType;

            console.log(config);

            initESMCodeSearcher();
            initUserSearcher();
        }
    }
})();
