instax = window.instax || {}
instax.dashboard = (function(){
    return {
        init : init
    }

    function cookieCheck(keyname){
        return window._Cookies.get("hide-help") == "true";
    }

    function init(){

        if(!cookieCheck("hide-help")){
            $("#help").include().then(function(){
                $("#help").show();
            });
        }

        $(document).includeAll().then(function(){
            $(".metismenu").metisMenu();

            // Minimalize menu
            $('.navbar-minimalize').click(function () {
                $("body").toggleClass("mini-navbar");
                SmoothlyMenu();
            });


            //lazy load
            $(".right-sidebar-toggle").click(function () {
                $("#right-sidebar").lazyload().then(function(){
                    $('#right-sidebar').toggleClass('sidebar-open');
                });
            });
            console.log("done!");
        });

        //$("#chat").load("/common/chat.html");
    }
})();
