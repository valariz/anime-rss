// Configuration options
const init_phones = [
        "5128 DF Target",
        "Kiwi Ears x Crinacle Singolo",
      ],                                            // Optional. Which graphs to display on initial load. Note: Share URLs will override this set
      DIR = "data/",                                // Directory where graph files are stored
      default_channels = ["L","R"],                 // Which channels to display. Avoid javascript errors if loading just one channel per phone
      default_normalization = "dB",                 // Sets default graph normalization mode. Accepts "dB" or "Hz"
      default_norm_db = 60,                         // Sets default dB normalization point
      default_norm_hz = 500,                        // Sets default Hz normalization point (500Hz is recommended by IEC)
      max_channel_imbalance = 5,                    // Channel imbalance threshold to show ! in the channel selector
      alt_layout = true,                            // Toggle between classic and alt layouts
      alt_sticky_graph = true,                      // If active graphs overflows the viewport, does the graph scroll with the page or stick to the viewport?
      alt_augment = true,                           // Display Review Links and etc..
      alt_animated = true,                          // Determines if new graphs are drawn with a 1-second animation, or appear instantly
      alt_header = true,                            // Display a configurable header at the top of the alt layout
      alt_tutorial = true,                          // Display a configurable frequency response guide below the graph
      site_url = '/',                               // URL of your graph "homepage"
      share_url = true,                             // If true, enables shareable URLs
      watermark_text = "",                 // Optional. Watermark appears behind graphs
      watermark_image_url = "/assets/images/watermark.png",                     // Optional. If image file is in same directory as config, can be just the filename
      page_title = "Frequency Responses - Squiglink by Earphones Archive",
      page_description = "View and compare frequency response graphs for earphones",
      accessories = true,                           // If true, displays specified HTML at the bottom of the page. Configure further below
      externalLinksBar = false,                      // If true, displays row of pill-shaped links at the bottom of the page. Configure further below
      expandable = false,                           // Enables button to expand iframe over the top of the parent page
      expandableOnly = false,                       // Prevents iframe interactions unless the user has expanded it. Accepts "true" or "false" OR a pixel value; if pixel value, that is used as the maximum width at which expandableOnly is used
      headerHeight = '0px',                         // Optional. If expandable=true, determines how much space to leave for the parent page header
      darkModeButton = true,                        // Adds a "Dark Mode" button the main toolbar to let users set preference
      targetDashed = true,                          // If true, makes target curves dashed lines
      targetColorCustom = false,                    // If false, targets appear as a random gray value. Can replace with a fixed color value to make all targets the specified color, e.g. "black"
      labelsPosition = "bottom-left",               // Up to four labels will be grouped in a specified corner. Accepts "top-left," bottom-left," "bottom-right," and "default"
      stickyLabels = true,                          // "Sticky" labels 
      analyticsEnabled = false,                     // Enables Google Analytics 4 measurement of site usage
      extraEnabled = true,                          // Enable extra features
      extraUploadEnabled = true,                    // Enable upload function
      extraEQEnabled = true,                        // Enable parametic eq function
      extraEQBands = 10,                            // Default EQ bands available
      extraEQBandsMax = 20,                         // Max EQ bands available
      extraToneGeneratorEnabled = true;             // Enable tone generator function

// Specify which targets to display
const targets = [
    { type:"Neutral",               files:["5128 DF","5128 DF (Stock)","JM-1 (5128)", "ISO 11904-1 DF","5128 FF"] },
    { type:"Preference",            files:["Harman Beta (2024)","Harman IE 2019 for 5128","Rtings", "SoundGuys"] },
];

// Haruto's Addons
const  preference_bounds_name = "Preference Bounds RAW",  // Preference bounds name
       preference_bounds_dir = "assets/pref_bounds/",  // Preference bounds directory
       preference_bounds_startup = true,              // If true, preference bounds are displayed on startup
       allowSquigDownload = true,                     // If true, allows download of measurement data
       PHONE_BOOK = "data/phone_book.json",                 // Path to phone book JSON file
       default_y_scale = "50db",                       // Default Y scale; values: ["20db", "30db", "40db", "50db", "crin"]
       default_DF_name = "5128 DF",       // Default RAW DF name
       dfBaseline = true,                              // If true, DF is used as baseline when custom df tilt is on
       default_bass_shelf = 0,                         // Default Custom DF bass shelf value
       default_tilt = -0.8,                            // Default Custom DF tilt value
       default_ear = 0,                                // Default Custom DF ear gain value
       default_treble = 0,                             // Default Custom DF treble gain value
       tiltableTargets = ["5128 DF","5128 DF (Stock)","JM-1 (5128)", "ISO 11904-1 DF","5128 FF"],     // Targets that are allowed to be tilted
       compTargets = [""],         // Targets that are allowed to be used for compensation
       showCustomDFAdjustmentButton = true,            // If true, show custom DF adjustment button for bass shelf, tilt, ear gain, and treble gain
       showCustomDFAdjustmentButtonOnDesktop = true,   // If true, show custom DF adjustment button on desktop page as well
       allowCreatorSupport = false;                    // Allow the creator to have a button top right to support them
       allowLanguageSelector = true;                   // Add Language Selector on the top right of the page
       availableLanguages = ["en", "ko"];              // List of available language codes. When you are adding a new language, make sure to use ISO 639-1 Language Codes for auto-detection.
       defaultLanguage = "en";                         // Determine default (fallback) language. It should be included in the availableLanguages list.
       useBrowserLangAsDefault = true;                 // If true, the browser's language will be used as the default language. If false, the defaultLanguage setting will be used as the default.
       translateHeader = true;                         // If true, translated header link from language files will be used over the one from config.js
       translateTutorial = true;                       // If true, translated tutorial from language files will be used over the one from config.js
       translateAccessories = true;                    // If true, translated accessories from language files will be used over the one from config.js
       translateTargetTypes = true;                    // If true, translated target types from language files will be used over the one from config.js
       translateAlertMessages = true;                  // If true, translated alert messages from language files will be used.
       allowMultipleTargets = true;                    // If true, multiple targets can be selected at once. (You still cannot add multiple tilted targets.)

// *************************************************************
// Functions to support config options set above; probably don't need to change these
// *************************************************************

// But I will anyways haha - Haruto

// Set up the watermark, based on config options above
function watermark(svg) {
    let wm = svg.append("g")
        .attr("transform", "translate("+(pad.l+W/2)+","+(pad.t+H/2-20)+")")
        .attr("opacity",0.2);
    
    if ( watermark_image_url ) {
        wm.append("image")
            .attrs({x:-200, y:-125, width:400, height:400, "xlink:href":watermark_image_url});
    }
    
    if ( watermark_text ) {
        wm.append("text")
            .attrs({x:0, y:70, "font-size":28, "text-anchor":"middle", "class":"graph-name"})
            .text(watermark_text);
    }
    
    let wmSq = svg.append("g")
        .attr("opacity",0.2);

    wmSq.append("text")
        .attrs({x:776, y:315, "font-size":14, "transform":"translate(0,0)", "text-anchor":"end", "class":"wm-squiglink-address"})
        .text("earphonesarchive.squig.link/");

    let wmBK = svg.append("g")
        .attr("opacity",0.3);
    
    wmBK.append("text")
        .attrs({x:776, y:40, "font-size":14, "transform":"translate(0,0)", "text-anchor":"end", "class":"wm-squiglink-address"})
        .text("Measured with B&K 5128 Head And Torso Simulator(HATS)");
}



// Parse fr text data from REW or AudioTool format with whatever separator
function tsvParse(fr) {
    return fr.split(/[\r\n]/)
        .map(l => l.trim()).filter(l => l && l[0] !== '*')
        .map(l => l.split(/[\s,]+/).map(e => parseFloat(e)).slice(0, 2))
        .filter(t => !isNaN(t[0]) && !isNaN(t[1]));
}



// Apply stylesheet based layout options above
function setLayout() {
    function applyStylesheet(styleSheet) {
        var docHead = document.querySelector("head"),
            linkTag = document.createElement("link");
        
        linkTag.setAttribute("rel", "stylesheet");
        linkTag.setAttribute("type", "text/css");
        
        linkTag.setAttribute("href", styleSheet);
        docHead.append(linkTag);
    }

    if ( !alt_layout ) {
        applyStylesheet("assets/css/style.css");
    } else {
        applyStylesheet("assets/css/style-alt.css");
        applyStylesheet("assets/css/style-alt-theme.css");
    }
}
setLayout();



// Set up analytics
function setupGraphAnalytics() {
    if ( analyticsEnabled ) {
        const pageHead = document.querySelector("head"),
              graphAnalytics = document.createElement("script"),
              graphAnalyticsSrc = "graphAnalytics.js";
        
        graphAnalytics.setAttribute("src", graphAnalyticsSrc);
        pageHead.append(graphAnalytics);
    }
}
setupGraphAnalytics();



// o == offset
// l ==
// p == phone
// id == name
// lr == default curve
// v == valid channels
/*
let phoneObj = {
                    isTarget: false,
                    brand: "Average",
                    dispName: "All SPL",
                    phone: "All SPL",
                    fullName: "Average All SPL",
                    fileName: "Average All SPL",
                    rawChannels: "R",
                    isDynamic: false,
                    id: "AVG"
                };
*/



// If alt_header is enabled, these are the items added to the header
let headerLogoText = "", //"Earphones Archive",
    headerLogoImgUrl = "https://squig.link/squiglink-logo-w.png",
    headerLinks = [
        {
          "name": "Headphone Measurements",
          "url": "https://earphonesarchive.squig.link/headphones"
        },
        {
          "name": "Ranking",
          "url": "./ranking"
        },
        {
          "name": "Youtube",
          "url": "https://www.youtube.com/@EarphonesArchive"
        },
        {
          "name": "Detailed Data (THD, Impedance & ANC Test)",
          "url": {
            "desktop": "https://cafe.naver.com/ArticleList.nhn?search.clubid=28584584&search.menuid=165",
            "mobile": "https://m.cafe.naver.com/ca-fe/web/cafes/28584584/menus/165"
          }
        }
    ];
let whichHeaderLogoTextToUse = headerLogoText;
let whichHeaderLogoImgUrlToUse = headerLogoImgUrl;
let whichHeaderLinksToUse = headerLinks;

// Configure HTML accessories to appear at the bottom of the page. Displayed only if accessories (above) is true
// There are a few templates here for ease of use / examples, but these variables accept any HTML
const 
    // Short text, center-aligned, useful for a little side info, credits, links to measurement setup, etc. 
    simpleAbout = `
        <p class="center">This web software is based on the <a href="https://github.com/mlochbaum/CrinGraph">CrinGraph</a> open source software project.</p>
    `,
    paragraphs = `
      <p class="center">
        All measurements are done using <b>B&K 5128 Head And Torso Simulator(HATS)</b>. <br>
        This web software is based on a <a href="https://github.com/HarutoHiroki/PublicGraphTool">HarutoHiroki's modified version of CrinGraph</a>,
        <a href="https://github.com/mlochbaum/CrinGraph">a open source software project by Marshall Lochbaum</a>
      </p>
    `,
    // Customize the count of widget divs, and customize the contents of them. As long as they're wrapped in the widget div, they should auto-wrap and maintain margins between themselves
    widgets = `
        <div class="accessories-widgets">
            <div class="widget">
                <img width="200" src="cringraph-logo.svg"/>
            </div>

            <div class="widget">
                <img width="200" src="cringraph-logo.svg"/>
            </div>

            <div class="widget">
                <img width="200" src="cringraph-logo.svg"/>
            </div>
        </div>
    `;
    // Which of the above variables to actually insert into the page
let whichAccessoriesToUse = paragraphs;

// Source: https://www.teachmeaudio.com/mixing/techniques/audio-spectrum
let tutorialDefinitions = [
    {
        name: 'Sub bass',
        width: '20.1%',
        description: 'The Rumble, usually out of human\'s hearing range and tend to be felt more than heard, providing a sense of power.'
    },
    {
        name: 'Mid bass',
        width: '19.2%',
        description: 'Determins how "fat" or "thin" the sound is, boosting around 250hz tend to add a feeling of warmth. If you\'re a bass head you most likely like this range.'
    },
    {
        name: 'Lower midrange',
        width: '17.4%',
        description: 'Low order harmonics of most instruments, generally viewed as the bass presence range. Boosting a signal around 300 Hz adds clarity to the bass and lower-stringed instruments. Too much boost around 500 Hz can make higher-frequency instruments sound muffled.'
    },
    {
        name: 'Upper midrange',
        width: "26%",
        description: 'The high midrange is responsible for the harmonics of instruments. If boosted, this range can add presence. However, too much boost around the 3 kHz range can cause listening fatigue.'
    },
    {
        name: 'Treble',
        width: '7.3%',
        description: 'The treble range is responsible for the clarity and definition of a sound. Over-boosting can cause an irritating, harsh sound. Cutting in this range makes the sound more distant and transparent.'
    },
    {
        name: 'Air',
        width: '10%',
        description: 'The air range is composed entirely of harmonics and is responsible for sparkle and air of a sound. Over boosting in this region can accentuate hiss and cause ear fatigue.'
    }
]
let whichTutorialDefinitionsToUse = tutorialDefinitions;



// Configure external links to appear at the bottom of the page. Displayed only if externalLinksBar (above) is true
const linkSets = [
    {
        label: "IEM graph databases",
        links: [
            {
                name: "Audio Discourse",
                url: "https://iems.audiodiscourse.com/"
            },
            {
                name: "Bad Guy",
                url: "https://hbb.squig.link/"
            },
            {
                name: "Banbeucmas",
                url: "https://banbeu.com/graph/tool/"
            },
            {
                name: "HypetheSonics",
                url: "https://www.hypethesonics.com/iemdbc/"
            },
            {
                name: "In-Ear Fidelity",
                url: "https://crinacle.com/graphs/iems/graphtool/"
            },
            {
                name: "Precogvision",
                url: "https://precog.squig.link/"
            },
            {
                name: "Super* Review",
                url: "https://squig.link/"
            },
            {
                name: "Timmy (Gizaudio)",
                url: "https://timmyv.squig.link/"
            },
            {
                name: "Rohsa",
                url: "https://rohsa.gitlab.io/graphtool/"
            },
        ]
    },
    {
        label: "Headphones",
        links: [
            {
                name: "Audio Discourse",
                url: "https://headphones.audiodiscourse.com/"
            },
            {
                name: "In-Ear Fidelity",
                url: "https://crinacle.com/graphs/headphones/graphtool/"
            },
            {
                name: "Listener",
                url: "https://listener800.github.io/"
            },
            {
                name: "Super* Review",
                url: "https://squig.link/hp.html"
            }
        ]
    }
];
