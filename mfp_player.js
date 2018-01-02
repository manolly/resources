jQuery(document).on("PLAYER_READY", function() {
    log("plr inst");
    log(plrInst);
});
jQuery(document).on("EXIT_FULLSCREEN", function() {
    plrObj.removeClass("mfp-full");
    plrInst.resize(false)
});
var Plr = Plr || {},
    nextSlide = {};
(function($) {
    Plr = (function(plrObj) {
        var ratio, land = false;
        this.prd = false;
        this.lng = false;
        this.first = true;
        this.cssAdded = false;
        if (plrObj.cf) {
            online = "//datcf.mte-media.com/online5/";
        }
        if (plrObj.cn) {
            online = "//video-hks.fincdn.com/online5/";
        }
        this.destroy = function() {};
        this.resize = function(full) {
            if (!canvas) {
                return;
            }
            land = ($(window).width() > $(window).height()) ? true : false;
            plWid = mobile || full ? $(window).width() : vrz.plWid;
            plHei = mobile || full ? $(window).height() : (plWid * 0.625);
            if (adminMode) {
                plWid = "550";
            }
            ratio = plWid / 800;
            stage.scaleX = stage.scaleY = ratio;
            if (full || mobile) {
                var Xratio = plWid / 800,
                    Yratio = plHei / 500;
                if ($(window).width() < $(window).height()) {
                    ratio = plWid / 800;
                    stage.y = plHei / 2 - (250 * Yratio) / 2;
                    stage.scaleX = stage.scaleY = Xratio;
                } else {
                    stage.scaleX = Xratio;
                    stage.scaleY = Yratio;
                    stage.y = 0;
                }
            } else {
                $(plrObj).height(plHei + 77);
            }
            log("mfp resize. wid " + plWid + " hei " + plHei + " full mode ? " + fulls + " fullll " + full);
            if (full && fulls) {
                plrObj.removeClass("mfp-full");
                this.resize(false);
                return;
            } else if (full && !fulls) {
                plrObj.addClass("mfp-full");
            }
            if (responsive) {
                plHei -= 95;
            }
            $("#canvas_container").height(plHei);
            $("#lesson").css({
                "width": plWid,
                "height": plHei
            });
            canvas.width = video.width = plWid;
            canvas.height = video.height = plHei;
            $("#vid_cnt").height(plHei);
            plrObj.find("#bg").css({
                "position": "absolute",
                "width": plWid,
                "height": plHei
            });
            plrObj.find("#msg").css({
                "height": plHei - 20,
                "width": plWid - 20
            }).hide();
            sld.css("width", "30%");
        }
        $(window).on("orientationchange", function(event) {
            log("orientationchange");
            if (prod_type == "mfp" && ios) {
                if (userRef == "786053e") {}
                setTimeout(function() {
                    plrInst.resize(true);
                }, 200);
            }
        });
        this.first_init = function() {
            if (!this.first) {
                return
            }
            this.first = false;
            if (vrz.menu == "pop" || vrz.menu == "internal") {
                Menu.internal();
            }
            if (ios) {
                plrObj.addClass("mfp-mobile");
            }
            if (vrz.menu == "pop" || vrz.menu == "internal" || mobile && vrz.autohide && vrz.player == "embed") {
                vrz.autohide = null;
            }
            if (vrz.player == "pop") {
                vrz.autohide = null;
                plrObj.find("#full1").hide();
            }
            if (vrz.menu == "pop" || vrz.menu == "internal" && vrz.player == "pop") {
                vrz.menu = "external";
            }
            slide_container = new createjs.Container();
            stage = new createjs.Stage(plrObj.find("canvas").get(0));
            stage.addChild(slide_container);
            sld = plrObj.find("#slider1");
            plrObj.find("#quiz").hide();
            if (responsive) {
                this.resize(true);
            } else {
                this.resize();
            }
            Nav.init();
            this.Scr.init();
            if (vrz.nav) {
                plrObj.find("nav#nav").css("background", vrz.nav)
            }
            if (vrz.btn_clr) {
                plrObj.find("nav#nav .flex-item").css("background", vrz.btn_clr)
            }
            setBtnsClr();
            if (vrz.top_l) {
                plrObj.find("#left_inf_bar").css("background", vrz.top_l);
                plrObj.find("#right_inf_bar").css("background", vrz.top_l);
            }
            if (vrz.top_l_tit) {
                plrObj.find("#left_inf_bar").css("color", vrz.top_l_tit);
                plrObj.find("#right_inf_bar #sldNum").css("color", vrz.top_r_tit);
                plrObj.find("#right_inf_bar #time").css("color", vrz.top_r_tit);
            }
            plrInst.Scr.bg();
            plrObj.find(".brand").html("<img src='" + usersPath + "/logo.png' />").hide();
            if (vrz.btnLogo) {
                plrObj.find(".brand").show();
            }
            if (prdsInf[prd]['jtl']) {
                if (repeatLgl && !ios) {
                    lsn = prdsInf[prd]['jtl'];
                    put_legal();
                    return
                }
                plrInst.loadLesson(prd, lng, prdsInf[prd]['jtl']);
            }
            $.event.trigger({
                type: "PLAYER_READY",
                message: "",
                time: new Date()
            });
        }
        this.init = function(p, l) {
            if (p != undefined) {
                prd = p;
                lng = l;
            } else {
                lng = this.lng;
                prd = this.prd;
            }
            vrz = prdsInf[prd]['settings'];
            if (lng == "hebrew" || lng == "arabic") {
                RTL = true;
                plrObj.find('canvas').attr("dir", "rtl");
                plrObj.find('#msg').attr("dir", "rtl");
            }
            prod_root = prdsInf[prd]['root'];
            audioPath = online + prod_root + "/" + lng + "/lesson" + lesson + "/sound/";
            videoPath = online + prod_root + "/" + lng + "/lesson" + lesson + "/flv/";
            if (prdsInf[prd].demo) {
                demo = true;
                demoSld = prdsInf[prd].demo[prdsInf[prd].demo.length - 1].substr(-1);
            }
            if (!demoSld || prdsInf[prd].demo < 0) {
                demoSld = 3;
            }
            if (vrz.player == "pop") {
                var fancyHei = plHei + 77;
                jQuery.fancybox.open(plrObj, {
                    helpers: {
                        overlay: true
                    },
                    padding: 0,
                    overflow: 'hidden',
                    autoSize: false,
                    autoDimensions: false,
                    width: plWid,
                    height: fancyHei,
                    afterShow: function(current, previous) {
                        plrInst.initLsn();
                    },
                    afterClose: function() {
                        Menu.go();
                        if (page_type == "acc") {
                            $("#mfp_player").hide()
                        }
                    }
                });
            } else {
                plrInst.initLsn();
            }
            Vid.init();
        }
        Menu = {
            internal: function() {
                if (plrObj.find('#menu li').length > 0) {
                    return
                }
                add_css(adminUrl + "style/internal_menu.css");
                var len = prdsInf[prd]['lsnsNum'].length;
                var out = "<div class='menu-close' ></div>";
                out += "<span class='crs_tit' >" + prdsInf[prd]['loc']['crs_name'] + "</span>";
                out += "<ul id='menu_btns' >";
                for (i = 1; i <= parseInt(prdsInf[prd]['lsnsNum']); i++) {
                    var dir = '',
                        lock = '',
                        locClss = '';
                    if (prdsInf[prd]['demo'] && prdsInf[prd]['demo'].indexOf(String(i)) > -1) {
                        lock = "<img src='" + server + "/images/lock.png' />";
                        locClss = " class='lock' ";
                    } else {
                        lock = "", locClss = "";
                    }
                    if (RTL) {
                        dir = " dir='rtl' align='right' ";
                        plrObj.find('#menu').attr("dir", "rtl");
                    }
                    out += "<li id='lsn" + i + "'" + dir + locClss + "><div class='icn1'>" + lock + prdsInf[prd]['loc']['lsn' + i] + "</div></li>";
                }
                out += "</ul>";
                if (vrz.menu == "pop" || vrz.menu == "internal") {
                    plrObj.find('#menu').html(out);;
                    Menu.go();
                }
                plrObj.find("#menu li").click(function() {
                    plrInst.loadLesson(prd, lng, $(this).attr("id").substr(3, $(this).attr("id").length));
                });
                plrObj.find("#menu .menu-close").click(function() {
                    Menu.tgl('close')
                });
            },
            tgl: function(state) {
                if (state == "close") {
                    $("#cbp-spmenu-s4").removeClass('cbp-spmenu-open');
                    $(".topMenu").removeClass('active');
                    $("#home1").removeClass('active');
                    if (ios || mobile) {
                        plrObj.show();
                        $("#" + prdsInf[prd].target_id).hide();
                        $("#home").hide()
                    }
                } else {
                    $("#cbp-spmenu-s4").addClass('cbp-spmenu-open');
                    $(".topMenu").addClass('active');
                    $("#home1").addClass('active');
                    if (ios || mobile) {
                        plrObj.hide();
                        $("#" + prdsInf[prd].target_id).show();
                        $("#home").show()
                    }
                }
            },
            go: function() {
                if (mobile && vrz.menu == "internal") {
                    plrInst.kilLesson();
                    plrInst.Scr.menu();
                }
                if (vrz.menu == "pop" || vrz.menu == "internal") {
                    if (vrz.cover == 'floating') {
                        plrObj.find("#menu").dialog("open");
                    } else {
                        tglClass(".showMenu", 'active');
                        tglClass("#cbp-spmenu-s4", 'cbp-spmenu-open');
                    }
                    return;
                }
                plrInst.kilLesson();
                createjs.Ticker.removeEventListener("tick", loop);
                if (vrz.player == "pop") {
                    jQuery.fancybox.close();
                }
                plrInst.Scr.menu();
                menuMode = true;
            }
        };
        this.Pnl = function() {
            var cjs = createjs;
            (lib.slideback = function() {
                this.initialize();
                this.panel = new lib.slidewindownew();
                this.panel.setTransform(363.3, 245.7, 1.316, 1.339, 0, 0, 0, 268.4, 172.9);
                if (vrz.shadow) {
                    this.panel.shadow = new cjs.Shadow("rgba(0,0,0,1)", 0, 0, 15);
                }
                this.shape = new cjs.Shape();
                this.shape.graphics.f("rgba(255,255,255,0)").s().p("Eg87AnEMAAAhOHMB53AAAMAAABOHg");
                this.shape.setTransform(390, 250);
                this.addChild(this.shape, this.panel);
            }).prototype = p = new createjs.Container();
            p.nominalBounds = new createjs.Rectangle(0, 0, 790, 500);
            (lib.slidewindownew = function() {
                this.initialize();
                var alpha = vrz.panel_opacity ? parseInt(vrz.panel_opacity) / 100 : "1";
                this.shape = new cjs.Shape();
                this.shape.graphics.lf([vrz.pnl_from, vrz.pnl_to], [0, 1], 0, 6, 0, -5.8).s(vrz.pnl_from).ss(0.1, 0, 2).dr(-285.95, -12.05, 571.9, 24.1);
                this.shape.setTransform(285, 12);
                this.shape_1 = new cjs.Shape();
                this.shape_1.graphics.lf([vrz.body_from, vrz.body_to], [0, 1], 0, -139.8, 0, 146.8).s().p("EgsqAZxMAAAgzhMBZVAAAMAAAAzhg");
                this.shape_1.setTransform(285, 188);
                this.shape_1.alpha = alpha;
                this.addChild(this.shape_1, this.shape);
            }).prototype = p = new cjs.Container();
            p.nominalBounds = new cjs.Rectangle(0, 0, 800, 400);
        };
        this.kilLesson = function() {
            removeSlides(true);
            Vid.remove();
            Snd.stop();
        }

        function setupSlides(data) {
            log("setupSlides");
            if (!structXml) {
                alert("Structure is missing. ");
                return;
            }
            var slide = {},
                type, name, i = 0,
                slides = {},
                txt, qnum = 0;
            plrInst.Pnl();
            xmlDoc = $.parseXML(data);
            slidesXml = $(xmlDoc)
            structXml.find("slide").each(function() {
                type = $(this).find("type").text();
                name = $(this).attr('name');
                slideData = slidesXml.find("slide[id=" + name + "]");
                txt = slideData.find('text');
                if (name == 'Tests') {
                    return true;
                }
                switch (type) {
                    case "standard":
                        slide = eval("new lib.slide" + name + "()");
                        if (RTL) try {
                            slide = eval("new lib.slide" + name + "_rtl()");
                        } catch (err) {
                            slide = eval("new lib.slide" + name + "()");
                        }
                        slide.type = type;
                        slide.cues = slideData.find('cues').text().split(",");
                        slide.sndId = slideData.find('sound').text().slice(0, -4);
                        slides[name] = slide;
                        i++;
                        break;
                    case "flv":
                        slide = {};
                        slide.type = type;
                        slides[name] = slide;
                        i++;
                        break;
                    case "trivia":
                        slide = {};
                        slide.type = type;
                        slides[name] = slide;
                        i++;
                        qnum++;
                        break;
                    case "quiz":
                        break;
                    case "index":
                        break;
                    case "swf":
                        break;
                }
                prepareSlide(txt, slide);
            });
            numSlides = i;
            trivSlds = qnum;
            prdsInf[prd]['slides']["lib" + lesson] = slides;
            log("numSlides " + numSlides);
            if (vrz.btnSlider) {
                setupSlider();
                plrObj.find("#slider1").show();
            } else {
                plrObj.find("#slider1").hide();
            }
            startLesson();
        }
        getSlide = function() {
            if (!checkLgl() && !noLgl) {
                put_legal();
                return;
            }
            if (slideIdx == numSlides - 1) {
                slideIdx = -1;
                $.event.trigger({
                    type: "LESSON_ENDED"
                });
                return
            }
            if (direction == "next") {
                slideIdx++;
            } else {
                slideIdx--;
            }
            if (slideIdx >= numSlides) {
                slideIdx = numSlides - 1;
                Menu.go();
                return;
            }
            if (slideIdx < 0) {
                Menu.go();
                return;
            }
            if (demo && slideIdx >= demoSld) {
                showDemoMsg();
                return;
            }
            plrObj.find("#msg").hide();
            var slide = structXml.find("slide").eq(slideIdx);
            var slideName = slide.attr('name');
            sldStarted = false;
            var slides = prdsInf[prd]['slides']["lib" + lesson];
            nextSlide = slides[slideName];
            if (!vrz.pannel) {
                if (nextSlide.back) {
                    nextSlide.back.visible = false;
                }
            }
            if (isMC(nextSlide)) {
                nextSlide.gotoAndStop(0);
                stage.update();
            }
            slideType = nextSlide.type;
            updateSlider();
            log("getslide: slideName " + slideName + " idx " + slideIdx + " type " + slideType);
            if (slideType == 'flv') {
                Vid.play(slide.find('path').text());
                if (spinner) {
                    spinner.spin()
                }
                log("play video " + slide.find('path').text());
                $('#vid_cnt video').bind('contextmenu', function() {
                    return false;
                });
                plrObj.find("#quiz").hide();
                currSlide = nextSlide;
            } else if (slideType == 'standard') {
                plrObj.find("#canvas_container").show();
                plrObj.find("canvas").show();
                plrObj.find("#vid_cnt").hide();
                plrObj.find("#quiz").hide();
                cues = nextSlide.cues;
                sndId = nextSlide.sndId;
                if (direction == "next") {
                    next();
                } else {
                    prev();
                };
                return;
            } else if (slideType == 'trivia') {
                if (sndInst) {
                    sndInst.stop();
                }
                $("#mainProgress").hide();
                plrObj.find("#canvas_container").hide();
                plrObj.find("canvas").hide();
                plrObj.find("#vid_cnt").hide();
                plrObj.find("#quiz").show();
                var data = JSON.parse(nextSlide.data);
                var correct = Number(data[2]['correct']);
                var triv = "<div class='score' > </div><div class='question unanswered' ><div class='txt'>" + data[0]['question'] + "</div>";
                $.each(data[1]['answers'], function(idx, item) {
                    triv += "<p class='ans ' >" + item + "</p>";
                })
                triv += "</div>";
                plrObj.find("#quiz").html(triv);
                plrObj.find("#quiz").css({
                    "height": plHei
                });
                plrObj.find("#quiz .score").html("Your score: " + trivia_points + " % ");
                plrObj.find("#quiz .ans").click(function() {
                    if (plrObj.find("#quiz .question").hasClass("answered")) {
                        return;
                    }
                    plrObj.find("#quiz .question").removeClass("unanswered").addClass("answered");
                    if ($(this).index() == correct) {
                        $(this).addClass("correct");
                        trivia_points += Number((100 / trivSlds).toFixed());
                        if (trivia_points > 95) {
                            trivia_points = 100
                        }
                        plrObj.find("#quiz .score").html("Your got: " + trivia_points + " % ")
                    } else {
                        $(this).addClass("selected");
                        plrObj.find("#quiz .ans").eq(correct - 1).addClass("correct");
                    }
                });
                if (RTL) {
                    plrObj.find("#quiz .ans").css({
                        "direction": "rtl"
                    })
                    plrObj.find("#quiz .question .txt").css({
                        "direction": "rtl"
                    })
                }
            } else {
                getSlide();
                return;
            }
        }
        setupSlider = function() {
            if (!vrz.btnSlider | !sld || mobile) {
                return
            }
            plrObj.find("#slider1").slider({
                value: 1,
                min: 1,
                step: 1,
                max: numSlides,
                slide: function(event, ui) {
                    slideIdx = ui.value - 1;
                    plrObj.find("#slider1 span").text((slideIdx + 1));
                },
                stop: function(event, ui) {
                    Snd.stop();
                    slideIdx--;
                    direction = "next";
                    Vid.complete();
                },
                disabled: false
            }).hide();
        }
        updateSlider = function() {
            if (!vrz.btnSlider || !sld || mobile) {
                return
            }
            sld.slider();
            sld.slider("value", slideIdx + 1);
            var sldNum = slideIdx + 1 < 10 ? '0' + String(slideIdx + 1) : String(slideIdx + 1);
            plrObj.find("#right_inf_bar #sldNum").html((slideIdx + 1) + " / " + numSlides);
            plrObj.find("#clock").button({
                text: false,
                icons: {
                    primary: "ui-icon-clock"
                }
            });
            plrObj.find("#slider1 span").text((sldNum));
            plrObj.find("#slider1 span").css("color", "grey");
        }
        tglPlay = function(state) {
            if (state == "play") {
                plrObj.find("#play1").css({
                    "background-image": "url('" + server + "/images/mte-player/contour/play.png')",
                    "background-position": "center",
                    "background-size": "25px"
                });
                plrObj.find("#play1").addClass("play");
            } else {
                plrObj.find("#play1").css({
                    "background-image": "url('" + server + "/images/mte-player/contour/pause.png')",
                    "background-position": "center",
                    "background-size": "17px"
                });
                plrObj.find("#play1").removeClass("play");
            }
        }
        setBtnsClr = function() {
            var btnsArr = Array("play", "pause", "next", "prev", "share", "menu", "full", "menu");
            $.each(btnsArr, function(key, val) {
                var url = online + "images/" + val + ".png";
                $("#" + val + "1").css({
                    "background-image": "url('" + server + "/images/mte-player/contour/" + val + ".png')",
                    "background-repeat": "no-repeat",
                    "background-position": "center",
                    "background-size": "25px"
                })
            });
            if (vrz.player == "pop") {
                plrObj.find("#home1").css({
                    "background-image": "url('" + server + "/images/mte-player/contour/close.png')",
                    "background-repeat": "no-repeat",
                    "background-position": "center",
                    "background-size": "25px"
                });
                plrObj.find("#home1").show();
            } else if (vrz.player == "embed") {
                plrObj.find("#home1").css({
                    "background-image": "url('" + server + "/images/mte-player/contour/home.png')",
                    "background-repeat": "no-repeat",
                    "background-position": "center",
                    "background-size": "25px"
                });
            }
            if (vrz.autohide) {
                plrObj.find("#home1").css({
                    "background-image": "url('" + server + "/images/mte-player/contour/close.png')",
                    "background-repeat": "no-repeat",
                    "background-position": "center",
                    "background-size": "25px"
                });
                plrObj.find("#home1").show();
                plrObj.find(".topMenu1").hide();
                Menu.tgl("close");
            }
            if (vrz.menu == "pop" || vrz.menu == "internal") {
                if (mobile && vrz.menu == "internal") {
                    plrObj.find("#menu1").show()
                }
            }
        }
        this.initLsn = function() {
            log("init lesson ")
            slides = new Array(), slideIdx = -1, slideName = "", slideType = "", currSlide = null, menuMode = false;
            this.Scr.lsnInit();
            var path;
            if (prdsInf[prd]['slides'].hasOwnProperty("lib" + lesson)) {
                if (getCookie('vidLgl') == "true" || mobile) {
                    startLesson();
                } else {
                    put_legal();
                }
            } else if (prd == "prer" && lesson == "4") {
                path = online + prod_root + "/" + lng + "/lib5.js";
                loadLib(path);
                startLesson();
            } else if ((prd == "pre" && lesson == "5") || (prd == "precz" && lesson == "5")) {
                path = online + prod_root + "/" + lng + "/lib5.js";
                loadLib(path);
                startLesson();
            } else {
                log("loading images: " + prd + " lsn " + lesson);
                var lsnImages = eval(prd + lesson);
                images_root = online + prod_root + "/images/" + lesson + "/";
                if (put_course_page) {
                    $("body").css({
                        "overflow": "hidden"
                    });
                }
                loader = new createjs.LoadQueue(false, images_root);
                loader.addEventListener("fileload", handleFileLoad);
                loader.addEventListener("complete", imagesLoaded);
                loader.addEventListener("fileprogress", handleFileProgress);
                loader.addEventListener("progress", handleOverallProgress);
                loader.addEventListener("error", handleFileError);
                loader.setMaxConnections(5);
                loader.loadManifest(lsnImages, true, images_root);
                currLesson = lesson;
            }
            if (vrz.menu == "pop" && vrz.cover == "hover") {
                Menu.tgl("close");
            } else if (vrz.menu == "pop" && vrz.cover == "floating") {
                if (vrz.cover == "floating") {
                    plrObj.find("#menu").dialog("close");
                }
            }
        }

        function imagesLoaded() {
            log("images loaded complete");
            if (put_course_page) {
                $("body").css({
                    "overflow": "auto"
                });
            }
            var lib = "lib" + lesson + ".js";;
            var libArr = prdsInf[prd]['slides'];
            var path = "";
            if (!libArr.hasOwnProperty("lib" + lesson)) {
                path = online + prod_root + "/" + lib;
                loadLib(path);
            }
        }
        this.toggleBars = function(e) {
            if ($(e.target).parent().hasClass("flex-container")) {
                return;
            }
            log("tglbars ");
            if (nextSlide.type == " trivia") {
                plrObj.find("nav#nav").show();
                return;
            }
            plrObj.find("nav#nav").fadeToggle();
            plrObj.find("#left_inf_bar").fadeToggle();
            plrObj.find("#right_inf_bar").fadeToggle();
        }
        startLesson = function() {
            log("lesson is: ", prdsInf[prd]['slides']["lib" + lesson]);
            $("#players").show();
            if (!prdsInf[prd]['slides'].hasOwnProperty("lib" + lesson)) {
                wait4lib = true;
                log("lib not loaded yet: lib" + lesson + ".js");
                return;
            }
            slideIdx = -1;
            var slidesObj = prdsInf[prd]['slides']["lib" + lesson];
            plrInst.Scr.lsnStart();
            log("start lesson");
            if (ios & !iosSnd) {
                plrObj.find("#msg").hide();
                plrObj.find("canvas").hide();
                plrObj.find("#canvas_container").show();
                plrObj.find("#nav").hide();
                plrObj.find("#strtBtn").remove();
                plrObj.append("<div id='strtBtn' ><img src='" + server + "/images/mte-player/play-big.png' /></div>");
                plrObj.find("#strtBtn").click(playMute);
                return;
            }
            direction = "next";
            getSlide();
            createjs.Ticker.setFPS(24);
            createjs.Ticker.addEventListener("tick", loop);
        }

        function loadLib(path) {
            log("loading lib " + path);
            $.getScript(path, function(data, textStatus, jqxhr) {
                log("lib loaded " + path);
                getSlideData();
                if (wait4lib) {
                    startLesson();
                    wait4lib = false;
                }
                if (getCookie('vidLgl') == "true" || mobile) {
                    startLesson();
                } else {
                    put_legal();
                }
            });
        }
        playMute = function() {
            log("play mute " + iosSnd);
            plrObj.find("#strtBtn").off("tap", playMute);
            if (!iosSnd) {
                iosSnd = true;
                createjs.Sound.registerSound(online + "mute.mp3", "sound");
                sndInst = createjs.Sound.play(online + "mute.mp3");
                plrObj.find("#strtBtn").remove();
                plrObj.find("#nav").show();
                startLesson();
                return;
            }
        }

        function loop() {
            stage.update();
        }

        function updateTime() {
            plrObj.find("#time").html(sndDur + " sec.");
        }

        function checkCues() {
            var arr, cue;
            if (!cues) {
                return
            }
            if (currSlide && sndInst) {
                sec = Math.round(sndInst.getPosition()) / 1000;
                try {
                    arr = cues[cueIdx].split(":");
                } catch (e) {}
                cue = arr ? arr[0] : cues[cueIdx];
                if (sec >= cue) {
                    currSlide.play();
                    cueIdx++;
                }
            }
        }

        function next() {
            var outX = 0,
                outY = -600,
                inX = 13,
                inY = 0;
            nextSlide.x = 13;
            nextSlide.y = 600;
            if (mobile) {
                nextSlide.x = 900;
                nextSlide.y = 0;
                outX = -900;
                outY = 0, inX = 13, inY = 0;
            }
            slide_container.addChild(nextSlide);
            if (currSlide) {
                var tween2 = createjs.Tween.get(currSlide).to({
                    x: outX,
                    y: outY
                }, 700).call(function() {});
            }
            var tween1 = createjs.Tween.get(nextSlide).wait(300).to({
                x: inX,
                y: inY,
                rotation: 0
            }, 700, createjs.Ease.backOut).call(function() {
                startSlide();
            });
        }

        function prev() {
            slide_container.addChild(nextSlide);
            var outX = 0,
                outY = 600,
                inX = 13,
                inY = 0;
            nextSlide.x = 13;
            nextSlide.y = -600;
            if (mobile) {
                nextSlide.x = -900;
                nextSlide.y = 0;
                outX = 900;
                outY = 0, inX = 13, inY = 0;
            }
            var tween2 = createjs.Tween.get(currSlide).to({
                x: outX,
                y: outY,
                rotation: 0
            }, 700).call(function() {
                currSlide = null;
            });
            var tween1 = createjs.Tween.get(nextSlide).wait(300).to({
                x: inX,
                y: inY,
                rotation: 0
            }, 700, createjs.Ease.backOut).call(function() {
                startSlide();
            });
        }

        function getSlideData(slide, type) {
            var dat = {
                action: 'slidesData',
                prd: prd,
                lng: lng,
                ref: userRef,
                lsn: lesson
            };
            if (slide) {
                dat.slide_name = slide
            }
            jQuery.ajax({
                dataType: 'jsonp',
                crossDomain: true,
                data: dat,
                jsonp: 'jsonp_callback',
                url: phpUrl,
                success: function(xml) {
                    setupSlides(xml);;
                    return;
                    log("slide xml ");
                    log(xml);
                }
            });
        }

        function prepareSlide(slideText, slide) {
            var i = 1,
                type = slide.type,
                trivArr = [],
                ans = [];
            slideText.children().each(function() {
                var txt = $(this).find("content").text();
                if (type == "trivia") {
                    switch (i) {
                        case 2:
                            trivArr.push({
                                "question": txt
                            });
                            break;
                        case 3:
                            ans = txt.split("\n");
                            trivArr.push({
                                'answers': ans.slice(0, 4)
                            });
                            break;
                        case 4:
                            trivArr.push({
                                'correct': txt
                            });
                            break;
                    }
                    i++;
                    return true;
                }
                var tt = eval("slide.t" + i);
                var sz = $(this).find("fntSize").text();
                var align = $(this).find("align").text();
                var dir = $(this).find("direction").text();
                var rtlOfst = 0,
                    rect, xx;
                if (tt) {
                    if (i == 1 && vrz.use_tit_clr) {
                        tt.color = vrz.tit_color || "grey";
                    }
                    if (i > 1 && vrz.font_color && vrz.use_fnt_clr) {
                        tt.color = vrz.font_color
                    }
                    tt.text = txt;
                    if (sz != "default") {
                        tt.font = sz + "px Arial";
                    }
                    if (align != "center" && align != "default") {
                        tt.textAlign = align;
                    }
                    if (RTL) {
                        tt.textAlign = align;
                    }
                    if (dir == "rtl") {
                        rtlOfst = 0;
                        if (i > 1) {
                            if (align == "center") {
                                rtlOfst = 0
                            }
                            if (align == "right") {
                                rtlOfst = tt.lineWidth
                            }
                            if (align == "left") {
                                rtlOfst = 0 - tt.lineWidth
                            }
                            tt.x += rtlOfst;
                        }
                    }
                }
                i++;
            });
            slide.data = JSON.stringify(trivArr);
            log(slide.data);
        }

        function isMC(obj) {
            if (!obj) {
                return;
            }
            return obj.toString().indexOf("MovieClip") > -1;
        }

        function startSlide() {
            log("startSlide " + sndId.length);
            Snd.load()
            plrObj.find("#right_inf_bar #sldNum").html((slideIdx + 1) + " / " + numSlides);
            slidesCue = Array();
            currSlide = nextSlide;
            sldStarted = true;
            log("currSlide isMC " + isMC(currSlide));
            if (isMC(currSlide)) {
                currSlide.gotoAndStop(0);
            }
            removeSlides();
        }
        removeSlides = function(empty) {
            if (!slide_container) {
                return;
            }
            var num = slide_container.getNumChildren();
            if (!empty) {
                num--;
            }
            for (var i = 0; i < num; i++) {
                slide_container.removeChildAt(0);
            }
            stage.update();
        }

        function tglClass(elem, cls) {
            $(elem).toggleClass(cls);
        }

        function handleFileLoad(evt) {
            if (evt.item.type == "image") {
                images[evt.item.id] = evt.result;
            }
        }

        function handleFileProgress(event) {
            var div = map[event.item.src];
            div.children("DIV").width(event.progress * div.width());
        }

        function handleSoundProgress(event) {
            show_preloader(event.progress);;
        }

        function handleOverallProgress(event) {
            show_preloader(loader.progress);
        }

        function handleFileError(e) {
            console.log('error loading file ');
            log(e)
        }

        function show_preloader(prog) {
            plrObj.find("#mainProgress").show();
            if (prog >= 1) {
                plrObj.find("#mainProgress").hide();
            }
            plrObj.find("#mainProgress>.progress").width(prog * plrObj.find("#mainProgress").width());
        }
        var sndQueue;
        var Snd = (function() {
            return {
                load: function() {
                    if (sndId.length == 0) {
                        return;
                    }
                    var file = audioPath + sndId + ".mp3";
                    log("snd file: " + file + " id: " + sndId);
                    sndQueue = new createjs.LoadQueue(true);
                    sndQueue.installPlugin(createjs.Sound);
                    sndQueue.on("fileload", Snd.play, this);
                    sndQueue.on("error", handleFileError);
                    sndQueue.on("fileerror", handleFileError);
                    sndQueue.addEventListener("fileprogress", handleSoundProgress);
                    sndQueue.loadFile({
                        id: sndId,
                        src: file
                    });
                    sndOfst = 0;
                },
                play: function(event) {
                    log("snd loaded Menu? " + menuMode + " currSlide.type " + currSlide.type);
                    if (sndInst) {
                        sndInst.stop();
                    }
                    if (menuMode || currSlide.type == "flv") {
                        return
                    }
                    sndInst = createjs.Sound.play(sndId);
                    sndInst.addEventListener("complete", this.complete);
                    sndInst.setVolume(0.8);
                    sndInst.play({
                        offset: sndOfst,
                        pan: 0.0001
                    });
                    sndInst.addEventListener("failed", this.failed);
                    sndInst.addEventListener("interrupted", function() {
                        alert("snd interrupted");
                    });
                    sndDur = Math.ceil(sndInst.getDuration() / 1000);
                    cueIdx = 0;
                    updateTime();
                    tglPlay("pause");
                    log("cues " + cues);
                    if (cues.length > 0) {
                        createjs.Ticker.setFPS(24);
                        createjs.Ticker.addEventListener("tick", checkCues);
                    }
                },
                stop: function(pause) {
                    createjs.Ticker.removeEventListener("tick", checkCues);
                    if (!sndInst || !createjs.Sound) {
                        return;
                    }
                    sndOfst = Math.floor(sndInst.getPosition());
                    if (isMC(currSlide)) {
                        currSlide.stop();
                        log("slide stop");
                    }
                    log("pause2? " + pause + " sec " + sndOfst + " snd inst " + sndInst.getPaused());
                    if (pause) {
                        sndInst.pause();
                    } else {
                        sndInst.stop();
                        if (sndQueue) {
                            sndQueue.cancel();
                        }
                    }
                },
                resume: function() {
                    if (sndInst) {
                        if (ios) {
                            sndInst.play({
                                offset: sndOfst
                            });
                        } else {
                            sndInst.resume();
                        }
                        if (isMC(currSlide)) {;
                        }
                    }
                    if (cues.length > 0) {
                        createjs.Ticker.addEventListener("tick", checkCues);
                    }
                    tglPlay("pause");
                },
                complete: function() {
                    tglPlay("play");
                    direction = 'next';
                    getSlide();
                },
                failed: function(e) {
                    alert("sound failed. " + e + " snd: " + sndId + ".mp3");
                },
                error: function(e) {
                    alert("sound loading error " + e.error + " item " + e.item + " type " + e.type);
                }
            };
        })();
        Nav = {
            setAction: function() {
                log("set action here.");
                plrObj.find("#full1").on("click", this.navigate);
                plrObj.find("#share1").on("click", this.navigate);
                plrObj.find("#home1").on("click", this.navigate);
                plrObj.find("#menu1").on("click", this.navigate).hide();
                plrObj.find("#prev1").on("click", this.navigate);
                plrObj.find("#next1").on("click", this.navigate);
                plrObj.find("#play1").on("click", this.navigate);
                plrObj.find("#play1").css("background-image", "url(online + 'images/play.png')");
                if (ios && nextSlide.type != "trivia") {
                    plrObj.find("#lesson").on("tap", plrInst.toggleBars);
                } else if (mobile) {
                    plrObj.find("#lesson").on("click", plrInst.toggleBars);
                }
                if (ios) {
                    hm.on("swipeleft", function() {
                        Nav.next();
                    });
                    hm.on("swiperight", function() {
                        Nav.prev();
                    });
                    $("video").bind('webkitendfullscreen', function() {
                        log("done was pressed");
                        Nav.next()
                    });
                    plrObj.find("#full1").hide();
                }
            },
            init: function() {
                if (vrz.btnShare) {
                    plrObj.find("#share1").show();
                } else {
                    plrObj.find("#share1").hide();
                }
                if (!vrz.btnHome) {
                    plrObj.find("#home1").hide();
                } else {
                    plrObj.find("#home1").show()
                }
                if (!vrz.btnFull) {
                    plrObj.find("#full1").hide();
                } else {
                    plrObj.find("#full1").css({
                        "display": "inline-block"
                    }).show()
                }
                if (vrz.btnsSlider) {
                    plrObj.find("#slider1").show();
                } else {
                    plrObj.find("#slider1").hide();
                }
                if (vrz.menu == "pop") {
                    if (vrz.cover == "floating") {
                        plrObj.find("#menu").dialog({
                            autoOpen: true,
                            show: {
                                effect: "fade",
                                duration: 500
                            },
                            hide: {
                                effect: "fade",
                                duration: 500
                            }
                        });
                    } else if (vrz.cover == "hover") {}
                }
                this.setAction();
            },
            next: function() {
                if (slideIdx < numSlides) {
                    tglPlay("play");
                    direction = "next";
                    Vid.complete();
                    Snd.stop();
                } else if (slideIdx == numSlides) {}
            },
            prev: function() {
                if (slideIdx > 0) {
                    tglPlay("play");
                    direction = "prev";
                    Vid.complete();
                    Snd.stop();
                }
            },
            navigate: function(e) {
                var nav = e.target.id;
                if (nav == "home1") {
                    Menu.go();;
                    return;
                }
                if (nav == "full1") {
                    plrInst.Scr.full();
                    return;
                }
                if (menuMode) {
                    return;
                }
                switch (nav) {
                    case "share1":
                        var site = userObj.links.site_url;
                        if (site == undefined) {
                            site = "www.learn-fx.com"
                        }
                        window.open('https://www.facebook.com/sharer/sharer.php?u=' + site, "_blank", "toolbar=no, scrollbars=no, resizable=yes, top=500, left=500, width=600, height=400")
                        break;
                    case "beginning1":
                        direction = "next";
                        Snd.stop();
                        Vid.remove();
                        slideIdx = -1;
                        getSlide();
                        break;
                    case "next1":
                        Nav.next();
                        break;
                    case "prev1":
                        Nav.prev();
                        break;
                    case "home1":
                        break;
                    case "full1":
                        break;
                    case "play1":
                        if (currSlide && $(this).hasClass("play")) {
                            if (currSlide.type == "flv") {
                                $(video).get(0).play();
                            } else {
                                Snd.resume();
                            }
                            tglPlay("pause");
                        } else {
                            if (currSlide.type == "flv") {
                                $(video).get(0).pause();
                            } else {
                                Snd.stop(true);
                            }
                            tglPlay("play");
                        }
                        break;
                }
            }
        };
        var video = document.createElement("video");
        Vid = {
            init: function() {
                video.autoplay = true;
                video.controls = false;
                $(video).attr("webkit-playsinline", true);
                video.volume = 0.5;
                plrObj.find("#vid_cnt").append(video);
                $(video).get(0).addEventListener('ended', this.complete);
                $(video).get(0).addEventListener('loadedmetadata', function() {
                    sndDur = Math.ceil($(video).get(0).duration);
                    updateTime();
                });
            },
            play: function(path) {
                if (menuMode) {
                    log("menu mode");
                    return;
                };
                if ($("#strtBtn").length > 0) {
                    plrObj.find("#strtBtn").remove();
                }
                $(video).show();
                var src = videoPath + path;
                $(video).get(0).pause();
                $(video).get(0).src = src;
                $(video).get(0).play();
                plrInst.Scr.video();
                log("video: " + src + ' currentTime ' + $(video).get(0).currentTime);
                $("#vid_cnt").height(plHei);
                tglPlay("pause");
            },
            complete: function() {
                $(video).get(0).pause();
                if (ios) {
                    if (adr) {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        }
                    } else {
                        $(video)[0].webkitExitFullScreen();
                    };
                }
                getSlide();
            },
            remove: function() {
                if (video) {
                    var vv = $(video).get(0);
                    $(video).get(0).pause();
                    $(video).get(0).src = null;
                    $(vv).remove();
                    $(video).hide();
                    tglPlay("play");
                }
            },
            set: function() {;
            }
        };
        this.getStructure = function(prd, lng, lsn) {
            jQuery.ajax({
                dataType: 'jsonp',
                crossDomain: true,
                data: {
                    action: 'structure',
                    prd: prd,
                    lng: lng,
                    ref: userRef,
                    lsn: lsn
                },
                jsonp: 'jsonp_callback',
                url: phpUrl,
                success: function(xml) {
                    if (xml.indexOf('error') > -1) {
                        alert("Sorry:\n" + "user: " + xml.substr(6));
                        return;
                    }
                    xmlDoc = $.parseXML(xml);
                    structXml = $(xmlDoc);
                    plrInst.init();
                }
            });
        }
    })
    Plr.prototype.Scr = {
        dir: RTL ? " dir='rtl' align='right' " : "",
        init: function() {
            removeSlides();
            if (vrz.player == "pop") {
                plrObj.hide();
            } else {
                plrObj.show();
                plrObj.find("#lesson").show()
            }
            var topBar = "<div id='left_inf_bar'><div class='topMenu1'></div><span class='lsn_num1'></span>";
            topBar += "&nbsp;&nbsp;&nbsp;<span class='lsn_tit'" + this.dir + "></span></div>";
            topBar += " <div id='right_inf_bar'><span id='sldNum' ></span><span id='time'></span></div>";
            plrObj.find("#plr_top_bar").html(topBar);
            plrObj.find("#canvas_container").hide();
            plrObj.find("#reg_msg").hide();
            plrObj.find("#msg").hide();
            plrObj.find(".flex-container").hide();
            plrObj.find("#quiz").hide();
            if (vrz.autohide) {
                plrObj.hide();
            }
            this.menu();
            plrObj.find(".ldr").hide();
        },
        menu: function() {
            if (vrz.autohide && vrz.player == "embed") {
                this.autoHide();
            }
            if (!this.cssAdded) {
                if (vrz.plr_skin) {
                    add_css(adminUrl + "style/mte-player_" + vrz.plr_skin + ".css");
                } else {
                    add_css(adminUrl + "style/mte-player_colors.css");
                }
                this.cssAdded = true;
            }
            if (vrz.player == "embed") {
                if (vrz.use_mfp_css) {
                    add_css(vrz.mfp_css);
                } else {
                    if (mobile & !adminMode) {
                        add_css(adminUrl + "style/mobile.css");
                    }
                }
                this.canvas();
            }
            if (fulls) {
                this.full(false);
            }
            if (mobile) {
                plrObj.hide();
                $("#" + prdsInf[prd].target_id).show();
                $("#home").show()
            }
        },
        autoHide: function() {
            plrObj.hide("slow");
        },
        video: function() {
            plrObj.find("#canvas_container").hide();
            plrObj.find("#vid_cnt").show();
            plrObj.find("#msg").hide();
            plrObj.find(".ldr").hide();
        },
        canvas: function() {
            plrObj.find("#canvas_container").show();
            plrObj.find("#vid_cnt").hide();
            plrObj.find("#msg").hide();
            plrObj.find(".ldr").hide();
            plrObj.find("#quiz").hide();
        },
        lsnInit: function() {
            Menu.tgl("close");
            plrObj.find(".lsn_num1").html(lesson);
            plrObj.find(".lsn_tit").html(prdsInf[prd]['loc']["lsn" + lesson]);
            plrObj.find("#mainProgress > .progress").html("");
            plrObj.find("#mainProgress").show();
            if (vrz.player == "pop") {
                plrObj.show();
            } else {
                plrObj.find("#lesson").show();
                plrObj.show("slow");
            }
            spinner.stop();
            plrObj.find("#vid_cnt").hide();
            plrObj.find("#time").html("");
            if (prdsInf[prd]["settings"]["player"] != "popup" && !mte_idx) {
                $('html, body').animate({
                    scrollTop: plrObj.find("#lesson").offset().top
                }, 1000);
            }
        },
        lsnStart: function() {
            plrObj.find("#mainProgress").hide();
            plrObj.find(".flex-container").show();
            spinner.stop();
        },
        msg: function() {
            if (!vrz.player == "pop") {
                plrObj.show('slow');
                plrObj.find("#lesson").show('slow');
            }
            plrObj.find("#canvas_container").hide();
            plrObj.find("#vid_cnt").hide();
            plrObj.find("#msg").show();
        },
        loader: function() {
            plrObj.find("canvas").hide();
            plrObj.find("#canvas_container").show();
            var tgt = document.getElementById('lesson');
            var opt = {
                top: "20%"
            }
            spinner = new Spinner(opt).spin(tgt);
        },
        closeLegal: function() {
            setCookie('vidLgl', "true", null);
            if (slideIdx == -1) {
                this.lsnInit();
                startLesson();
            } else {
                getSlide();
                plrObj.find("#canvas_container").show();
            }
            plrObj.find("#msg").hide();
        },
        full: function(full) {
            plrInst.resize(true);
            this.bg();
            toggleFullscreen(document.querySelector('#mfp_player'));
        },
        bg: function() {
            var size = plrObj.width * 50 / 100 + "px";
            var alpha = vrz.logo_opacity ? parseInt(vrz.logo_opacity) / 100 : "0.2";
            alpha = "0.2";
            var cssObj = {
                'background-color': vrz.bg_from
            };
            var logoCss = {
                'background-position': 'center',
                'background-repeat': 'no-repeat',
                'background-image': 'url(' + usersPath + "/logo.png)",
                'background-size': size,
                "opacity": alpha
            }
            if (vrz.player == "embed") {
                plrObj.find("#canvas_bg").css(cssObj);
                plrObj.find("#back_logo").css(logoCss);
            } else {
                plrObj.find("#bg").css(cssObj);
            }
        }
    };
    Plr.prototype.loadLesson = function(prd, lng, lsn) {
        log("load lesson " + lsn)
        if (!lsn) {
            lsn = prdsInf[prd]['jtl'];
        }
        currLesson = lesson = parseInt(lsn);
        if (lng.length == 2) {
            lng = langCode(lng)
        }
        plrInst.prd = prd;
        plrInst.lng = lng;
        if (prdsInf[prd]['demo']) {
            var demoArr = prdsInf[prd]['demo'];
            if (demoArr < 0 && lsn > Math.abs(demoArr)) {
                showDemoMsg();
                return;;
                return
            } else if (demoArr.indexOf(String(lsn)) > -1) {
                showDemoMsg();
                return;
            }
        }
        this.Scr.loader();
        this.kilLesson();
        if (currLesson > 0) {
            if (prdsInf[prd].pl.indexOf("error") > -1) {
                alert(prdsInf[prd].pl);
                return
            }
            structXml = $(prdsInf[prd]['pl']).find("lesson[num=" + lsn + "]");
            plrInst.init();
        }
        if (mobile & !ios & !widget) {
            this.Scr.full()
        }
        if (ios) {
            setTimeout(function() {
                window.scrollTo(0, 1);
            }, 1000);
        }
    }
    Plr.doAction = function(action, value, url) {
        var t, name;
        if (!sldStarted) {
            t = eval("nextSlide." + value);
            name = nextSlide.name;
        } else {
            t = eval("currSlide." + value);
            name = currSlide.name;
        }
        log("doAction : " + action + " " + value + " t " + t + " slide Started? " + sldStarted);
        if (t == undefined) {
            return;
        }
        switch (action) {
            case "show":
                t.visible = true;
                t.alpha = 1;
                break;
            case "hide":
                t.visible = false;
                break;
            case "link":
                t.color = "#0000FF";
                t.addEventListener("click", function() {
                    location.href = "http://www.mte-media.com/it-harmonic.zip"
                }, false);
                break;
        }
    }
})(jQuery);