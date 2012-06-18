/**
 * A small helper to work with Wookmark.js and create a endless scroll with ajax request.
 * This is very similar to the exemple-api on wookmark.js docs.
 * The difference between the example and this lib, is only organization and some refactoring.
 *
 * If you want to use another web service, return your JSON like this:
 *
 *
 {
     "id":"94766",
     "title":"Branding | How to Start a Fire","referer":
     "http:\/\/howtostartafire.canopybrandgroup.com\/?cat=5",
     "url":"http:\/\/www.wookmark.com\/image\/94766\/branding-how-to-start-a-fire",
     "width":"1000",
     "height":"1500",
     "image":"http:\/\/www.wookmark.com\/images\/original\/94766_paramount_big.gif",
     "preview":"http:\/\/www.wookmark.com\/images\/thumbs\/94766_paramount_big.gif"
 }
 * or just edit this lib as you wish.
 * This little lib was made for study.
 */

var PintEndlessScroll = function () {
    var requestURL,
        handler,
        isLoading,
        page,
        options;

    this.init = function () {
        this.requestURL  = 'http://www.wookmark.com/api/json/popular';
        this.handler     = null,
        this.isLoading   = false,
        this.page        = 1,
        this.options     = { // Wookmark Options
            autoResize: true, // This will auto-update the layout when the browser window is resized.
            container: $('#tiles'), // Optional, used for some extra CSS styling
            offset: 2, // Optional, the distance between grid items
            itemWidth: 210 // Optional, the width of a grid item
        };

        var self = this;
        $(document).on('scroll', function () { self.onScroll() });
        this.requestData();
    };

    this.onScroll = function (event) {
        // Only check when we're not still waiting for data.
        if(!this.isLoading) {
            // Check if we're within 100 pixels of the bottom edge of the broser window.
            var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);
            if(closeToBottom) {
                this.requestData();
            }
        }
    };

    this.renderLayout = function () {
        // Clear our previous layout handler.
        if(this.handler) this.handler.wookmarkClear();

        // Create a new layout handler.
        this.handler = $('#tiles li');
        this.handler.wookmark(options);
    };

    this.requestData = function () {
        var self = this;
        this.isLoading = true;
        $('#loaderCircle').show();
        $.ajax({
            url: this.requestURL,
            dataType: 'jsonp',
            data: {page: this.page},
            success: myCallBack = function (data) { self.parseRequest(data) }
        });
    };

    this.parseRequest = function (data) {
        this.isLoading = false;
        $('#loaderCircle').hide();

        // Increment page index for future calls.
        this.page++;

        // Create HTML for the images.
        var html = '';
        var i=0, length=data.length, image;
        for(; i<length; i++) {
        image = data[i];
        html += '<li class="newLoadContent" style="display: none">';

        // Image tag (preview in Wookmark are 200px wide, so we calculate the height based on that).
        html += '<img src="'+image.preview+'" width="200" height="'+Math.round(image.height/image.width*200)+'">';

        // Image title.
        html += '<p>'+image.title+'</p>';

        html += '</li>';
        }

        // Add image HTML to the page.
        $('#tiles').append(html);
        $('.newLoadContent').fadeIn(1000); // fade content in 1 second

        // Apply layout.
        this.renderLayout();
    };

    return this.init();
};