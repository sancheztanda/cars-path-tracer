function trackRoundStart(t, e) {
    t && t.trackEvent({
        engagementType: e + "_game_round",
        engagementMeta: "roundStart"
    })
}

function trackRoundEnd(t, e) {
    t && t.trackEvent({
        engagementType: e + "_game_round",
        engagementMeta: "roundEnd"
    })
}

function shuffle(t) {
    var e, i, s;
    for (s = t.length; s; s -= 1) e = Math.floor(Math.random() * s), i = t[s - 1], t[s - 1] = t[e], t[e] = i;
    return t
}

function compareArrays(t, e) {
    if (t.length !== e.length) return !1;
    for (var i = 0, s = t.length; i < s; i++)
        if (t[i].xPos !== e[i].xPos || t[i].yPos !== e[i].yPos) return !1;
    return !0
}

function getYScaleFromAngle(t) {
    return Math.abs(t) > Math.PI / 2 ? -1 : 1
}

function setTextGradient(t, e, i) {
    var s = t.context.createLinearGradient(0, 0, 0, t.height);
    return s.addColorStop(0, i), s.addColorStop(1, e), t.fill = s
}
var Phaser = window.Phaser,
    MemoryGame = {},
    CTHelpers, CTAnimations;
MemoryGame.Boot = function(t) {}, MemoryGame.Boot.prototype = {
    init: function() {
        this.input.maxPointers = 1;
        var t = "SHOW_ALL";
        this.scale.scaleMode = Phaser.ScaleManager[t], this.game.scale.fullScreenScaleMode = Phaser.ScaleManager[t], this.game.state.add("Preloader", MemoryGame.Preloader), this.game.state.add("MainMenu", MemoryGame.MainMenu), this.game.state.add("Game", MemoryGame.Game), this.game.state.add("Interstitial", MemoryGame.Interstitial)
    },
    preload: function() {
        this.game.ui_theme = "light";
        var t = "dark" === this.game.ui_theme,
            e = {
                light: {
                    active: "#fff",
                    disabled: "#888"
                },
                dark: {
                    active: "#666",
                    disabled: "#ddd"
                }
            },
            i = {
                textColor: {
                    disabled: "#b4d9e0"
                },
                bgColor: "#000",
                opacity: {
                    main: 1,
                    min: .78
                }
            };
        this.load.image("defaultBackground", "images/backgrounds/instructions_bg.jpg"), this.load.image("preloaderBar", "images/utility/loading_bar.png");
        var s = this.game.colors = {
                textColor: t ? e.dark.active : e.light.active,
                accentColor: "#fff",
                accentColorLight: "#95eaff",
                navTextColor: t ? e.dark : e.light,
                navBg: {
                    color: i.bgColor || (t ? "#fff" : "#000"),
                    opacity: i.opacity || .82
                }
            },
            a = {
                mobile: "32px",
                desktop: "18px"
            };
        i && (i.ui_theme && i.ui_theme !== this.game.ui_theme && (s.navTextColor = e[i.ui_theme]), i.textColor && (s.navTextColor = {
            active: i.textColor.active ? i.textColor.active : s.navTextColor.active,
            disabled: i.textColor.disabled ? i.textColor.disabled : s.navTextColor.disabled
        }), this.game.colors = s), this.game.fonts = {
            fontStyleDefault: {
                font: "24px 'Open Sans', sans-serif",
                fill: s.textColor,
                align: "center"
            },
            fontStyleMedium: {
                font: "26px 'Open Sans', sans-serif",
                fill: s.textColor,
                align: "center"
            },
            fontStyleLarge: {
                font: "40px 'Open Sans', sans-serif",
                fill: s.textColor,
                align: "center"
            },
            fontStyleOversized: {
                font: "60px 'Open Sans', sans-serif",
                fill: s.textColor,
                align: "center"
            },
            fontStyleMassive: {
                font: "92px 'Open Sans', sans-serif",
                fill: s.textColor,
                align: "center"
            },
            fontStyleButton: {
                font: "34px 'Open Sans', sans-serif",
                fill: "#FFFFFF",
                align: "center"
            },
            fontStyleNavMobile: {
                font: a.mobile + " 'Open Sans', sans-serif",
                fill: s.navTextColor.active,
                align: "left"
            },
            fontStyleNavDesktop: {
                font: a.desktop + " 'Open Sans', sans-serif",
                fill: s.navTextColor.active,
                align: "left"
            },
            fontStyleNavMobileDisabled: {
                font: a.mobile + " 'Open Sans', sans-serif",
                fill: s.navTextColor.disabled,
                align: "left"
            },
            fontStyleNavDesktopDisabled: {
                font: a.desktop + " 'Open Sans', sans-serif",
                fill: s.navTextColor.disabled,
                align: "left"
            }
        }, this.add.text(this.game.width, 0, "'Open Sans', sans-serif", this.game.fonts.fontStyleDefault), this.add.text(this.game.width, 0, "'Open Sans', sans-serif", this.game.fonts.fontStyleButton)
    },
    create: function() {
        var t, e, i, s, a, o = window.self !== window.top;
        this.state.start("Preloader"), this.game.CTHelpers = CTHelpers = this.game.plugins.add(Phaser.Plugin.CTHelpers), this.game.CTAnimations = CTAnimations = this.game.plugins.add(Phaser.Plugin.CTAnimations), o && (t = this.game, e = document.getElementsByTagName("html")[0], s = "ontouchstart" in document.documentElement ? "touchend" : "click", i = function(o) {
            t.paused && window.focus(), e.removeEventListener(s, i), a = !1
        }), this.game.onPause.add(function() {
            clearInterval(this.game.beaconInterval), o && (e.addEventListener(s, i), a = !0)
        }, this), this.game.onResume.add(function() {
            this.game.beaconInterval = setInterval(this.game.beaconTracking, this.game.beaconTiming, this.game.cto, this.game), o && a && (e.removeEventListener(s, i), a = !1)
        }, this)
    }
}, MemoryGame.Preloader = function(t) {}, MemoryGame.Preloader.prototype = {
    loadingText: "Cargando...",
    preload: function() {
        this.initGlobalSettings(), this.addVisualElements();
        var t = [
                ["buttonBg", "images/utility/button_bg.png"],
                ["interstitialBg", "images/backgrounds/interstitial_bg.jpg"],
                ["gameplayBg", "images/backgrounds/gameplay_bg.jpg"],
                ["connector1", "images/game/crush.png"],
                ["connector2", "images/game/hank.png"],
                ["connector3", "images/game/marlin_nemo.png"],
                ["connector4", "images/game/mrray.png"],
                ["connector5", "images/game/squirt.png"],
                ["connector6", "images/game/destiny.png"]
            ],
            e = "dark" === this.game.ui_theme ? "_dark" : "",
            i = "images/utility/menu" + e + ".png",
            s = "images/utility/nav_icons" + e + ".png",
            a = [
                ["navtoggle", i, 80, 80],
                ["navicons", s, 20, 20],
                ["pathEl", "images/game/dory_sprite.png", 188, 96],
                ["startConnector", "images/game/dory_idle_sprite.png", 160, 92],
                ["floatingEls", "images/animations/characters_spritesheet.png", 150, 150]
            ],
            o = [
                ["bg_music", "audio/bg_loop.mp3"],
                ["bubble_loop", "audio/bubble_loop.mp3"],
                ["buttonOver", "audio/buttons/over.mp3"],
                ["buttonDown", "audio/buttons/down.mp3"],
                ["buttonOut", "audio/buttons/out.mp3"],
                ["navOpen", "audio/nav/navOpen.mp3"],
                ["navFullscreen", "audio/nav/fullscreenMode.mp3"],
                ["navClose", "audio/nav/navClose.mp3"],
                ["connectFX0", "audio/game/connect1.mp3"],
                ["connectFX1", "audio/game/connect2.mp3"],
                ["connectFX2", "audio/game/connect3.mp3"],
                ["connectFX3", "audio/game/connect4.mp3"],
                ["connectFX4", "audio/game/connect5.mp3"],
                ["connectFX5", "audio/game/connect5.mp3"],
                ["pathElTrace0", "audio/game/pathEl0.mp3"],
                ["pathElTrace1", "audio/game/pathEl1.mp3"],
                ["pathElTrace2", "audio/game/pathEl2.mp3"],
                ["pathElTrace3", "audio/game/pathEl3.mp3"],
                ["pathElTrace4", "audio/game/pathEl4.mp3"],
                ["pathElTrace5", "audio/game/pathEl5.mp3"],
                ["introTrace0", "audio/game/introTrace0.mp3"],
                ["introTrace1", "audio/game/introTrace1.mp3"],
                ["playerGrab", "audio/game/playerGrab.mp3"],
                ["successFX", "audio/game/successFX.mp3"],
                ["failFX", "audio/game/failFX.mp3"]
            ];
        CTHelpers.loadImages(t, this), CTHelpers.loadSpritesheets(a, this), CTHelpers.loadAudio(o, this), this.game.time.events.add(200, function() {
            this.game.load.progress > 0 && this.game.load.progress < 100 ? this.initLoadingAnimation() : this.proceed = !0
        }, this)
    },
    initLoadingAnimation: function() {
        this.preloadText = CTHelpers.renderText(this, this.game.world.centerX, this.game.world.centerY + 80, this.loadingText, this.game.fonts.fontStyleDefault, {
            anchor: [.5, .5],
            alpha: 0
        }), this.preloadTextTween = CTHelpers.pulseAnimationStart(this, this.preloadText, 1.04, 2e3, 1 / 0, !0), CTHelpers.fadeToAlpha(this, this.preloadText, 1, 200), this.progressDisplay = 0, this.progressPx = 0, this.loadTimer = this.game.time.events.loop(16, function() {
            this.updateLoadingAnimation()
        }, this)
    },
    updateLoadingAnimation: function() {
        var t = this.game.load.progress;
        t = this.game.load.progress > 0 ? t : 100, this.progressDisplay < 100 ? (this.progressDisplay < t && (this.progressDisplay += 2), this.progressPx = this.progressDisplay / 100 * this.bar_width, this.cropRect.width = this.progressPx, this.preloadBar.updateCrop()) : this.proceed = !0
    },
    endLoadingAnimation: function() {
        this.preloadTextTween.pause(), this.game.time.events.remove(this.loadTimer)
    },
    create: function() {
        this.game.navOpenSound = this.game.add.audio("navOpen"), this.game.navCloseSound = this.game.add.audio("navClose"), this.game.navFullscreenSound = this.game.add.audio("navFullscreen"), this.game.bubbleLoop = this.game.add.audio("bubble_loop")
    },
    update: function() {
        this.proceed && (this.game.time.events.add(600, function() {
            this.state.start(this.game.debugScreen || "MainMenu")
        }, this), this.loadTimer && this.endLoadingAnimation())
    },
    addVisualElements: function() {
        this.bg = this.add.sprite(0, 0, "defaultBackground"), this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "preloaderBar"), this.preloadBar.anchor.set(0, .5), this.preloadBar.x = this.game.world.centerX - this.preloadBar.width / 2, this.bar_width = this.preloadBar.width, this.cropRect = new Phaser.Rectangle(0, 0, 0, this.preloadBar.height), this.preloadBar.crop(this.cropRect)
    },
    initGlobalSettings: function() {
        this.game.score = {
            recentScore: 0,
            highScore: 0
        }, this.game.currentAudioIndex = 0, this.game.currentAudioTracks = [], this.game.currencySymbolKey = null, this.game.buttonPosY = this.game.height - 116, this.game.navSettings = {
            sprite: "navicons",
            navItems: [{
                buttonName: "goHome",
                defaultLabel: "INICIO",
                defaultFrame: 0,
                activeFrame: 3
            }, {
                buttonName: "enterFullscreen",
                defaultLabel: "PANTALLA COMPLETA",
                activeLabel: "SALIR DE PANTALLA COMPLETA",
                defaultFrame: 1,
                activeFrame: 4,
                persistentProperty: "iframeFullscreen"
            }, {
                buttonName: "muteAudio",
                defaultLabel: "APAGAR AUDIO",
                activeLabel: "PRENDER AUDIO",
                defaultFrame: 5,
                activeFrame: 2,
                persistentProperty: "isMuted"
            }]
        }
    }
}, MemoryGame.MainMenu = function(t) {}, MemoryGame.MainMenu.prototype = {
    startText: "COMIENZA",
    storyText: ["¡Hola! Rayo McQueen está buscando a sus amigos!", "¡Rayo necesita tu ayuda!"],
    animateImages: !0,
    characterBorder: "#DCF5FF",
    characterFill: "#000",
    create: function() {
        this.bg = this.add.sprite(0, 0, "defaultBackground"), this.navMenu = CTHelpers.initNav(this, {
            disabledItems: ["goHome"]
        }), this.game.bg_music ? CTHelpers.restoreBgMusic(this) : CTHelpers.transitionBgMusic(this, "bg_music", {
            volume: .4
        });
        for (var t = CTHelpers.playButton(this.game, this.game.world.centerX, this.game.buttonPosY, this.startText, "play"), e = this.add.group(), i = this.add.group(), s = [], a = [], o = ["RAYO MCQUEEN", "TACO"], n = CTHelpers.colorStringToHexInteger(this.characterBorder), r = CTHelpers.colorStringToHexInteger(this.characterFill), h = 0; h < o.length; h++) {
            var l = o[h],
                c = CTHelpers.renderText(this, 0, -104, l, this.game.fonts.fontStyleDefault, {
                    anchor: [.5, 0]
                }),
                d = this.add.sprite(0, 0, "floatingEls");
            d.frame = h, d.anchor.set(.5), this.animateImages && CTAnimations.animateImage(this, d);
            var p = this.game.add.graphics(0, 0);
            p.lineStyle(10, n, 1), p.beginFill(r, 1), p.drawCircle(0, 0, 130), s[h] = CTHelpers.newGroup([c, p, d], this), i.add(s[h])
        }
        s[0].x = 180, s[0].y = s[0].height, s[1].x = this.game.world.width - 190, s[1].y = this.game.world.height - s[1].height - 40;
        for (var h = 0; h < this.storyText.length; h++) {
            var m = this.storyText[h],
                u = CTHelpers.renderText(this, this.game.world.centerX, 0, m, this.game.fonts.fontStyleDefault, {
                    anchor: [.5, 0],
                    lineSpacing: -6
                });
            a.length > 0 && (u.y = h * (1.3 * a[h - 1].height)), a[h] = u, e.add(a[h])
        }
        e.y = Math.round(this.game.world.centerY - e.height / 2 * 1.4);
        var g = CTHelpers.newGroup([t, e, i], this);
        g.alpha = 0, CTHelpers.fadeToAlpha(this, g, 1, 600), this.game.world.bringToTop(this.navMenu)
    }
}, MemoryGame.Game = function(t) {}, MemoryGame.Game.prototype = {
    connectorsChildren: [],
    connectorsPos: [],
    pathPoints: [],
    pathTweens: [],
    playerCoords: [],
    canDraw: !1,
    introAnimation: !0,
    firstRound: !0,
    playerPulseElIn: !1,
    pathChecked: !1,
    pathComplete: !1,
    yOffset: 24,
    duration: 0,
    durationInitial: 800,
    maxSpeed: 100,
    speedIncreasePct: .75,
    speedIncreaseInterval: 2,
    playbackDuration: 1e3,
    pathElRotateSpeed: 150,
    playerColor: "#BE222C",
    pathColorMain: "#AC1E29",
    pathColorGradient: "#9D1B26",
    playerLineColorMain: "#AC1E29",
    playerLineColorGradient: "#9D1B26",
    cirRadius: 200,
    hitZoneDiameter: 10,
    minRadius: !1,
    numConnectorStart: 3,
    maxNumConnectors: 6,
    connectorIncreaseInterval: 3,
    animateConnectors: [!0, !1, !0, !0, !0, !0],
    connectorAssetOffsets: [{
        x: -2,
        y: 14
    }, {
        x: -4,
        y: 8
    }, {
        x: 0,
        y: -4
    }, {
        x: -10,
        y: 0
    }, {
        x: -2,
        y: -8
    }, {
        x: -40,
        y: 0
    }],
    counter: 0,
    scoreValue: 0,
    scoreInitialValue: 2e3,
    score: 0,
    pointsDefaultText: "Puntos",
    readyText: "En sus marcas, listos, ¡ya!",
    startText: "Tu turno",
    successText: "¡Fantástico! ¡Lo hiciste!",
    failText: "¡Sigue intentándolo!",
    connectFXCount: 6,
    pathElTraceFXCount: 6,
    introTraceFXCount: 2,
    create: function() {
        this.bg = this.add.sprite(0, 0, "gameplayBg"), this.navMenu = CTHelpers.initNav(this, {
            exitFunction: this.endGame.bind(this)
        }), this.game.physics.startSystem(Phaser.Physics.ARCADE), this.numConnectors = this.numConnectorStart, this.bmd = this.add.bitmapData(this.game.world.width, this.game.world.height), this.bmd.ctx.beginPath(), this.bmd.ctx.lineWidth = "10", this.bmd.ctx.strokeStyle = this.pathColorMain, this.bmd.ctx.stroke(), this.gamePath = this.add.sprite(0, 0, this.bmd), this.connectors = this.add.group(), this.initialEls = this.add.group();
        var t = 20;
        textY = .04 * this.game.height, this.textPrompt = CTHelpers.renderText(this, this.game.world.centerX, textY, this.readyText, this.game.fonts.fontStyleMedium, {
            anchor: [.5, 0]
        }), this.game.currencySymbolKey ? (this.scoreIndicator = this.add.sprite(0, 0, "scoreIndicator"), this.scoreIndicator.scale.set(.28)) : this.scoreIndicator = CTHelpers.renderText(this, 0, 0, this.pointsDefaultText + ":", this.game.fonts.fontStyleMedium);
        var e = this.scoreIndicator.width + 10;
        this.text_score = CTHelpers.renderText(this, e, 0, this.counter, this.game.fonts.fontStyleMedium), this.scoreDisplay = CTHelpers.newGroup([this.scoreIndicator, this.text_score], this), this.scoreDisplay.x = t, this.scoreDisplay.y = textY, this.scoreValue = this.scoreInitialValue, this.startConnector = this.generateConnector("startConnector", this.game.world.centerX, this.game.world.centerY, !0, {
            x: -5,
            y: 0,
            scale: {
                x: -1
            }
        }, {
            speed: 8
        });
        var i = Math.max(Math.abs(this.startConnector.children[1].width), 60);
        this.playerPulse = CTHelpers.drawCircleSprite(this, 0, 0, i, this.playerColor), this.playerPulse.anchor.set(.5), this.playerPulseGroup = CTHelpers.newGroup(this.playerPulse, this), this.playerPulseGroup.x = this.startConnector.x, this.playerPulseGroup.y = this.startConnector.y, this.playerPulseGroup.alpha = 0, this.player = CTHelpers.drawCircleSprite(this, this.startConnector.x, this.startConnector.y, i, this.playerColor), this.game.physics.arcade.enable(this.player), this.player.anchor.set(.5), this.player.alpha = 0, this.player.body.collideWorldBounds = !0, this.playerCoords.push({
            xPos: this.player.x,
            yPos: this.player.y
        }), this.player.inputEnabled = !0, this.player.events.onDragStart.add(this.startDrag, this), this.player.events.onDragStop.add(this.stopDrag, this), this.pathEl = this.add.sprite(this.game.world.centerX, this.game.world.centerY + this.yOffset, "pathEl"), this.pathEl.alpha = 0, this.pathEl.anchor.setTo(.6, .5);
        this.pathEl.animations.add("swim");
        this.pathEl.animations.play("swim", 20, !0), this.playerGroup = CTHelpers.newGroup([this.playerPulseGroup, this.player, this.pathEl], this), this.duration = this.durationInitial, CTHelpers.restoreBgMusic(this), this.playerGrabFX = this.add.audio("playerGrab"), this.connectFXArray = [];
        for (var s = 0; s < this.connectFXCount; s++) this.connectFXArray[s] = this.add.audio("connectFX" + s);
        this.successFX = this.add.audio("successFX"), this.failFX = this.add.audio("failFX");
        for (var a = ["pathElTrace", "introTrace"], s = 0; s < a.length; s++) {
            for (var o = a[s], n = [], r = 0; r < this[o + "FXCount"]; r++) {
                var h = this.add.audio(o + r);
                n.push(h)
            }
            this[o + "Sounds"] = n
        }
        this.game.world.bringToTop(this.navMenu), this.staticEls = CTHelpers.newGroup([this.textPrompt, this.scoreDisplay], this), this.interactiveEls = CTHelpers.newGroup([this.gamePath, this.startConnector], this), this.resetScore(), this.initialEls.alpha = 0, this.initLevel()
    },
    clearLevel: function() {
        var t = {
                xPos: this.startConnector.x,
                yPos: this.startConnector.y
            },
            e = {
                connectorsPos: [],
                connectorsChildren: [],
                pathTweens: [],
                pathChecked: !1,
                introAnimation: !0,
                pathComplete: !1,
                playerPulseElIn: !1,
                currPathPos: t,
                pathPoints: [t],
                playerCoords: [t]
            };
        CTHelpers.extendObject(this, e), this.initialEls.removeAll(), this.connectors.removeAll(), this.pathEl.position.set(this.startConnector.x, this.startConnector.y), this.player.position.set(this.startConnector.x, this.startConnector.y), this.playerPulseGroup.x = this.startConnector.x, this.playerPulseGroup.y = this.startConnector.y, this.pathEl.alpha = 0, this.gamePath.alpha = 1, this.startConnector.alpha = 1, this.playerPulseGroup.alpha = 0, this.firstRound || trackRoundEnd(this.game.cto, this.game.analyticsPrefix)
    },
    newLevel: function() {
        this.wipeTransition = this.counter % this.connectorIncreaseInterval === 0, this.wipeTransition ? (this.floatingElements = CTAnimations.initBubbleWipe(this), this.game.time.events.add(this.floatingElements.config.durationRange.min / 1.5, function() {
            var t = CTHelpers.fadeToAlpha(this, this.interactiveEls, 0, 100);
            t.onComplete.add(function() {
                this.initLevel()
            }, this)
        }, this)) : this.initLevel()
    },
    initLevel: function() {
        this.clearLevel(), this.firstRound = !1, this.connectors.enableBody = !0;
        var t = this.counter % this.connectorIncreaseInterval === 0;
        this.counter > 1 && t && this.numConnectors < this.maxNumConnectors && (this.numConnectors = this.numConnectors + 1), this.processConnectors(), this.shuffleConnectors(), this.scoreValue = this.scoreInitialValue * this.numConnectors, CTHelpers.addToGroup(this.interactiveEls, [this.connectors, this.playerGroup]), CTHelpers.addToGroup(this.initialEls, [this.staticEls, this.interactiveEls]), 0 === this.initialEls.alpha && CTHelpers.fadeToAlpha(this, this.initialEls, 1, 600);
        var e = CTHelpers.fadeToAlpha(this, this.interactiveEls, 1, 400);
        e.onComplete.add(function() {
            var t = this.wipeTransition ? this.floatingElements.config.durationRange.min / 2 : 300;
            this.game.time.events.add(t, function() {
                this.startPlay()
            }, this)
        }, this)
    },
    startPlay: function() {
        var t = this.counter % this.speedIncreaseInterval === 0,
            e = this.duration > this.maxSpeed;
        if (this.numConnectors === this.maxNumConnectors && t && e) {
            this.duration = Math.round(this.duration * this.speedIncreasePct);
            var i = this.durationInitial / this.duration;
            this.scoreValue = Math.round(this.scoreValue * i), this.duration < this.maxSpeed && (this.duration = this.maxSpeed)
        }
        this.traceInitialPath(this.duration, Phaser.Easing.Linear.None), CTHelpers.replaceText(this.textPrompt, this.readyText), trackRoundStart(this.game.cto, this.game.analyticsPrefix)
    },
    update: function() {
        1 === this.pathEl.alpha /*&& drawTrailingBubbles(this.game, {
            trailID: "followDory",
            x: this.pathEl.x,
            y: this.pathEl.y,
            resistance: 250
        })*/, this.introAnimation ? this.drawInitialPath() : this.pathChecked || (this.pathEl.position.set(this.startConnector.x, this.startConnector.y), CTHelpers.replaceText(this.textPrompt, this.startText), this.game.physics.arcade.overlap(this.player, this.connectors, this.initConnectorActive, null, this), this.canDraw && (this.player.input.enableDrag(), this.drawPlayerLine(), this.playerPulseElIn || this.startPulse()), this.checkSuccess())
    },
    startDrag: function() {
        this.player.body.moves = !1, this.hidePulse(), this.playerGrabFX.play()
    },
    stopDrag: function() {
        this.player.body.moves = !0
    },
    startPulse: function() {
        var t = CTHelpers.fadeToAlpha(this, this.player, 1, 150),
            e = 1200;
        t.onComplete.addOnce(function() {
            this.playerPulseGroup.scale.set(1), this.playerPulseGroup.alpha = 1, this.playerPulse.pulseTweens = {
                scale: CTHelpers.pulseAnimationStart(this, this.playerPulse, 2, e, 1 / 0, !1, Phaser.Easing.Cubic.In),
                alpha: CTHelpers.fadeToAlpha(this, this.playerPulse, 0, e, Phaser.Easing.Exponential.In)
            }, this.playerPulse.pulseTweens.alpha.repeat()
        }, this), this.playerPulseElIn = !0
    },
    hidePulse: function() {
        var t = 100,
            e = {
                scale: this.add.tween(this.playerPulseGroup.scale).to({
                    x: 0,
                    y: 0
                }, t).start(),
                alpha: this.add.tween(this.playerPulseGroup).to({
                    alpha: 0
                }, t).start()
            };
        this.playerPulse.pulseTweens.scale.stop(), this.playerPulse.pulseTweens.alpha.stop(), e.alpha.onComplete.addOnce(function() {
            this.playerPulse.scale.set(1), this.playerPulse.alpha = .85
        }, this)
    },
    shuffleConnectors: function() {
        this.connectorsChildren = shuffle(this.connectors.children);
        for (var t = 0; t < this.connectorsChildren.length; t++) this.connectorsPos.push({
            xPos: this.connectorsChildren[t].x,
            yPos: this.connectorsChildren[t].y
        })
    },
    traceInitialPath: function(t, e) {
        var i = this,
            s = this.introAnimation ? this.introTraceSounds : this.pathElTraceSounds,
            a = this.introAnimation ? t / 4 : t / 2.5,
            o = this.introAnimation ? .25 : .9;
        this.pathEl.position.set(this.startConnector.x, this.startConnector.y), this.pathChecked && (this.pathTweens = []);
        for (var n = 0; n < this.connectorsPos.length; n++) {
            var r = this.add.tween(this.pathEl).to({
                x: this.connectorsPos[n].xPos,
                y: this.connectorsPos[n].yPos
            }, t, e);
            r.currIndex = n, r.soundDelay = a, r.soundFX = s[n % s.length], this.pathTweens.push(r)
        }
        for (var n = 0; n < this.pathTweens.length; n++) {
            var h = this.pathTweens[n],
                l = this.pathTweens[n + 1];
            h.chain(l), h.onStart.add(function(t, e) {
                i.game.time.events.add(e.soundDelay, function() {
                    e.soundFX.play(), e.soundFX.volume = o
                }, i)
            }, i), h.onComplete.add(function(t, e) {
                var s = e.properties.x,
                    a = e.properties.y,
                    o = e.currIndex + 1;
                if (i.currPathPos = {
                        xPos: s,
                        yPos: a
                    }, i.pathPoints.push(i.currPathPos), i.connectorsChildren && i.connectorsChildren[o]) {
                    var n = i.game.physics.arcade.angleBetween(i.pathEl, i.connectorsChildren[o]);
                    i.pathEl.scale.y = getYScaleFromAngle(n), i.add.tween(this.pathEl).to({
                        rotation: n
                    }, i.pathElRotateSpeed, Phaser.Easing.Linear.None, !0)
                }
            }, i)
        }
        var c = this.pathTweens[this.pathTweens.length - 1];
        this.introAnimation ? c.onComplete.add(function() {
            var t = CTHelpers.fadeToAlpha(this, this.gamePath, 0, 200);
            t.onComplete.add(function() {
                this.game.time.events.add(400, i.initLineDraw, this)
            }, this)
        }, this) : c.onComplete.add(function() {
            i.game.time.events.add(400, i.newLevel, this)
        }, this), this.pathTweens[0].start()
    },
    drawInitialPath: function() {
        this.bmd.clear(), this.bmd.ctx.beginPath(), this.setBmdGradientStroke(this.pathColorMain, this.pathColorGradient, .3, .7), this.bmd.ctx.moveTo(this.currPathPos.xPos, this.currPathPos.yPos), this.bmd.ctx.lineTo(this.pathEl.x, this.pathEl.y);
        for (var t = 0; t < this.pathPoints.length - 1; t++) this.pathPoints[t + 1] && (this.bmd.ctx.moveTo(this.pathPoints[t].xPos, this.pathPoints[t].yPos), this.bmd.ctx.lineTo(this.pathPoints[t + 1].xPos, this.pathPoints[t + 1].yPos));
        this.bmd.ctx.stroke(), this.bmd.ctx.closePath()
    },
    drawPlayerLine: function() {
        this.gamePath.alpha = 1, this.bmd.clear(), this.bmd.ctx.beginPath(), this.setBmdGradientStroke(this.playerLineColorMain, this.playerLineColorGradient, .3, .7);
        for (var t = 0; t < this.playerCoords.length; t++) this.bmd.ctx.moveTo(this.playerCoords[t].xPos, this.playerCoords[t].yPos), this.playerCoords[t + 1] && this.bmd.ctx.lineTo(this.playerCoords[t + 1].xPos, this.playerCoords[t + 1].yPos);
        this.playerCoords.length === this.numConnectors + 1 && (this.pathComplete = !0), this.pathComplete || this.bmd.ctx.lineTo(this.player.x, this.player.y), this.bmd.ctx.stroke(), this.bmd.ctx.closePath()
    },
    generateConnector: function(t, e, i, s, a, o) {
        var n, r = a || {
            x: 0,
            y: 0
        };
        if (n = this.add.sprite(r.x, r.y, t), n.anchor.set(.5), o) {
            var h = "object" == typeof o && o.speed ? o.speed : 16;
            n.animations.add("anim");
            n.animations.play("anim", h, !0)
        }
        var l = Math.min(this.hitZoneDiameter, n.width, n.height),
            c = CTHelpers.drawCircleSprite(this, 0, 0, l);
        c.anchor.set(.5), c.x = e, c.y = i + this.yOffset;
        var d = CTAnimations.drawGradientCircle(this, {
            width: 2 * l
        });
        return d.alpha = .24, d.scale.setTo(1, .8), d.anchor.set(.5), c.addChild(d), c.addChild(n), s && CTAnimations.animateImage(this, n, {
            timing: {
                min: 3600,
                max: 4200
            },
            xShift: {
                min: -4,
                max: 4
            },
            yShift: {
                min: -5,
                max: 5
            },
            rotation: {
                min: 0,
                max: .07 * Math.PI
            }
        }), r.scale && (r.scale.x && (n.scale.x = r.scale.x), r.scale.y && (n.scale.y = r.scale.y)), c
    },
    processConnectors: function() {
        for (var t = Math.PI, e = [{
                min: -7 / 8 * t,
                max: -5 / 8 * t,
                anchor: [1, 1]
            }, {
                min: -5 / 8 * t,
                max: -3 / 8 * t,
                anchor: [.5, 1]
            }, {
                min: -3 / 8 * t,
                max: -1 / 8 * t,
                anchor: [0, 1]
            }, {
                min: -1 / 8 * t,
                max: 1 / 8 * t,
                anchor: [0, .5]
            }, {
                min: 1 / 8 * t,
                max: 3 / 8 * t,
                anchor: [0, 0]
            }, {
                min: 3 / 8 * t,
                max: 5 / 8 * t,
                anchor: [.5, 0]
            }, {
                min: 5 / 8 * t,
                max: 7 / 8 * t,
                anchor: [1, 0]
            }, {
                min: -1 * t,
                max: t,
                anchor: [1, .5]
            }], i = 0; i < this.numConnectors; i++) {
            var s = this.game.world.centerX + this.cirRadius * Math.cos(i * t / (this.numConnectors / 2) + t / 16) * -1.5,
                a = this.game.world.centerY + this.cirRadius * Math.sin(i * t / (this.numConnectors / 2) + t / 16) * .94,
                o = "connector" + [i + 1],
                n = this.animateConnectors[i],
                r = this.connectorAssetOffsets[i];
            this.connector = this.generateConnector(o, s, a, n, r);
            for (var h = this.game.physics.arcade.angleBetween(this.startConnector, this.connector), l = 0; l < e.length; l++)
                if (h >= e[l].min && h < e[l].max) {
                    var c = e[l].anchor,
                        d = this.connector.width,
                        p = 140 / d,
                        m = .5,
                        u = Math.min(p, m / 2),
                        s = (c[0] - .5) * u + .5,
                        a = (c[1] - .5) * u + .5;
                    this.connector.anchor.setTo(s, a), this.connector.children[0].anchor.setTo(s, a), this.connector.children[1].anchor.setTo(s, a);
                    break
                }
            CTHelpers.addToGroup(this.connectors, [this.connector])
        }
    },
    initConnectorActive: function(t, e) {
        e.frame = 1, CTHelpers.fadeToAlpha(this, e.children[0], 1, 200);
        for (var i = 0; i < this.connectorsPos.length; i++) this.connectorsPos[i].xPos !== e.x || this.connectorsPos[i].yPos !== e.y || this.connectorsPos[i].active || (this.playerCoords.push(this.connectorsPos[i]), this.connectorsPos[i].active = !0, this.connectFXArray[i % this.connectFXCount].play())
    },
    initLineDraw: function() {
        this.canDraw = !0, this.introAnimation = !1
    },
    resetScore: function() {
        this.counter = 0, this.score = 0, this.firstRound = !0, this.scoreValue = this.scoreInitialValue, CTHelpers.replaceText(this.text_score, this.score)
    },
    checkSuccess: function() {
        if (this.pathComplete && !this.pathChecked) {
            var t = compareArrays(this.pathPoints, this.playerCoords),
                e = 200;
            this.pathChecked = !0, this.canDraw = !1, this.introAnimation = !1, this.game.time.events.add(e, function() {
                CTHelpers.fadeToAlpha(this, this.player, 0, 200);
                var t = CTHelpers.fadeToAlpha(this, this.gamePath, 0, 200);
                t.onComplete.add(function() {
                    this.bmd.clear()
                }, this)
            }, this), this.game.time.events.add(600, function() {
                t ? this.handleSuccess() : this.handleFailure()
            }, this)
        }
    },
    handleSuccess: function() {
        CTHelpers.fadeToAlpha(this, this.startConnector, 0, 50), CTHelpers.replaceText(this.textPrompt, this.successText), this.counter++, this.score = this.score + this.scoreValue, this.updateScores();
        var t = CTHelpers.numberWithCommas(this.score);
        CTHelpers.replaceText(this.text_score, t), this.successFX.play();
        var e = CTHelpers.fadeToAlpha(this, this.pathEl, 1, 600),
            i = this.game.physics.arcade.angleBetween(this.pathEl, this.connectorsChildren[0]);
        this.pathEl.scale.y = getYScaleFromAngle(i), this.pathEl.rotation = i, e.onComplete.add(function() {
            this.game.time.events.add(300, function() {
                this.traceInitialPath(this.playbackDuration, Phaser.Easing.Quintic.InOut)
            }, this)
        }, this)
    },
    handleFailure: function() {
        this.endGame(!0, CTHelpers.launchInterstitial)
    },
    updateScores: function(t) {
        this.game.score.recentScore = this.score, t && (this.game.score.newBest = this.game.score.recentScore > this.game.score.highScore, this.game.score.tiedBest = this.game.score.recentScore === this.game.score.highScore, this.game.score.newBest && (this.game.score.highScore = this.game.score.recentScore))
    },
    setBmdGradientStroke: function(t, e, i, s) {
        var a = this.bmd.ctx.createLinearGradient(0, 0, 0, this.game.world.height);
        e ? (a.addColorStop(i, t), a.addColorStop(s, e), this.bmd.ctx.strokeStyle = a) : this.bmd.ctx.strokeStyle = t
    },
    endGame: function(t, e) {
        if ( trackRoundEnd(this.game.cto, this.game.analyticsPrefix), this.updateScores(!0), t) 
        {
            CTHelpers.replaceText(this.textPrompt, this.failText);
            CTHelpers.playResultFX(this, this.failFX, e)
            /*
            for (var i = 0; i < this.connectorsChildren.length; i++) CTHelpers.fadeToAlpha(this, this.connectorsChildren[i].children[0], 0, 200);
			, CTAnimations.initBubbleWipe(this, {
                numItems: 140,
                durationRange: {
                    min: 4800,
                    max: 16e3
                }
            })*/
        } else e && e()
    }
}, MemoryGame.Interstitial = function(t) {}, MemoryGame.Interstitial.prototype = {
    thanksText: ["GRACIAS", "POR TU AYUDA!"],
    scoreText: "PUNTOS",
    newText: "NUEVO ",
    tiedText: "TU ",
    newSuffix: "!",
    oldSuffix: ": ",
    highScoreText: "RÉCORD PERSONAL",
    playAgainText: "REINTENTAR",
    exitGameText: "SALIR",
    textAccentColor: "#FFC100",
    textAccentGradient: "#FFDD69",
    shareText: "COMPARTIR",
    shareScoreText: "Yo ayudé a Rayo McQueen a hacer ##score## puntos en disneylatino.com!",
    create: function() {
        this.bg = this.add.sprite(0, 0, "interstitialBg");
        var t = this.game.timeUp ? {
            disabledItems: ["goHome", "enterFullscreen"]
        } : null;
        this.navMenu = CTHelpers.initNav(this, t), CTHelpers.restoreBgMusic(this);
        var e = CTHelpers.renderText(this, 0, 0, this.thanksText[0], this.game.fonts.fontStyleOversized, {
                anchor: [.5, .5],
                lineSpacing: -12
            }),
            i = CTHelpers.renderText(this, 0, .7 * e.height, this.thanksText[1], this.game.fonts.fontStyleLarge, {
                anchor: [.5, .5],
                lineSpacing: -12
            });
        this.textLines = CTHelpers.newGroup([e, i], this), this.textLines.alpha = 0, this.textLines.x = Math.round(this.game.world.centerX), this.textLines.y = Math.round(.175 * this.game.height);
        var s = CTHelpers.numberWithCommas(this.game.score.recentScore);
        this.game.currencySymbolKey ? (this.groupScoreOutput("scoreDisplay", "scoreIndicator", this.game.currencySymbolKey, 1, "score_text", s, 10, this.game.fonts.fontStyleMassive), this.textAccentColor && setTextGradient(this.scoreDisplay.children[1], this.textAccentColor, this.textAccentGradient), CTHelpers.restyleText(this.scoreDisplay.children[1], {
            x: Math.round(-(this.scoreDisplay.width / 2))
        })) : (this.scoreDisplay = CTHelpers.renderText(this, 10, 0, s, this.game.fonts.fontStyleMassive), this.textAccentColor && setTextGradient(this.scoreDisplay, this.textAccentColor, this.textAccentGradient), CTHelpers.restyleText(this.scoreDisplay, {
            x: Math.round(-(this.scoreDisplay.width / 2))
        }));
        var a = CTHelpers.renderText(this, 0, 1.15 * this.scoreDisplay.height, this.scoreText, this.game.fonts.fontStyleLarge, {
            anchor: [.5, .5],
            lineSpacing: -12
        });
        if (this.textAccentColor && (a.fill = this.textAccentColor), score_output = CTHelpers.newGroup([this.scoreDisplay, a], this), score_output.y = .8 * this.textLines.height, CTHelpers.addToGroup(this.textLines, [score_output]), this.game.score.highScore > 0 || this.game.score.recentScore > 0) {
            var o = this.game.score.newBest || this.game.score.tiedBest,
                n = o ? "" : CTHelpers.numberWithCommas(this.game.score.highScore),
                r = this.game.score.newBest ? this.newText : this.game.score.tiedBest ? this.tiedText : "",
                h = o ? r + this.highScoreText + this.newSuffix : this.highScoreText + this.oldSuffix;
            this.high_score_text = CTHelpers.renderText(this, 0, 0, h, this.game.fonts.fontStyleMedium, {
                anchor: [0, 0]
            }), this.game.currencySymbolKey && !o ? this.groupScoreOutput("highScoreTotal", "highScoreIndicator", this.game.currencySymbolKey, .28, "high_score_value", n, 8, this.game.fonts.fontStyleMedium) : this.highScoreTotal = CTHelpers.renderText(this, 0, 0, n, this.game.fonts.fontStyleMedium), this.highScoreTotal.x = this.high_score_text.width + 8, this.highScoreDisplay = CTHelpers.newGroup([this.high_score_text, this.highScoreTotal], this), this.highScoreDisplay.x = Math.round(-(this.highScoreDisplay.width / 2)), this.highScoreDisplay.y = Math.round(.9 * this.textLines.height), CTHelpers.addToGroup(this.textLines, [this.highScoreDisplay])
        }
        if (this.foreground_content = CTHelpers.newGroup([this.textLines, this.navMenu], this), this.game.timeUp) {
            var l = function() {
                window.location.reload()
            };
            this.playAgainButton = CTHelpers.styledButton(this.game, this.game.world.centerX, this.game.buttonPosY, this.exitGameText, "exit", l)
        } else this.playAgainButton = CTHelpers.playButton(this.game, this.game.world.centerX, this.game.buttonPosY, this.playAgainText, "replay");
        if ( 
             this.foreground_content.add(this.playAgainButton), 
             CTHelpers.addToGroup(this.foreground_content, this.playAgainButton), 
             this.game.socialEnabled
            ) 
         {
            var c = (this.game.height + this.game.buttonPosY + this.playAgainButton.height / 2) / 2;
            this.socialButton = CTHelpers.renderText(this, this.game.width / 2, c, this.shareText, this.game.fonts.fontStyleDefault, {
                anchor: [.5, .5],
                lineSpacing: -10
            }), setTextGradient(this.socialButton, this.textAccentColor, this.textAccentGradient), CTHelpers.bindInput(this.socialButton, {
                onInputUp: this.launchSocial
            }, this), CTHelpers.addToGroup(this.foreground_content, this.socialButton)
         }
        this.floatingElements = CTAnimations.initFloatingAnimation(this, {        
            numItems: 24,
            itemSize: {
                min: 80,
                max: 150
            },
            itemAlpha: {
                min: .7,
                max: 1
            },
            safeContent: this.textLines,
            foregroundContent: this.foreground_content,
            rotationMax: Math.PI / 1.5,
            rotationStart: {
                min: -Math.PI / 8,
                max: Math.PI / 8
            },
            floatType: "float",
            sortProperty: "alpha",
            /*
            bgSpriteDynamic: {
                constructorFunction: CTAnimations.drawBubbleSprite,
                context: this
            },            
            soundFX: this.game.bubbleLoop,
            onDragStart: pauseBubbleTweens,
            onDragStop: releaseOrPopBubble
            */
        }), 
        this.floatingElements.alpha = 0
        ,CTHelpers.fadeToAlpha(this, this.textLines, 1, 500) 
        /*, CTHelpers.fadeToAlpha(this, this.floatingElements, 1, 500)*/
    },
    startTriggerUp: function(t) {
        CTHelpers.startGame(this)
    },
    update: function() {
        /*drawTrailingBubbles(this.game, {
            trailID: "followCursor",
            x: this.game.input.x,
            y: this.game.input.y
        })*/
    },
    shutdown: function() {
        CTAnimations.shutdownFloatingAnimation(this.floatingElements)
    },
    groupScoreOutput: function(t, e, i, s, a, o, n, r) {
        this[t] = this.add.group(), this[e] = this.add.sprite(0, 0, i), this[e].scale.set(s), this[a] = CTHelpers.renderText(this, this[e].width + n, 0, o, r, {
            anchor: [0, 0],
            align: "left"
        }), CTHelpers.addToGroup(this[t], [this[e], this[a]])
    },
    launchSocial: function() {
        var t = this.game.cto,
            e = this.shareScoreText.split("##score##"),
            i = CTHelpers.numberWithCommas(this.game.score.highScore),
            s = e[0] + i + e[1],
            a = {
                action: "launch_social",
                shareMessage: s
            };
        window.parent.postMessage(a, "*"), t && t.trackEvent({
            engagementType: this.game.analyticsPrefix + "_socialShareBtn"
        })
    }
};