// Igloo Theme 4 //
var body = document.body;
var IglooApp = function () {
    /*======================================
      #Set browser class
    ======================================*/
    try {
        navigator.browserSpecs = (function () {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return { name: 'IE', version: (tem[1] || '') };
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null)
                    return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null)
                M.splice(1, 1, tem[1]);
            return { name: M[0], version: M[1] };
        })();
        (function () {
            var OSName = "os";
            if (navigator.appVersion.indexOf("Win") != -1)
                OSName = "windows";
            else if (navigator.appVersion.indexOf("Mac") != -1)
                OSName = "macos";
            else if (navigator.appVersion.indexOf("X11") != -1)
                OSName = "unix";
            else if (navigator.appVersion.indexOf("Linux") != -1)
                OSName = "linux";
            body.classList.add(OSName);
            if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
                body.classList.add('browser-opera');
            }
            else if (navigator.userAgent.indexOf("Chrome") != -1) {
                body.classList.add('browser-chrome');
            }
            else if (navigator.userAgent.indexOf("Safari") != -1) {
                body.classList.add('browser-safari');
            }
            else if (navigator.userAgent.indexOf("Firefox") != -1) {
                body.classList.add('browser-firefox');
            }
            else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
                body.classList.add('browser-explorer');
            }
            else if (navigator.userAgent.indexOf("Edge") != -1) {
                body.classList.add('browser-edge');
            }
            if (navigator.browserSpecs.version) {
                body.classList.add('browser-version-' + navigator.browserSpecs.version);
            }
            var el = document.createElement('div');
            el.setAttribute('ongesturestart', 'return;');
            if (typeof el.ongesturestart == "function") {
                body.classList.add("touch");
            }
            else {
                body.classList.add("no-touch");
            }
        })();
    }
    catch (err) {
        console.error(err);
    }
    /*======================================
      #Set .scroll class on scroll
    ======================================*/
    //Add the .scroll class to body when passing the io-hook placed over the header
    var ioHook = document.querySelector(".io-hook");
    if (ioHook) {
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].boundingClientRect.y < 0) {
                body.classList.add('scroll');
            }
            else {
                body.classList.remove('scroll');
            }
        });
        observer.observe(ioHook);
    }
    /*======================================
      #Toggle mobile nav
    ======================================*/
    (function () {
        //Toggle mobile navigation
        var hamburger = document.querySelector(".hamburger");
        if (hamburger) {
            hamburger.addEventListener("click", function (e) {
                e.preventDefault();
                body.classList.toggle("mobile-nav-visible");
            });
        }
        // Toggle second level mobile navigation
        var expand = document.querySelectorAll(".main-nav ul li a .expand");
        expand.forEach(function (item) {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                var ul = item.closest("li").querySelector("ul");
                item.classList.toggle("open");
                ul.classList.toggle("mobile-open");
                if (ul.style.display == 'block') {
                    ul.style.display = 'none';
                }
                else {
                    ul.style.display = 'block';
                }
            });
        });
    })();
    /*======================================
      #Adjust offscreen navigation
    ======================================*/
    window.addEventListener('load', function () {
        var navItems = document.querySelectorAll(".main-nav .main-nav__ul .main-nav__ul");
        var screenWidth = window.outerWidth;
        navItems.forEach(function (item) {
            var rightEdge = item.getBoundingClientRect().right;
            // Change position of dropdown if it is positioned outside viewport
            if (rightEdge > screenWidth) {
                item.classList.add("go-right");
            }
        });
    });
    /*======================================
      #Navigation touch support
    ======================================*/
    (function () {
        var items = document.querySelectorAll(".main-nav ul li .main-nav__a, .pre-top__list li a");
        var navAllLi = document.querySelectorAll(".main-nav__li, .pre-top__list li");
        items.forEach(function (item) {
            item.addEventListener("focus", handler, { passive: true });
            item.addEventListener("touchstart", handler, { passive: true });
        });
        function handler(e) {
            var navLi = e.target.parentElement;
            var dropExist = navLi.querySelector("ul");
            if (!navLi.classList.contains('touch-open') && dropExist && !body.classList.contains("mobile-nav-visible")) {
                e.preventDefault();
                var parentLis_1 = getParents(navLi, ".touch-open");
                navAllLi.forEach(function (liEl) {
                    if (parentLis_1[0] != liEl && parentLis_1[1] != liEl) {
                        liEl.classList.remove('touch-open');
                    }
                });
                navLi.classList.add('touch-open');
            }
            else if (dropExist) {
                navAllLi.forEach(function (liEl) {
                    liEl.classList.remove('touch-open');
                });
            }
        }
    })();
    /*======================================
      #Responsive video
    ======================================*/
    fluidvids.init({
        selector: ['iframe', 'object'],
        players: ['www.youtube.com', 'player.vimeo.com']
    });
    /*======================================
      #Googlemap
    ======================================*/
    (function () {
        var maps = document.querySelectorAll(".map .map__canvas");
        maps.forEach(function (map) {
            var mapCanvas = map, lat = map.dataset.lat, long = map.dataset.long, pin = map.dataset.pin, zoom = parseInt(map.dataset.zoom);
            var mapOptions = {
                center: new google.maps.LatLng(lat, long),
                zoom: zoom,
                scrollwheel: false
            };
            var mapobj = new google.maps.Map(mapCanvas, mapOptions);
            if (pin == "no") {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, long),
                    map: mapobj
                });
            }
            else {
                var image = {
                    url: pin,
                    scaledSize: new google.maps.Size(50, 50)
                };
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, long),
                    map: mapobj,
                    optimized: false,
                    icon: image
                });
            }
        });
    })();
    /*======================================
     #Instagram
   ======================================*/
    (function () {
        var instagramFeeds = document.querySelectorAll("#instafeed");
        instagramFeeds.forEach(function (instafeed) {
            var count = instafeed.dataset.count, link = instafeed.dataset.link, icon = instafeed.dataset.icon, token = instafeed.dataset.token, username = instafeed.dataset.username, template = "", linkstart = "", linkend = "", iconlink = "";
            if (link == "1") {
                linkstart = '<a href="{{link}}" class="instagram-image-link" rel="noopener" target="_blank">';
                linkend = '</a>';
            }
            if (icon == "1") {
                iconlink = '<a target="_blank" rel="noopener" class="instagram-user-link" title="Instagram: @' + username + '" href="https://www.instagram.com/' + username + '"><i class="fa fa-instagram" aria-hidden="true"></a></i>';
            }
            template = '<div class="gallery__item"><figure>' + iconlink + '' + linkstart + '<img src="{{image}}" alt="{{caption}}">' + linkend + '</figure></div>';
            // Get images
            var feed = new Instafeed({
                accessToken: token,
                limit: parseInt(count),
                template: template
            });
            feed.run();
        });
    })();
    /*======================================
      #PhotoSwipe gallery
    ======================================*/
    (function () {
        var gallery = document.querySelectorAll(".gallery, .pswp-gallery");
        var pswp = document.querySelector(".pswp");
        gallery.forEach(function (pic) {
            var getItems = function () {
                var items = [];
                var aItems = pic.querySelectorAll(".gallery__link");
                aItems.forEach(function (aItem) {
                    var href = aItem.getAttribute("href");
                    var size = aItem.getAttribute("data-size").split('x');
                    var width = size[0];
                    var height = size[1];
                    var item = {
                        src: href,
                        w: width,
                        h: height
                    };
                    items.push(item);
                });
                return items;
            };
            var items = getItems();
            var figures = pic.querySelectorAll("figure");
            figures.forEach(function (figure, index) {
                figure.addEventListener("click", function (e) {
                    e.preventDefault();
                    var options = {
                        index: index,
                        bgOpacity: 0.9,
                        showHideOpacity: true,
                        shareEl: false,
                        getThumbBoundsFn: function (index) {
                            var thumbnail = pic.querySelectorAll('.gallery__link img')[index];
                            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                            var rect = thumbnail.getBoundingClientRect();
                            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                        }
                    };
                    // Initialize PhotoSwipe
                    var lightBox = new PhotoSwipe(pswp, PhotoSwipeUI_Default, items, options);
                    lightBox.init();
                });
            });
        });
    })();
    /*======================================
      #Accordion
    ======================================*/
    (function () {
        var accItems = document.querySelectorAll(".acc__head");
        accItems.forEach(function (acc) {
            acc.addEventListener("click", function (e) {
                e.preventDefault();
                acc.closest(".acc").classList.toggle("acc--open");
            });
        });
    })();
    /*======================================
      #Share modals
    ======================================*/
    (function () {
        var shareButtons = document.querySelectorAll(".share-list a[data-width]");
        shareButtons.forEach(function (item) {
            item.addEventListener("click", function (e) {
                if (window.outerWidth > 768) {
                    e.preventDefault();
                    var targetUrl = item.getAttribute("href");
                    var winWidth = item.dataset.width;
                    var winHeight = item.dataset.height;
                    PopupCenter(targetUrl, 'sharer', winWidth, winHeight);
                }
            });
        });
        function PopupCenter(url, title, w, h) {
            var dualScreenLeft = window.screenLeft;
            var dualScreenTop = window.screenTop;
            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
            if (window.focus) {
                newWindow.focus();
            }
        }
    })();
    /*======================================
      #Contact Form
    ======================================*/
    (function () {
        var contactForms = document.querySelectorAll("#contact-form");
        contactForms.forEach(function (item) {
            item.addEventListener("submit", function (e) {
                e.preventDefault();
                var form = this;
                if (form.checkValidity()) {
                    form.querySelector(".button").classList.add("button--loading");
                    var formData = new FormData(form);
                    var url = form.getAttribute("action");
                    var object = {};
                    formData.forEach(function (value, key) { object[key] = value; });
                    axios({
                        url: url,
                        method: "POST",
                        data: object
                    }).then(function (response) {
                        if (response.data.success) {
                            form.innerHTML = '<svg aria-hidden="true" class="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg><h4 class="success-color text-center">' + form.dataset.thankyoumessage + '</h4>';
                        }
                        else {
                            form.innerHTML = form.innerHTML + '<div class="col-100 text-center"><p><strong class="error-color">' + response.data.message + '</strong></p></div>';
                        }
                    })["catch"](function (error) {
                        console.log(error);
                    });
                }
            });
        });
    })();
    /*======================================
      #Newsletter
    ======================================*/
    (function () {
        var newsletterForms = document.querySelectorAll(".newsletter form");
        newsletterForms.forEach(function (item) {
            item.addEventListener("submit", function (e) {
                e.preventDefault();
                var form = this;
                if (form.checkValidity()) {
                    form.querySelector(".button").classList.add("button--loading");
                    var formData = new FormData(form);
                    var url = form.getAttribute("action");
                    var object = {};
                    formData.forEach(function (value, key) { object[key] = value; });
                    axios({
                        url: url,
                        method: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "JSON",
                        data: object
                    }).then(function (response) {
                        if (response.data.success) {
                            form.parentElement.innerHTML = '<svg aria-hidden="true" class="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg><h4 class="success-color text-center">' + form.dataset.thankyoumessage + '</h4>';
                        }
                        else {
                            form.parentElement.innerHTML = form.parentElement.innerHTML + '<div class="col-100 text-center"><p><strong class="error-color">' + response.data.message + '</strong></p></div>';
                        }
                    });
                }
            });
        });
    })();
    /*======================================
      #Search Header
    ======================================*/
    (function () {
        var toggleSearchButtons = document.querySelectorAll(".toggle-search a, .show-search, .search__close, .search-overlay");
        var searchInput = document.querySelector(".search__stage .search__input");
        var autocomplete = document.querySelector(".search__autocomplete");
        var loader = document.querySelector(".search__loader");
        // Toogle search modal
        toggleSearchButtons.forEach(function (toggleSearchButton) {
            toggleSearchButton.addEventListener("click", function (e) {
                e.preventDefault();
                body.classList.toggle("search-visible");
                //Set focus to search field
                if (body.classList.contains("search-visible")) {
                    setTimeout(function () {
                        searchInput.focus();
                    }, 400);
                }
            });
        });
        // Close search model on ESC
        document.addEventListener("keyup", function (e) {
            if (e.keyCode == 27) {
                body.classList.remove("search-visible");
            }
        });
        // Autocomplete Header
        var searchTimeout = null;
        if (searchInput) {
            searchInput.addEventListener("input", function (e) {
                var query = searchInput.value;
                // Show/hide search results
                if (query.length > 2) {
                    autocomplete.style.display = "block";
                }
                else {
                    autocomplete.style.display = "none";
                }
                // Show loader
                loader.classList.add("loading");
                if (searchTimeout != null) {
                    clearTimeout(searchTimeout);
                }
                // Do the search!
                searchTimeout = setTimeout(function () {
                    doSearch(query);
                }, 300);
            });
        }
    })();
    function doSearch(query) {
        var searchTimeout = null;
        var loader = document.querySelector(".search__loader");
        var noResults = document.querySelector(".search__no-results");
        var button = document.querySelector(".search__autocomplete .button");
        var suggest = document.querySelector(".search__suggest");
        var resultCount = document.querySelector(".search__result-count");
        axios({
            url: "/Umbraco/Api/IglooSearch/Search?Query=" + query + "&Amount=6&Page=1&SiteId=" + body.dataset.siteid + "&Culture=" + body.dataset.culture,
            method: "GET"
        }).then(function (response) {
            // Clear suggest list
            suggest.innerHTML = "";
            if (response.data.result.length == 0) {
                button.style.display = "none";
                suggest.style.display = "none";
                noResults.style.display = "block";
            }
            else {
                button.style.display = "block";
                suggest.style.display = "block";
                noResults.style.display = "none";
                for (var i = 0; i < response.data.result.length; i++) {
                    suggest.innerHTML += '<li><a href="' + response.data.result[i].url + '"><span class="search__suggest-info"><span class="search__suggest-title">' + response.data.result[i].title + '</span><span class="search__suggest-desc">' + response.data.result[i].description + '</span></span></a></li>';
                }
            }
            // Hide loader
            loader.classList.remove("loading");
            // Update result count
            resultCount.innerHTML = ("(" + response.data.resultCount + ")");
        })["catch"](function () {
            loader.classList.remove("loading");
        });
    }
    /*======================================
      #Full Search
    ======================================*/
    (function () {
        var searchInput = document.querySelector(".search-block .search__form .search__input");
        var pager = document.querySelector(".search-pagination-container button");
        if (searchInput) {
            //Preform search on page load
            doFullSearch(searchInput.value, 1);
            //Preform search on input change
            searchInput.addEventListener("input", function (e) {
                doFullSearch(searchInput.value, 1);
                document.querySelector(".query").innerHTML = '"' + searchInput.value + '"';
            });
            //pager
            pager.addEventListener("click", function (e) {
                pager.dataset.currentPage = (pager.dataset.currentPage ? parseInt(pager.dataset.currentPage) + 1 : 2).toString();
                doFullSearch(searchInput.value, parseInt(pager.dataset.currentPage));
            });
        }
    })();
    function doFullSearch(query, page) {
        var resultLabelSingle = document.querySelector(".search-results-count-label.single");
        var resultLabelMultible = document.querySelector(".search-results-count-label.multi");
        var resultLabelCount = document.querySelector(".search-results-count");
        var resultLabelQuery = document.querySelector(".search-result-info strong.query");
        var searchEmpty = document.querySelector(".search-empty");
        var pager = document.querySelector(".search-pagination-container");
        var amountPerPageElement = document.querySelector(".search-pagination-amount");
        var amountPerPage = parseInt(amountPerPageElement.value);
        axios({
            url: "/Umbraco/Api/IglooSearch/Search?Query=" + query + "&Amount=" + amountPerPage + "&Page=" + page + "&SiteId=" + body.dataset.siteid + "&Culture=" + body.dataset.culture + "&ExtendedModel=true",
            method: "GET"
        }).then(function (response) {
            if (response.data.resultCount == 1) {
                resultLabelSingle.style.display = 'inline-block';
                resultLabelMultible.style.display = 'none';
            }
            else {
                resultLabelMultible.style.display = 'inline-block';
                resultLabelSingle.style.display = 'none';
            }
            resultLabelCount.textContent = '"' + query + '"';
            resultLabelCount.textContent = response.data.resultCount;
            // No results
            if (response.data.resultCount == 0) {
                searchEmpty.style.display = 'block';
                document.querySelectorAll('.search-result, .search-result-container').forEach(function (e) { return e.remove(); });
                pager.style.display = 'none';
            }
            else {
                searchEmpty.style.display = 'none';
                if (page == 1) {
                    document.querySelectorAll('.search-result, .search-result-container').forEach(function (e) { return e.remove(); });
                }
                var template = document.querySelector(".search-results template");
                for (var i = 0; i < response.data.result.length; i++) {
                    var clone = template.content.cloneNode(true);
                    if (response.data.result[i].imageUrl && clone.querySelector("img")) {
                        clone.querySelector("img").setAttribute("data-src", response.data.result[i].imageUrl + "?anchor=center&amp;mode=crop&amp;width=500&amp;height=350&amp;rnd=132154250515800000");
                    }
                    clone.querySelectorAll("a").forEach(function (e) { return e.setAttribute("href", response.data.result[i].url); });
                    clone.querySelector("h3 a").textContent = response.data.result[i].title;
                    clone.querySelector("p").textContent = response.data.result[i].description;
                    template.parentElement.appendChild(clone);
                }
                if (document.querySelectorAll(".search-result, .search-result-container").length < response.data.resultCount) {
                    pager.style.display = 'block';
                }
                else {
                    pager.style.display = 'none';
                }
            }
            resultLabelCount.innerHTML = response.data.resultCount;
        })["catch"](function () {
        });
    }
    /*======================================
      #Cookie Consent
    ======================================*/
    (function () {
        var cookieConsent = document.querySelector(".cookie-consent");
        if (cookieConsent) {
            var cookieConsentButton = cookieConsent.querySelector(".button");
            if (cookieConsentButton) {
                // Add a cookie for 365days when clicking dismiss button
                cookieConsentButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    cookieConsent.remove();
                    setCookie("cookie-consent", "true", 365);
                });
            }
            // Show cookie modal if there is no cookie
            if (getCookie("cookie-consent") == "") {
                cookieConsent.classList.remove("hide--important");
            }
        }
    })();
    /*======================================
      #Tabs
    ======================================*/
    (function () {
        function setTab(hash, scroll) {
            // Get the current tab nav that matches hash
            var item = document.querySelector(".tabs__nav a[href='" + hash + "']");
            if (item) {
                // Hit the road if current tab is already active
                if (item.classList.contains("acitve")) {
                    return;
                }
                // Get widget scope
                var widget_1 = item.closest(".tabs");
                // Remove active class from all nav items
                var navs = item.closest("ul").querySelectorAll("a");
                navs.forEach(function (nav) {
                    nav.classList.remove("active");
                });
                // Set active class to selected nav item
                item.classList.add("active");
                // Hide all tabs
                var tabs = widget_1.querySelectorAll(".tab");
                tabs.forEach(function (tab) {
                    tab.classList.remove("tab--active");
                });
                // Show selected tab
                var target = item.getAttribute("href");
                var targetTab = widget_1.querySelector(target);
                targetTab.classList.add("tab--active");
                //Scroll to widget
                if (scroll) {
                    var header_1 = document.querySelector(".top");
                    setTimeout(function () {
                        window.scrollTo({ 'behavior': 'smooth', 'left': 0, 'top': (widget_1.offsetTop - header_1.offsetHeight) });
                    }, 100);
                }
            }
        }
        //Change tab on tab-nav click
        var tabNavigationItems = document.querySelectorAll(".tabs__nav a");
        tabNavigationItems.forEach(function (item) {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                history.pushState("", "", item.getAttribute("href"));
                setTab(item.getAttribute("href"), false);
            });
        });
        //Check if hash exist and contains "tab--"
        if (window.location.hash && window.location.hash.indexOf("tab--") !== -1) {
            //Set active tab and enable scroll
            setTab(window.location.hash, true);
        }
        //Check onpopstate contains "tab--"
        window.onpopstate = function (e) {
            if (window.location.hash.indexOf("tab--") !== -1) {
                setTab(window.location.hash, false);
            }
        };
    })();
    /*======================================
      #Scroll Animate Observer
    ======================================*/
    var scrollSections = document.querySelectorAll('section, .grid:not(.grid--nav), .animate-item');
    var scrollObserverSettings = {
        threshold: 0,
        rootMargin: '-5% 0% -25% 0%'
    };
    var scrollObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                setTimeout(function () {
                    entry.target.classList.remove("animate");
                    scrollObserver.unobserve(entry.target);
                }, 1500);
            }
        });
    }, scrollObserverSettings);
    scrollSections.forEach(function (section) {
        scrollObserver.observe(section);
    });
    /*======================================
      #Navigation Toggle
    ======================================*/
    (function () {
        var navigationButtons = document.querySelectorAll(".navigation button");
        if (navigationButtons) {
            navigationButtons.forEach(function (item) {
                item.addEventListener("click", function (e) {
                    e.preventDefault();
                    // Toggle open class to button and li
                    item.classList.toggle("open");
                    item.closest("li").classList.toggle("open");
                    // Toggle aria-expanded on button
                    if (item.classList.contains("open")) {
                        item.setAttribute("aria-expanded", "true");
                    }
                    else {
                        item.setAttribute("aria-expanded", "false");
                    }
                });
            });
        }
        var selectedNavigationItems = document.querySelectorAll(".navigation[data-expand='true'] .selected");
        selectedNavigationItems.forEach(function (item) {
            var parentsLi = getParents(item, "li");
            parentsLi.forEach(function (li) {
                // Expand all parents to selected item
                li.classList.add("open");
                var btn = li.querySelector("button");
                if (btn) {
                    btn.classList.add("open");
                    btn.setAttribute("aria-expanded", "true");
                }
            });
            // Open child to selected item
            item.classList.add("open");
            var btn = item.querySelector("button");
            if (btn) {
                btn.classList.add("open");
                btn.setAttribute("aria-expanded", "true");
            }
        });
    })();
    /*======================================
      # Toggle Password visibility
    ======================================*/
    var togglePasswordButtons = document.querySelectorAll(".password-input__show, .password-input__hide");
    togglePasswordButtons.forEach(function (button) {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            var wrap = button.closest(".password-input");
            var input = wrap.querySelector("input");
            var showButton = wrap.querySelector(".password-input__show");
            var hideButton = wrap.querySelector(".password-input__hide");
            if (input.type === "password") {
                input.type = "text";
                showButton.style.display = "none";
                hideButton.style.display = "block";
            }
            else {
                input.type = "password";
                showButton.style.display = "block";
                hideButton.style.display = "none";
            }
        });
    });
    /*======================================
      #Page loaded
    ======================================*/
    window.addEventListener('load', function () {
        document.body.classList.remove("page-loading");
        document.body.classList.add("page-loaded");
    });
    /*======================================
      #Helpers
    ======================================*/
    //Creates cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    ;
    //Returns cookie
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    ;
    // Returns all matching parents to elm by selector
    function getParents(elem, selector) {
        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                    Element.prototype.mozMatchesSelector ||
                    Element.prototype.msMatchesSelector ||
                    Element.prototype.oMatchesSelector ||
                    Element.prototype.webkitMatchesSelector ||
                    function (s) {
                        var matches = (this.document || this.ownerDocument).querySelectorAll(s), i = matches.length;
                        while (--i >= 0 && matches.item(i) !== this) { }
                        return i > -1;
                    };
        }
        // Set up a parent array
        var parents = [];
        // Push each parent element to the array
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (selector) {
                if (elem.matches(selector)) {
                    parents.push(elem);
                }
                continue;
            }
            parents.push(elem);
        }
        // Return our parent array
        return parents;
    }
    ;
};
IglooApp();
