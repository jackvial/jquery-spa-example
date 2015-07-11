// Location polyfill for ie, ff < 21.0 and safari
if (typeof window.location.origin === "undefined"){
    window.location.origin = window.location.protocol + "//" + window.location.host;
}

// Utility (helper) functions
var utils = {

    // Finds a handlebars template by id.
    // Populates it with the passed in data
    // Appends the generated html to div#order-page-container
    renderPageTemplate: function(templateId, data) {
        var _data = data || {};
        var templateScript = $(templateId).html();
        var template = Handlebars.compile(templateScript);


        // Empty the container and append new content
        $("#page-container").empty();

        // Empty the container and append new content
        $("#page-container").append(template(_data));
    },

    // If a hash can not be found in routes
    // then this function gets called to show the 404 error page
    pageNotFoundError: function() {

        var data = {
            errorMessage: "404 - Page Not Found"
        };
        this.renderPageTemplate("#error-page-template", data);
    },

    // Fetch json data from the given url
    // @return promise
    fetch: function(url, data) {
        var _data = data || {};
        return $.ajax({
            context: this,
            url: window.location.origin + "/" + url,
            data: _data,
            method: "GET",
            dataType: "JSON"
        });
    }
};


/**
 *  Router - Handles routing and rendering for the order pages
 *
 *  Summary:
 *      - url hash changes
 *      - render function checks routes for the hash changes
 *      - function for that hash gets called and loads page content 
 */
var router = {

    // An object of all the routes
    routes: {},
    init: function() {
        console.log('router was created...');
        this.bindEvents();

        // Manually trigger a hashchange to start the router.
        // This make the render function look for the route called "" (empty string)
        // and call it"s function
        $(window).trigger("hashchange");
    },
    bindEvents: function() {

        // Event handler that calls the render function on every hashchange.
        // The render function will look up the route and call the function
        // that is mapped to the route name in the route map.
        // .bind(this) changes the scope of the function to the
        // current object rather than the element the event is bound to.
        $(window).on("hashchange", this.render.bind(this));
    },
    // Checks the current url hash tag
    // and calls the function with that name
    // in the routes
    render: function() {

        // Get the keyword from the url.
        var keyName = window.location.hash.split("/")[0];

        // Grab anything after the hash
        var url = window.location.hash;

        // Hide whatever page is currently shown.
        $("#page-container")
            .find(".active")
                .hide()
                    .removeClass("active");

        // Call the the function
        // by key name
        if (this.routes[keyName]) {
            this.routes[keyName](url);

            // Render the error page if the 
            // keyword is not found in routes.
        } else {
            utils.pageNotFoundError();
        }
    }
};

var spaRoutes = {

    // Default route (home page)
    "#home": function(url) {
        console.log('home was called...');
        utils.renderPageTemplate("#home-page-template");
    },
    "#about": function(url) {
        console.log('about was called...');
        utils.renderPageTemplate("#about-page-template");
    },
    "#contact": function(url) {
        console.log('contact was called...');
        utils.renderPageTemplate("#contact-page-template");
    }
};

// Create a new instance of the router
var spaRouter = $.extend({}, router, {
    routes: spaRoutes
});

spaRouter.init();
window.location.hash = "#home";