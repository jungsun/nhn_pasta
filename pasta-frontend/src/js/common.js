
/* custom jquery plugins */

// include
(function($){
    $.fn.include = function(callback) {

        var deferred = $.Deferred();

        var targetUrl = this.attr("data-include") || this.attr("include");

        if (targetUrl) {
            this.load(targetUrl, function(){
               deferred.resolve();
            });
        }
        return deferred.promise();
    };
})(jQuery);

// include all
(function($){
    $.fn.includeAll = function() {
        var promise = this.find("[data-include], [include]").map(function(index, elem){
            return $(elem).include();
        });

        return $.when.apply($, promise.get());
    }
})(jQuery);

// lazy load
(function($){
    $.fn.lazyload = function() {
        var deferred = $.Deferred();
        if(!this.data("isLoaded")){
            var that = this;
            var targetUrl = this.attr("data-lz-include") || this.attr("lz-include");

            this.load(targetUrl, function(){
                that.data("isLoaded", true);
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise();
    }
})(jQuery);
