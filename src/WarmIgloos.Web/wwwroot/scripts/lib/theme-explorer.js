/*======================================
  # Show / hide panel
======================================*/
var toggle = document.querySelector(".theme-explorer__toggle");
if (toggle) {
    toggle.addEventListener("click", function (e) {
        document.body.classList.toggle("theme-explorer-visible");
    });
}
var closeButton = document.querySelector(".theme-explorer__save .button--close");
if (closeButton) {
    closeButton.addEventListener("click", function (e) {
        document.body.classList.remove("theme-explorer-visible");
    });
}
/*======================================
  # Color pickers
======================================*/
jscolor.presets.default = {previewSize:38, width: 250, height: 150, position: 'left', borderColor: '#FFF', backgroundColor: '#FFF', controlBorderColor: '#FFF'};
var colorEditors = document.querySelectorAll(".theme-explorer__input--color");
colorEditors.forEach(function (item) {
    var prop = item.dataset.prop;
    var propValue = getComputedStyle(document.documentElement).getPropertyValue(prop);
    //Populate inputs with current value
    item.value = propValue;
    item.addEventListener("change", function (e) {
        document.documentElement.style.setProperty(prop, item.value);
        if (prop == "--theme") {
            var darker = adjustColor(item.value, -0.1);
            var rgb = hexToRgb(item.value);
            document.documentElement.style.setProperty("--theme-darker", darker);
            document.documentElement.style.setProperty("--theme-rgb", rgb.r + "," + rgb.g + "," + rgb.b);
        }
        if (prop == "--theme-alt") {
            var darker = adjustColor(item.value, -0.1);
            document.documentElement.style.setProperty("--theme-alt-darker", darker);
        }
        if (prop == "--background-dark") {
            var lighter = adjustColor(item.value, 0.1);
            document.documentElement.style.setProperty("--background-dark-lighter", lighter);
        }
    });
});
/*======================================
  # Number inputs
======================================*/
var textEditors = document.querySelectorAll(".theme-explorer__input--text");
textEditors.forEach(function (item) {
    var prop = item.dataset.prop;
    var propValue = getComputedStyle(document.documentElement).getPropertyValue(prop);
    //Populate inputs with current value if not set
    
    if (item.value == "") {
        if(item.type == "number"){
            item.value = parseFloat(propValue.replace("px", "").replace("rem", ""));
        } 
        else{
            item.value = propValue;
        }
        
    }
    item.addEventListener("input", function (e) {
        if (item.dataset.size != undefined) {
            var style = document.createElement("style");
            if(item.dataset.unit != undefined){
                
                style.innerHTML = "@media only screen and (max-width: " + item.dataset.size + "px) { :root {" + prop + ": " + item.value + item.dataset.unit + "!important;}}";
            }
            else{
                style.innerHTML = "@media only screen and (max-width: " + item.dataset.size + "px) { :root {" + prop + ": " + item.value + "px!important;}}";
            }
            document.head.appendChild(style);
            return;
        }
        if(item.dataset.unit != undefined){
            document.documentElement.style.setProperty(prop, item.value + "" + item.dataset.unit);
        }
        else{
            document.documentElement.style.setProperty(prop, item.value + "px");
        }
        
    });
});
/*======================================
  # Design mode
======================================*/
var toggleCb = document.querySelector(".toggle-design-mode");
if (toggleCb) {
    toggleCb.addEventListener("change", function (e) {
        if (toggleCb.checked) {
            document.designMode = 'on';
        }
        else {
            document.designMode = 'off';
        }
    });
}
/*======================================
  # Dropdown classes
======================================*/
var dropdowns = document.querySelectorAll(".theme-explorer__select");
dropdowns.forEach(function (item) {
    var scope = document.querySelector(item.dataset.scope);
    var options = item.options;
    var currentClass = "";
    // Populate select with current value
    for (var i = 0; i < item.length; i++) {
        if (scope && scope.classList.contains(item.options[i].value)) {
            item.options[i].selected = true;
            currentClass = item.options[i].value;
        }
    }
    item.addEventListener("change", function (e) {
        if (scope) {
            scope.classList.remove(currentClass);
            currentClass = item.value;
            scope.classList.add(item.value);
            var cIndex = e.target.selectedIndex;
            if (item.options[cIndex].dataset.extra != undefined) {
                scope.classList.add(item.options[cIndex].dataset.extra);
            }
            if (item.options[cIndex].dataset.remove != undefined) {
                scope.classList.remove(item.options[cIndex].dataset.remove);
            }
        }
    });
});
/*======================================
  # Section tabs
======================================*/
var tabs = document.querySelectorAll(".theme-explorer__nav button");
var sections = document.querySelectorAll(".theme-explorer__section");
tabs.forEach(function (item) {
    item.addEventListener("click", function (e) {
        var target = item.dataset.section;
        tabs.forEach(function (tab) {
            tab.classList.remove("active");
        });
        sections.forEach(function (section) {
            section.classList.remove("active");
        });
        item.classList.add("active");
        var current = document.getElementById(target);
        current.classList.add("active");
    });
});
/*======================================
  # Google Fonts
======================================*/
var frontDropdowns = document.querySelectorAll(".theme-explorer__font");
var fontLink = document.querySelector(".theme-explore-font");
var fonts = [];
// Get the fonts populate the dropdowns
fetch('/ig-assets/googlefonts.json')
  .then(function (response) {
    return response.json();
  }).then(data => {
    // handle success
    var rawFonts = data.items;
    rawFonts = rawFonts.sort((a, b) => a.family.localeCompare(b.family));
    rawFonts.forEach(function (fontres) {
        var apiUrl = [];
        apiUrl.push('https://fonts.googleapis.com/css?family=');
        apiUrl.push(fontres.family.replace(/ /g, '+'));
        if (fontres.variants.length > 2) {
            apiUrl.push(':');
            fontres.variants.forEach(function (weight, key, arr) {
                if (weight == "regular") {
                    return;
                }
                if (Object.is(arr.length - 1, key)) {
                    apiUrl.push(weight);
                }
                else {
                    apiUrl.push(weight + ',');
                }
            });
        }
        var url = apiUrl.join('');
        frontDropdowns.forEach(function (item) {
            var option = document.createElement("option");
            option.text = fontres.family;
            option.value = url;
            option.dataset.store = url.replace("https://fonts.googleapis.com/css?family=", "");
            item.appendChild(option);
        });
    });
}).
    then(function () {
    //Set selected in dropdown from current font
    frontDropdowns.forEach(function (item) {
        var current = getComputedStyle(document.documentElement).getPropertyValue(item.dataset.prop).toString();
        var hidden = item.parentNode.querySelector(".font-hidden");
        for (var i = 0; i < item.options.length; i++) {
            var text = item.options[i].text.toString();
            if (text.trim() === current.trim()) {
                item.options[i].selected = true;
                hidden.value = item.options[i].dataset.store;
            }
        }
    });
})
    .catch(function (error) {
    // handle error
    console.log(error);
});
frontDropdowns.forEach(function (item) {
    //On change
    item.addEventListener("change", function (e) {
        var prop = item.dataset.prop;
        var cIndex = e.target.selectedIndex;
        document.documentElement.style.setProperty(prop, item.options[cIndex].text);
        var link = document.createElement("link");
        link.href = item.value;
        link.rel = "stylesheet";
        document.head.appendChild(link);
        item.parentNode.querySelector(".font-hidden").value = link.href.replace("https://fonts.googleapis.com/css?family=", "");
    });
});
/*======================================
  # Adjust color
======================================*/
function adjustColor(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getWidthValue(cssClass) {
  if (cssClass.indexOf("full-width") > -1) {
    return "full width";
  } else if (cssClass.indexOf("fluid") > -1) {
    return "full width";
  } else if (cssClass.indexOf("big") > -1) {
    return "big";
  } else if (cssClass.indexOf("standard") > -1) {
    return "standard";
  } else if (cssClass.indexOf("small") > -1) {
    return "small";
  } 

  return "standard";
}

function getColorAlias(cssClass) {
  if (cssClass.indexOf("dark") > -1) {
    return "dark";
  } else if (cssClass.indexOf("light") > -1) {
    return "white";
  } 
  return "white";
}

const themeButton = document.querySelector('.theme-explorer__save .button--save');

if(themeButton){
    themeButton.addEventListener('click', () => {
    
      // Get the current page ID
      // We have stored this on a HTML data attribute set on the THEME DESIGNER HTML
      const themeExplorerDom = document.querySelector(".theme-explorer[data-current-node]");
      const currentNodeId = themeExplorerDom.dataset.currentNode;
      const themeNodeId = themeExplorerDom.dataset.themeNode;
    
      let data = {};
      data.currentPageId = Number(currentNodeId);
      data.theme = {};
    
      // Colors
      data.theme.themeColor = getComputedStyle(document.documentElement).getPropertyValue("--theme");
      data.theme.themeContrast = getComputedStyle(document.documentElement).getPropertyValue("--theme-contrast");
      data.theme.themeAltColor = getComputedStyle(document.documentElement).getPropertyValue("--theme-alt");
      data.theme.themeAltColorContrast = getComputedStyle(document.documentElement).getPropertyValue("--theme-alt-contrast");
      data.theme.headingColorDark = getComputedStyle(document.documentElement).getPropertyValue("--heading-dark");
      data.theme.textColorDark = getComputedStyle(document.documentElement).getPropertyValue("--text-dark");
      data.theme.darkBackground = getComputedStyle(document.documentElement).getPropertyValue("--background-dark");
      data.theme.textColorLight = getComputedStyle(document.documentElement).getPropertyValue("--text-light");
      data.theme.headingColorLight = getComputedStyle(document.documentElement).getPropertyValue("--heading-light");
      data.theme.grayBackground = getComputedStyle(document.documentElement).getPropertyValue("--background-light");
      data.theme.selectedNavigationItem = getComputedStyle(document.documentElement).getPropertyValue("--selected-nav-item");
      data.theme.success = getComputedStyle(document.documentElement).getPropertyValue("--success");
      data.theme.error = getComputedStyle(document.documentElement).getPropertyValue("--error");
      data.theme.borderDark = getComputedStyle(document.documentElement).getPropertyValue("--border-dark");
      data.theme.borderLight = getComputedStyle(document.documentElement).getPropertyValue("--border-light");
    
      // Grid
      data.theme.containerWidthSmall = getComputedStyle(document.documentElement).getPropertyValue("--grid-width-small");
      data.theme.containerWidth = getComputedStyle(document.documentElement).getPropertyValue("--grid-width");
      data.theme.containerWidthBig = getComputedStyle(document.documentElement).getPropertyValue("--grid-width-big");
      data.theme.gridGutter = getComputedStyle(document.documentElement).getPropertyValue("--grid-gutter");
      data.theme.gridGutterMedium = document.querySelector("input[data-alias='gridGutterMedium']").value + "px";
      data.theme.gridGutterSmall = document.querySelector("input[data-alias='gridGutterSmall']").value + "px";
      data.theme.gridGutterXS = document.querySelector("input[data-alias='gridGutterXS']").value + "px";
    
      // Header
      data.theme.headerBackgroundColor = getColorAlias(document.getElementById("--header-theme").value);
      data.theme.headerHeight = document.querySelector("input[data-alias='headerHeight']").value + "px";
      data.theme.headerContainerWidth = getWidthValue(document.getElementById("--header-container").value);
      data.theme.headerLayout = document.getElementById("--header-nav").value.substring(5);
      data.theme.headerHeightMobile = document.querySelector("input[data-alias='headerHeightMobile']").value + "px";
      data.theme.logoPadding = getComputedStyle(document.documentElement).getPropertyValue("--logo-padding") + "px";
      data.theme.logoPaddingMobile = document.querySelector("input[data-alias='logoPaddingMobile']").value + "px";
      data.theme.navigationPadding = getComputedStyle(document.documentElement).getPropertyValue("--navigation-padding");
      data.theme.navigationPaddingSmallerScreens = document.querySelector("input[data-alias='navigationPaddingSmallerScreens']").value + "px";
      data.theme.navigationFontSize = document.querySelector("input[data-alias='navigationFontSize']").value + "rem";
      data.theme.navigationFontSizeMobile = document.querySelector("input[data-alias='navigationFontSizeMobile']").value + "rem";
      data.theme.navigationFontWeight = document.querySelector("input[data-alias='navigationFontWeight']").value;
      
    
      // Footer
      data.theme.footerContainerWidth = getWidthValue(document.getElementById("--footer-container").value);
      data.theme.footerBackgroundColor = getColorAlias(document.getElementById("--footer-theme").value);
      
      //Text
      data.theme.textFontSize = document.querySelector("input[data-alias='textFontSize']").value + "rem";
      data.theme.textBigFontSize = document.querySelector("input[data-alias='textBigFontSize']").value + "rem";
      data.theme.textSmallFontSize = document.querySelector("input[data-alias='textSmallFontSize']").value + "rem";
      data.theme.textLineHeight = document.querySelector("input[data-alias='textLineHeight']").value;
      data.theme.textFontWeight = document.querySelector("input[data-alias='textFontWeight']").value;
      data.theme.textBigFontWeight = document.querySelector("input[data-alias='textBigFontWeight']").value;
      data.theme.headingLineHeight = document.querySelector("input[data-alias='headingLineHeight']").value;
      data.theme.headingFontWeight = document.querySelector("input[data-alias='headingFontWeight']").value;
      data.theme.heading1FontSize = document.querySelector("input[data-alias='heading1FontSize']").value + "rem";
      data.theme.heading2FontSize = document.querySelector("input[data-alias='heading2FontSize']").value + "rem";
      data.theme.heading3FontSize = document.querySelector("input[data-alias='heading3FontSize']").value + "rem";
      data.theme.heading4FontSize = document.querySelector("input[data-alias='heading4FontSize']").value + "rem";
      data.theme.heading5FontSize = document.querySelector("input[data-alias='heading5FontSize']").value + "rem";
      data.theme.heading6FontSize = document.querySelector("input[data-alias='heading6FontSize']").value + "rem";
      data.theme.heroHeadingFontSize = document.querySelector("input[data-alias='heroHeadingFontSize']").value + "rem";
      data.theme.heroHeadingMobileFontSize = document.querySelector("input[data-alias='heroHeadingMobileFontSize']").value + "rem";
    
      // Fonts
      const bodyFont = document.querySelector("input[name='body-font']").value;
      const headerFont = document.querySelector("input[name='heading-font']").value;
      
      if(bodyFont != "" && headerFont != ""){
        data.theme.bodyFont = getComputedStyle(document.documentElement).getPropertyValue("--body-font").replace(/\"/g, "").trim();
        data.theme.headingFont = getComputedStyle(document.documentElement).getPropertyValue("--heading-font").replace(/\"/g, "").trim();
        data.theme.embedFont = `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${bodyFont}|${headerFont}">`;
      }
      
      // Diverse
      data.theme.buttonBorderRadius = getComputedStyle(document.documentElement).getPropertyValue("--button-border-radius");
    
      // disable save button
      themeButton.disabled = true;
      themeButton.innerText = "Saving...";
    
      fetch('/umbraco/backoffice/Igloo/IglooThemeExplorer/Save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          console.log('OK:', response);
          themeButton.innerText = "Theme Updated!";
    
          setTimeout(function () {
            themeButton.disabled = false;
            themeButton.innerText = "Save";
          }, 2000);
    
        })
        .catch(error => {
          const response = error.response;
          if (response.status === 401) {
            // Notify user they are logged out & try to redirect back them to theme node
            alert('You are not signed into Umbaco backoffice');
            location.assign(`/umbraco/#/content/content/edit/${themeNodeId}`);
          }
        });
    });
}
