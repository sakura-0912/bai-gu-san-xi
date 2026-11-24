(function () {
  "use strict";

  const R = window.BoneRules;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const SAVE_KEY = "bgsx_save_v1";
  const SETTINGS_KEY = "bgsx_settings_v1";

  const els = {
    app: $("#app"),
    titleScreen: $("#titleScreen"),
    gameScreen: $("#gameScreen"),
    endingScreen: $("#endingScreen"),
    newGameBtn: $("#newGameBtn"),
    continueBtn: $("#continueBtn"),
    helpBtnTitle: $("#helpBtnTitle"),
    soundBtn: $("#soundBtn"),
    menuBtn: $("#menuBtn"),
    chapterEyebrow: $("#chapterEyebrow"),
    chapterTitle: $("#chapterTitle"),
    trustPips: $("#trustPips"),
    trustText: $("#trustText"),
    clueText: $("#clueText"),
    evidenceText: $("#evidenceText"),
    insightText: $("#insightText"),
    stage: $("#stage"),
    stagePlace: $("#stagePlace"),
    visionStatus: $("#visionStatus"),
    hotspotLayer: $("#hotspotLayer"),
    stageCaption: $("#stageCaption"),
    bossIntent: $("#bossIntent"),
    bossIntentText: $("#bossIntentText"),
    floatLayer: $("#floatLayer"),
    battleBars: $("#battleBars"),
    playerHpFill: $("#playerHpFill"),
    playerHpText: $("#playerHpText"),
    masterHpFill: $("#masterHpFill"),
    masterHpText: $("#masterHpText"),
    bossHpFill: $("#bossHpFill"),
    bossHpText: $("#bossHpText"),
    boneRings: $("#boneRings"),
    speakerSeal: $("#speakerSeal"),
    speakerName: $("#speakerName"),
    speakerRole: $("#speakerRole"),
    dialogueText: $("#dialogueText"),
    evidenceChips: $("#evidenceChips"),
    actionArea: $("#actionArea"),
    endingKicker: $("#endingKicker"),
    endingTitle: $("#endingTitle"),
    endingSeal: $("#endingSeal"),
    endingText: $("#endingText"),
    endingQuote: $("#endingQuote"),
    endingStats: $("#endingStats"),
    restartBtn: $("#restartBtn"),
    endingTitleBtn: $("#endingTitleBtn"),
    toast: $("#toast"),
    modalRoot: $("#modalRoot")
  };

  const PROLOGUE = [
    {
      speaker: "山野",
      role: "白虎岭",
      seal: "叙",
      sealClass: "seal-narrator",
      text: "白虎岭上，师徒四人腹中饥饿。悟空腾云去化斋，临行前在师父身周画了一个圈。"
    },
    {
      speaker: "山野",
      role: "白虎岭",
      seal: "叙",
      sealClass: "seal-narrator",
      text: "云头未远，他回头看见一个提篮的女子，正朝唐僧走去。八戒已经迎了上去。"
    }
  ];

  const TRIAL_CONTENT = {
    village: {
      place: "白虎岭 · 山道",
      intro: {
        speaker: "村姑",
        role: "提篮女子",
        seal: "女",
        sealClass: "",
        text: "“长老，奴家送斋来了。”女子把篮子递近。八戒先迎上去，唐僧合掌道谢。悟空落在山道上，只看见她脚下淡得没有根。"
      },
      resume: {
        speaker: "悟空",
        role: "大徒弟",
        seal: "悟",
        sealClass: "",
        text: "山道上的妖气还没散。开法眼，把眼前的破绽一处一处看清楚。"
      },
      hotspots: {
        meal: {
          label: "篮中斋饭",
          x: 72.5,
          y: 69,
          text: "篮盖缝里，米粒下有东西在动。悟空凝目看去，是长蛆、青蛙与癞虾蟆。凡人眼里却只有白米饭。",
          clue: "篮中斋饭是妖术所化。",
          short: "妖饭"
        },
        shadow: {
          label: "日下淡影",
          x: 62,
          y: 82,
          text: "日头正烈，女子的影子却淡得像纸背漏墨，脚跟也不着地。",
          clue: "她的影子没有根。",
          short: "淡影"
        },
        bajie: {
          label: "八戒神色",
          x: 15.5,
          y: 70,
          text: "八戒的鼻子几乎伸进篮里，连女子袖口露出的白骨都没看见。",
          clue: "八戒被饭食迷住，没看人。",
          short: "馋相"
        }
      },
      selected: {
        reveal: {
          speaker: "悟空",
          role: "大徒弟",
          seal: "悟",
          sealClass: "",
          text: "悟空把篮子往地上一扣。蛆虫、青蛙滚了满地。女子脸色一变，皮囊像湿纸般塌下，一缕妖风卷向岭后。唐僧后退半步，念了一声佛号，却没有再斥责。"
        },
        strike: {
          speaker: "唐僧",
          role: "师父",
          seal: "僧",
          sealClass: "seal-monk",
          text: "金箍棒落下，女子应声倒地。众人再看时，地上只剩一具假尸，篮里的白饭也变回蛆虫。“悟空，你……你又行凶！”唐僧惊得跌坐在地。"
        },
        protect: {
          speaker: "悟空",
          role: "大徒弟",
          seal: "悟",
          sealClass: "",
          text: "悟空横棒挡在唐僧身前。妖风擦着棒身卷过，女子已不见踪影。“师父，她走了。”唐僧望着空山路，眉头没有松开。"
        }
      }
    },
    mother: {
      place: "白虎岭 · 山坳",
      intro: {
        speaker: "老妇",
        role: "寻女之人",
        seal: "妇",
        sealClass: "",
        text: "“我的女儿啊……你们可见我的女儿？”老妇拄杖而来。八戒说这莫不是方才那女子，唐僧立刻让悟空退下。悟空却只盯着她的腕骨。"
      },
      resume: {
        speaker: "悟空",
        role: "大徒弟",
        seal: "悟",
        sealClass: "",
        text: "哭声还在山谷里打转。开法眼，看看这根竹杖、这双眼、这双手，到底哪里不对。"
      },
      hotspots: {
        cane: {
          label: "竹杖新痕",
          x: 63,
          y: 73,
          text: "竹杖青皮未褪，握处没有半点汗渍，倒像刚从山里砍下。",
          clue: "竹杖是新的，不像寻人走了远路。",
          short: "新杖"
        },
        tears: {
          label: "无泪哭腔",
          x: 68.5,
          y: 48,
          text: "哭声很大，眼角却干。她的声调一高一低，像照着人心里最软的地方念。",
          clue: "哭而无泪，声调有诈。",
          short: "干泪"
        },
        wrist: {
          label: "腕骨有力",
          x: 74.5,
          y: 62,
          text: "悟空瞥见她袖口下的腕骨，筋络绷得比壮汉还紧。",
          clue: "老妇腕骨有力，不是老迈之身。",
          short: "腕骨"
        }
      },
      selected: {
        reveal: {
          speaker: "悟空",
          role: "大徒弟",
          seal: "悟",
          sealClass: "",
          text: "悟空把竹杖一折，杖心里爬出几缕白骨丝。老妇的哭声突然断了，佝偻的背一点点挺直，又塌成一团白雾。唐僧看清了那几缕骨丝，沉默许久。"
        },
        strike: {
          speaker: "唐僧",
          role: "师父",
          seal: "僧",
          sealClass: "seal-monk",
          text: "棒风落下，老妇倒成一具假尸。唐僧闭眼念咒，悟空头痛得单膝跪地。“你还要打杀多少人才肯停？”"
        },
        protect: {
          speaker: "唐僧",
          role: "师父",
          seal: "僧",
          sealClass: "seal-monk",
          text: "悟空没有追，只把唐僧护在身后。老妇的哭声在山谷里绕了三圈，渐渐远去。唐僧低声道：“你为何总不肯说清楚？”"
        }
      }
    },
    father: {
      place: "白虎岭 · 洞门前",
      intro: {
        speaker: "老翁",
        role: "寻妻女之人",
        seal: "翁",
        sealClass: "",
        text: "岭上风更冷。一个老翁拄杖而来，颈上挂着一串念珠。“老夫寻妻女，走到这里……”唐僧已不肯再信悟空，悟空却看见他身后洞门里的白骨微光。"
      },
      resume: {
        speaker: "悟空",
        role: "大徒弟",
        seal: "悟",
        sealClass: "",
        text: "第三张假面就在眼前。开法眼，把念珠、脚印、称呼都看清楚。"
      },
      hotspots: {
        beads: {
          label: "念珠无缝",
          x: 67,
          y: 59,
          text: "每颗骨珠都穿不得绳，偏被一缕妖气黏在一起。老翁捻珠时，珠子没有半点碰撞声。",
          clue: "念珠无缝，是妖气黏成。",
          short: "骨珠"
        },
        footprint: {
          label: "无根脚印",
          x: 74,
          y: 84,
          text: "他走了这几步，地上没有半个脚印。枯叶也没被踩碎。",
          clue: "老翁脚下无痕。",
          short: "无痕"
        },
        name: {
          label: "称呼露怯",
          x: 69,
          y: 43,
          text: "他先说“妻女”，又改口“女儿”；问到姓氏，他眼珠转了两转，才说是“白”。",
          clue: "称呼与姓氏都像临时编的。",
          short: "露怯"
        }
      },
      selected: {
        reveal: {
          speaker: "白骨夫人",
          role: "尸魔",
          seal: "骨",
          sealClass: "seal-bone",
          text: "悟空把念珠抛向半空。骨珠散开，落地时全化成指骨。老翁的脸从中间裂开，三张假面在半空叠成一张。“孙行者，你总算把戏看全了。”"
        },
        strike: {
          speaker: "白骨夫人",
          role: "尸魔",
          seal: "骨",
          sealClass: "seal-bone",
          text: "一棒落下，老翁只剩假尸。岭后却传来女人的笑声：“好个孙行者，三回都打不破他们的疑心。”"
        },
        protect: {
          speaker: "白骨夫人",
          role: "尸魔",
          seal: "骨",
          sealClass: "seal-bone",
          text: "悟空护着唐僧后退。老翁不追，只抬手一招，山道上的雾全涌了过来。“孙悟空，你护得住他一时，护得住他一世么？”"
        }
      }
    }
  };

  const INTERLUDES = {
    bajie: {
      speaker: "猪八戒",
      role: "二徒弟",
      seal: "戒",
      sealClass: "seal-pig",
      text: "“师父，猴哥这是杀红了眼。若再这样，取经路上还不知要死多少人。”八戒把钉耙往地上一杵，眼角却瞟着悟空。",
      choices: [
        {
          id: "cover",
          key: "1",
          title: "替八戒圆一句",
          sub: "息事宁人，留他一份脸面",
          className: "",
          reply: {
            speaker: "悟空",
            role: "大徒弟",
            seal: "悟",
            sealClass: "",
            text: "“师父，莫全怪八戒。他不过饿昏了头。”八戒愣了愣，低下头去。唐僧看着悟空，眼里仍有一层疑云，却没有再念咒。"
          }
        },
        {
          id: "expose",
          key: "2",
          title: "当众点破他馋言",
          sub: "让师父看见八戒的私心",
          className: "danger",
          reply: {
            speaker: "悟空",
            role: "大徒弟",
            seal: "悟",
            sealClass: "",
            text: "“八戒，你只顾那篮饭，可看见她袖里露出的骨头？若真出了事，你担得起？”八戒涨红了脸，唐僧的目光终于从他身上移开。"
          }
        }
      ]
    },
    gods: {
      speaker: "悟空",
      role: "大徒弟",
      seal: "悟",
      sealClass: "",
      text: "悟空把金箍棒往地上一顿。山腹里传来闷响，像有谁在土里翻了个身。“本地山神，替我记下这三遭。是妖是人，总要有个见证。”",
      choices: [
        {
          id: "summon",
          key: "1",
          title: "请山神暗中记证",
          sub: "留下第三方证言，也会惊动妖气",
          className: "safe",
          reply: {
            speaker: "山神",
            role: "白虎岭土地",
            seal: "山",
            sealClass: "seal-sand",
            text: "一缕土黄烟气从石缝里升起。“大圣，小神记下了。三回化形，俱是白骨夫人。”声音很快又沉回山腹。"
          }
        },
        {
          id: "quiet",
          key: "2",
          title: "不惊动山神",
          sub: "少一分声势，白骨也少一分警觉",
          className: "",
          reply: {
            speaker: "悟空",
            role: "大徒弟",
            seal: "悟",
            sealClass: "",
            text: "悟空收了棒。“你若真在，便看着。”山腹里的闷响停了。岭上的雾却比方才更浓。"
          }
        }
      ]
    }
  };

  const ENDING_COPY = {
    good: {
      kicker: "白虎岭 · 三证俱全",
      title: "火眼同心",
      seal: "同",
      paragraphs: [
        "三枚骨环碎尽时，白虎岭的雾终于散了。白骨夫人在金箍棒下化成一片白灰，山道上只剩三张裂开的假面。",
        "唐僧站在原地，久久没有出声。他弯腰拾起一片骨珠，手指微微发抖。“悟空……是为师看错了。”",
        "悟空把棒扛回肩上，没有立刻回头。“师父，路还长。看错一回，不算什么。下回老孙还替你看。”",
        "八戒在一旁讪讪地摸了摸鼻子。沙僧挑起了担子。四个人重新往西走，山后的日头正一寸寸升起来。"
      ],
      quote: "火眼照见的，不只是妖，也是人心里的那一点不肯相信。"
    },
    bittersweet: {
      kicker: "白虎岭 · 真身已灭",
      title: "圣僧低眉",
      seal: "行",
      paragraphs: [
        "白骨夫人散作白灰。唐僧看着地上的三张假面，嘴唇动了动，终究没有说出那句“为师错了”。",
        "他重新背起行囊，只道：“上路吧。”悟空应了一声，把金箍棒扛回肩上。两人之间隔着半步路，谁也没有再提方才的事。",
        "雾散之后，白虎岭仍是白虎岭。取经的队伍继续往西，裂痕却留在了每一次回头里。"
      ],
      quote: "有些真相能打碎妖怪，却未必能立刻补回信任。"
    },
    canonical: {
      kicker: "白虎岭 · 原著余韵",
      title: "恨逐余音",
      seal: "逐",
      paragraphs: [
        "妖怪现了白骨，唐僧却仍从行囊里取出纸笔。笔尖在纸上停了很久，最后还是落下。",
        "“你一连打死三人，虽今日见是妖怪，往日里谁又说得清？为师留你不得。”贬书递到悟空面前，山风把纸角吹得发响。",
        "悟空接过贬书，没有争辩。他向唐僧拜了一拜，又嘱咐沙僧看好师父，转身走向岭下。白骨已灭，师徒名分却断在这一纸文书上。"
      ],
      quote: "“你且去罢。”——唐僧的声音很轻，山风却听得清清楚楚。"
    },
    expelled: {
      kicker: "白虎岭 · 原著结局",
      title: "一纸贬书",
      seal: "贬",
      paragraphs: [
        "唐僧取出纸笔，写下贬书。“你一连打死三人，我留你不得。从今往后，你不再是我徒弟。”",
        "悟空接过贬书，没有再挥棒。他看了唐僧很久，最后只向沙僧道：“看好师父。前面有难，记得报我的名。”",
        "他转身走向岭下，红披风很快被雾吞没。唐僧站在原地，手中的贬书被风吹得猎猎作响。"
      ],
      quote: "“师父，老孙走了。”"
    },
    bad_master: {
      kicker: "白骨岭 · 护法失守",
      title: "空匣",
      seal: "空",
      paragraphs: [
        "摄魂的风穿过纸伞，唐僧的身子像被抽走了灯芯，缓缓倒在山道上。白骨夫人伸手一引，师父的魂魄便随雾而去。",
        "悟空回身去救，金箍棒却只打碎了一地白骨。岭上安静下来，只剩下那只空空的斋匣，在风里滚了两圈。"
      ],
      quote: "看得见妖，却没能护住人。"
    },
    bad_wukong: {
      kicker: "白骨岭 · 火眼蒙尘",
      title: "火眼蒙尘",
      seal: "败",
      paragraphs: [
        "骨爪穿透了护法的纸影，悟空从半空跌落。金箍棒砸在山石上，发出一声闷响。",
        "白骨夫人俯身看着唐僧，像在看一只已经落入匣中的灯蛾。雾合拢过来，白虎岭再没有一双眼睛能看穿她。"
      ],
      quote: "护法者倒下，真相便再无人看见。"
    }
  };

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.ambient = null;
      this.muted = false;
      this.volume = 0.4;
    }

    configure(settings) {
      this.muted = !!settings.muted;
      this.volume = Number(settings.volume);
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.02);
      }
    }

    ensure() {
      if (this.ctx) {
        if (this.ctx.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
        return this.ctx;
      }
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return null;
      }
      try {
        this.ctx = new AudioContextClass();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : this.volume;
        this.master.connect(this.ctx.destination);
        return this.ctx;
      } catch (error) {
        this.ctx = null;
        return null;
      }
    }

    startAmbient() {
      const ctx = this.ensure();
      if (!ctx || this.ambient) {
        return;
      }
      const ambient = ctx.createGain();
      ambient.gain.value = 0.055;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 540;
      ambient.connect(lowpass);
      lowpass.connect(this.master);

      const oscA = ctx.createOscillator();
      oscA.type = "sine";
      oscA.frequency.value = 55;
      const gainA = ctx.createGain();
      gainA.gain.value = 0.25;
      oscA.connect(gainA);
      gainA.connect(ambient);
      oscA.start();

      const oscB = ctx.createOscillator();
      oscB.type = "triangle";
      oscB.frequency.value = 82.5;
      const gainB = ctx.createGain();
      gainB.gain.value = 0.08;
      oscB.connect(gainB);
      gainB.connect(ambient);
      oscB.start();

      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
      const channel = noiseBuffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < channel.length; i += 1) {
        const white = Math.random() * 2 - 1;
        last = last * 0.985 + white * 0.015;
        channel[i] = last;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 420;
      noiseFilter.Q.value = 0.55;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.32;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ambient);
      noise.start();

      this.ambient = { ambient, oscA, oscB, noise };
    }

    stopAmbient() {
      if (!this.ambient) {
        return;
      }
      try {
        this.ambient.oscA.stop();
        this.ambient.oscB.stop();
        this.ambient.noise.stop();
      } catch (error) {
        // already stopped
      }
      this.ambient = null;
    }

    tone(frequency, duration, type, gainValue, delay = 0) {
      const ctx = this.ensure();
      if (!ctx) {
        return;
      }
      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainValue || 0.05), start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(start);
      osc.stop(start + duration + 0.03);
    }

    noise(duration, gainValue, filterFrequency) {
      const ctx = this.ensure();
      if (!ctx) {
        return;
      }
      const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = filterFrequency || 900;
      filter.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.value = gainValue || 0.05;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      source.start();
    }

    sfx(name) {
      if (this.muted) {
        return;
      }
      switch (name) {
        case "vision":
          this.noise(0.28, 0.07, 1600);
          this.tone(196, 0.34, "sine", 0.035);
          break;
        case "clue":
          this.tone(660, 0.12, "sine", 0.045);
          this.tone(990, 0.16, "sine", 0.025, 0.045);
          break;
        case "trust-up":
          this.tone(523.25, 0.22, "sine", 0.035);
          this.tone(783.99, 0.34, "sine", 0.03, 0.08);
          break;
        case "trust-down":
          this.tone(174.61, 0.36, "triangle", 0.045);
          this.tone(116.54, 0.46, "sine", 0.04, 0.07);
          break;
        case "strike":
          this.noise(0.22, 0.12, 480);
          this.tone(82.41, 0.32, "sine", 0.075);
          break;
        case "hurt":
          this.tone(130.81, 0.22, "sawtooth", 0.018);
          break;
        case "guard":
          this.noise(0.24, 0.055, 1200);
          this.tone(392, 0.26, "sine", 0.03);
          break;
        case "break":
          this.noise(0.38, 0.12, 2400);
          this.tone(98, 0.4, "triangle", 0.06);
          break;
        case "win":
          [392, 523.25, 659.25, 783.99].forEach((freq, index) => this.tone(freq, 0.8, "sine", 0.032, index * 0.13));
          break;
        case "lose":
          [196, 174.61, 146.83, 116.54].forEach((freq, index) => this.tone(freq, 0.9, "sine", 0.035, index * 0.12));
          break;
        case "click":
          this.tone(440, 0.05, "sine", 0.018);
          break;
        default:
          break;
      }
    }
  }

  let state = null;
  let settings = loadSettings();
  let audio = new SoundEngine();
  let busy = false;
  let currentActions = [];
  let toastTimer = null;
  let modal = null;
  let previousFocus = null;

  function defaultSettings() {
    return { volume: 0.4, muted: false, reduced: false };
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) {
        return defaultSettings();
      }
      const parsed = JSON.parse(raw);
      return {
        volume: Number.isFinite(Number(parsed.volume)) ? R.clamp(Number(parsed.volume), 0, 1) : 0.4,
        muted: !!parsed.muted,
        reduced: !!parsed.reduced
      };
    } catch (error) {
      return defaultSettings();
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      // storage may be unavailable
    }
  }

  function applySettings() {
    els.app.classList.toggle("is-reduced", settings.reduced);
    els.soundBtn.textContent = settings.muted ? "静" : "音";
    els.soundBtn.setAttribute("aria-label", settings.muted ? "打开声音" : "静音");
    audio.configure(settings);
  }

  function freshState() {
    const fresh = R.initialState();
    fresh.screen = "title";
    fresh.view = {
      screen: "title",
      vision: false,
      prologueStep: 0,
      resultKind: null,
      interludeNode: null,
      interludeResolved: false,
      interludeChoice: null
    };
    return fresh;
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1 || !parsed.state || !parsed.state.view) {
        return null;
      }
      const candidate = parsed.state;
      if (!["prologue", "explore", "result", "interlude", "bossIntro", "boss"].includes(candidate.view.screen)) {
        return null;
      }
      if (candidate.view.screen === "boss" && !candidate.boss) {
        return null;
      }
      return candidate;
    } catch (error) {
      return null;
    }
  }

  function saveGame() {
    if (!state || !state.view || ["title", "ending"].includes(state.view.screen)) {
      return;
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state }));
    } catch (error) {
      // ignore storage failures
    }
  }

  function clearSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (error) {
      // ignore
    }
  }

  function showToast(message, duration = 2200) {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, duration);
  }

  function setScreenClass(screen) {
    els.titleScreen.classList.toggle("is-hidden", screen !== "title");
    els.gameScreen.classList.toggle("is-hidden", screen === "title" || screen === "ending");
    els.endingScreen.classList.toggle("is-hidden", screen !== "ending");
    els.app.dataset.screen = screen;
  }

  function setDialogue(entry) {
    els.speakerSeal.className = "speaker-seal " + (entry.sealClass || "");
    els.speakerSeal.textContent = entry.seal || "叙";
    els.speakerName.textContent = entry.speaker || "山野";
    els.speakerRole.textContent = entry.role || "";
    els.dialogueText.textContent = entry.text || "";
    els.dialogueText.classList.remove("is-updating");
    void els.dialogueText.offsetWidth;
    els.dialogueText.classList.add("is-updating");
  }

  function updateHud() {
    if (!state) {
      return;
    }
    const trial = R.currentTrial(state);
    const content = TRIAL_CONTENT[trial.id];
    if (state.view.screen === "boss" || state.view.screen === "bossIntro") {
      els.chapterEyebrow.textContent = "白虎岭 · 白骨洞前";
      els.chapterTitle.textContent = "终局 · 白骨真身";
      els.stagePlace.textContent = "白虎岭 · 洞门前";
    } else if (state.view.screen === "prologue") {
      els.chapterEyebrow.textContent = "白虎岭 · 山道";
      els.chapterTitle.textContent = "序 · 云头回望";
      els.stagePlace.textContent = "白虎岭 · 山道";
    } else {
      els.chapterEyebrow.textContent = content.place;
      els.chapterTitle.textContent = trial.title;
      els.stagePlace.textContent = content.place;
    }
    els.trustText.textContent = state.trust + "/5";
    els.trustPips.innerHTML = "";
    for (let i = 0; i < 5; i += 1) {
      const pip = document.createElement("i");
      if (i < state.trust) {
        pip.classList.add("is-on");
      }
      els.trustPips.appendChild(pip);
    }
    const currentClues = state.foundByTrial[state.trial] ? state.foundByTrial[state.trial].length : 0;
    els.clueText.textContent = currentClues + "/3";
    els.evidenceText.textContent = state.evidence.length + "/3";
    const insight = state.boss ? state.boss.insight : 3;
    els.insightText.textContent = String(insight);
    els.visionStatus.textContent =
      state.view.screen === "boss" || state.view.screen === "bossIntro"
        ? "三面归一"
        : state.view.vision
          ? "法眼已开"
          : "法眼未开";
    els.app.dataset.vision = state.view.vision ? "on" : "off";
  }

  function updateEvidenceChips() {
    els.evidenceChips.innerHTML = "";
    if (!state.evidence.length) {
      const empty = document.createElement("span");
      empty.className = "evidence-chip is-empty";
      empty.textContent = "尚无证物";
      els.evidenceChips.appendChild(empty);
      return;
    }
    state.evidence.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "evidence-chip";
      const glyph = document.createElement("b");
      glyph.textContent = item.glyph;
      const label = document.createElement("span");
      label.textContent = item.name;
      chip.append(glyph, label);
      els.evidenceChips.appendChild(chip);
    });
  }

  function setStageScene(scene) {
    els.stage.dataset.scene = scene;
  }

  function clearHotspots() {
    els.hotspotLayer.innerHTML = "";
  }

  function renderHotspots() {
    clearHotspots();
    if (!state || state.view.screen !== "explore") {
      return;
    }
    const trial = R.currentTrial(state);
    const content = TRIAL_CONTENT[trial.id];
    const found = state.foundByTrial[state.trial] || [];
    Object.entries(content.hotspots).forEach(([id, spot]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "hotspot" + (found.includes(id) ? " is-found" : "");
      button.dataset.clue = id;
      button.dataset.label = spot.label;
      button.style.left = spot.x + "%";
      button.style.top = spot.y + "%";
      button.textContent = found.includes(id) ? "✓" : "?";
      button.setAttribute("aria-label", found.includes(id) ? "已查：" + spot.label : "可查：" + spot.label);
      button.disabled = found.includes(id);
      button.addEventListener("click", () => handleHotspot(id, button));
      els.hotspotLayer.appendChild(button);
    });
  }

  function actionButton(options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-btn " + (options.className || "");
    button.dataset.action = options.action || "";
    if (options.disabled) {
      button.disabled = true;
    }
    if (options.key) {
      const key = document.createElement("span");
      key.className = "key";
      key.textContent = options.key;
      button.appendChild(key);
    }
    const copy = document.createElement("span");
    copy.className = "action-copy";
    const title = document.createElement("span");
    title.className = "action-title";
    title.textContent = options.title;
    copy.appendChild(title);
    if (options.sub) {
      const sub = document.createElement("span");
      sub.className = "action-sub";
      sub.textContent = options.sub;
      copy.appendChild(sub);
    }
    button.appendChild(copy);
    if (options.onClick) {
      button.addEventListener("click", options.onClick);
    }
    if (options.key && !options.disabled && options.onClick) {
      currentActions.push({ key: String(options.key).toLowerCase(), button, onClick: options.onClick });
    }
    return button;
  }

  function renderHint(text) {
    const hint = document.createElement("p");
    hint.className = "action-hint";
    hint.innerHTML = text;
    return hint;
  }

  function resetActions() {
    currentActions = [];
    els.actionArea.innerHTML = "";
  }

  function renderPrologue() {
    setScreenClass("game");
    state.view.screen = "prologue";
    state.screen = "prologue";
    state.view.vision = false;
    setStageScene("village");
    clearHotspots();
    els.battleBars.classList.add("is-hidden");
    els.bossIntent.classList.add("is-hidden");
    els.stageCaption.textContent = "云头回望 · 白虎岭";
    updateHud();
    updateEvidenceChips();
    setDialogue(PROLOGUE[Math.min(state.view.prologueStep, PROLOGUE.length - 1)]);
    resetActions();
    const last = state.view.prologueStep >= PROLOGUE.length - 1;
    els.actionArea.appendChild(
      actionButton({
        key: "1",
        title: last ? "落回山道" : "按下云头",
        sub: last ? "去见那个提篮的女子" : "再看一眼师父",
        className: "primary continue-btn",
        action: "prologue-next",
        onClick: () => {
          audio.sfx("click");
          if (state.view.prologueStep < PROLOGUE.length - 1) {
            state.view.prologueStep += 1;
            saveGame();
            renderPrologue();
          } else {
            startExplore();
          }
        }
      })
    );
  }

  function startExplore() {
    state.view.screen = "explore";
    state.screen = "explore";
    state.view.vision = false;
    state.view.prologueStep = 0;
    state.view.interludeResolved = false;
    state.view.interludeChoice = null;
    const trial = R.currentTrial(state);
    const content = TRIAL_CONTENT[trial.id];
    setScreenClass("game");
    setStageScene(trial.scene);
    els.battleBars.classList.add("is-hidden");
    els.bossIntent.classList.add("is-hidden");
    els.stageCaption.textContent = trial.number === 1 ? "山道 · 妖气初现" : trial.number === 2 ? "山坳 · 哭声引路" : "洞门 · 三面归一";
    updateHud();
    updateEvidenceChips();
    setDialogue(content.intro);
    renderHotspots();
    renderExploreActions();
    saveGame();
    audio.startAmbient();
    audio.sfx("vision");
    showToast("先开法眼，查可疑处。", 2600);
  }

  function resumeExplore() {
    state.view.screen = "explore";
    setScreenClass("game");
    const trial = R.currentTrial(state);
    const content = TRIAL_CONTENT[trial.id];
    setStageScene(trial.scene);
    els.battleBars.classList.add("is-hidden");
    els.bossIntent.classList.add("is-hidden");
    updateHud();
    updateEvidenceChips();
    setDialogue(content.resume);
    renderHotspots();
    renderExploreActions();
    audio.startAmbient();
  }

  function renderExploreActions() {
    resetActions();
    els.actionArea.innerHTML = "";
    const trial = R.currentTrial(state);
    const content = TRIAL_CONTENT[trial.id];
    const count = state.foundByTrial[state.trial].length;
    const vision = state.view.vision;

    els.actionArea.appendChild(
      actionButton({
        key: "F",
        title: vision ? "收法眼" : "开法眼",
        sub: vision ? "回到寻常目光" : "看见妖气与破绽",
        className: vision ? "" : "primary",
        action: "vision",
        onClick: () => toggleVision()
      })
    );

    els.actionArea.appendChild(
      actionButton({
        key: "2",
        title: "以证喝破",
        sub: count < 2 ? "还差 " + (2 - count) + " 处破绽" : count === 3 ? "三证俱全，可碎一重骨障" : "两证可喝破，骨障仍存",
        className: "primary",
        action: "reveal",
        disabled: count < 2,
        onClick: () => handleDisposition("reveal")
      })
    );

    els.actionArea.appendChild(
      actionButton({
        key: "3",
        title: "举棒便打",
        sub: "护师心切，但师父会更疑你",
        className: "danger",
        action: "strike",
        onClick: () => handleDisposition("strike")
      })
    );

    els.actionArea.appendChild(
      actionButton({
        key: "4",
        title: "护师退让",
        sub: "先保师父，妖怪会更强",
        className: "safe",
        action: "protect",
        onClick: () => handleDisposition("protect")
      })
    );

    const hintText = vision
      ? count >= 3
        ? "三处破绽都已查清。<strong>以证喝破</strong>会让对应骨障先碎。"
        : count >= 2
          ? "已有 " + count + " 处破绽。还可再查 " + (3 - count) + " 处，凑齐三证可先碎骨障。"
          : "点画面上的朱砂热点查验。查满两处，才可当众喝破。"
      : "法眼未开。画面里只有模糊的墨圈，开法眼后才会显出破绽。";
    els.actionArea.appendChild(renderHint(hintText));
  }

  function toggleVision(force) {
    if (!state || state.view.screen !== "explore") {
      return;
    }
    state.view.vision = typeof force === "boolean" ? force : !state.view.vision;
    updateHud();
    if (state.view.vision) {
      audio.sfx("vision");
      setDialogue({
        speaker: "悟空",
        role: "大徒弟",
        seal: "悟",
        sealClass: "",
        text: "法眼一开，山色像被水洗过。三处可疑处浮出朱砂色的边。"
      });
      showToast("法眼已开：点朱砂热点查验。", 1800);
    } else {
      audio.sfx("click");
      showToast("法眼已收。", 1200);
    }
    renderExploreActions();
    saveGame();
  }

  function handleHotspot(id, button) {
    if (busy || !state || state.view.screen !== "explore") {
      return;
    }
    const trial = R.currentTrial(state);
    const content = TRIAL_CONTENT[trial.id];
    const spot = content.hotspots[id];
    if (!spot) {
      return;
    }
    if (!state.view.vision) {
      showToast("雾里只看见轮廓。先开法眼。", 1800);
      audio.sfx("click");
      return;
    }
    const found = state.foundByTrial[state.trial];
    if (found.includes(id)) {
      return;
    }
    found.push(id);
    state.stats.clues += 1;
    setDialogue({
      speaker: "悟空",
      role: "大徒弟",
      seal: "悟",
      sealClass: "",
      text: spot.text + "（破绽：" + spot.clue + "）"
    });
    audio.sfx("clue");
    floatText(button.style.left, button.style.top, "破绽 +1", false);
    renderHotspots();
    updateHud();
    renderExploreActions();
    updateEvidenceChips();
    saveGame();
    if (found.length === 2) {
      showToast("已有两处破绽，可以当众喝破了。", 2200);
    } else if (found.length === 3) {
      showToast("三证俱全：以证喝破可先碎“" + trial.maskName + "”骨障。", 3000);
      audio.sfx("trust-up");
    }
  }

  function handleDisposition(kind) {
    if (busy || !state || state.view.screen !== "explore") {
      return;
    }
    const count = state.foundByTrial[state.trial].length;
    if (kind === "reveal" && count < 2) {
      showToast("至少两处破绽，才能当众喝破。", 1800);
      return;
    }
    try {
      state = R.applyDisposition(state, kind);
    } catch (error) {
      showToast(error.message, 1800);
      return;
    }
    state.view.screen = "result";
    state.view.resultKind = kind;
    state.view.vision = false;
    state.screen = "result";
    renderResult();
    if (kind === "reveal") {
      audio.sfx(state.lastResult.maskBroken ? "break" : "trust-up");
    } else if (kind === "strike") {
      audio.sfx("strike");
      audio.sfx("trust-down");
    } else {
      audio.sfx("guard");
      audio.sfx("trust-up");
    }
    saveGame();
  }

  function renderResult() {
    setScreenClass("game");
    const trial = R.currentTrial(state);
    const content = TRIAL_CONTENT[trial.id];
    const kind = state.view.resultKind || (state.dispositions[state.dispositions.length - 1] || {}).kind || "reveal";
    const result = state.lastResult || {};
    const selected = content.selected[kind];
    setStageScene(trial.scene);
    clearHotspots();
    els.battleBars.classList.add("is-hidden");
    els.bossIntent.classList.add("is-hidden");
    els.stageCaption.textContent = kind === "strike" ? "假尸落地" : kind === "reveal" ? "真相当众" : "妖风暂退";
    updateHud();
    updateEvidenceChips();
    setDialogue(selected);
    resetActions();

    const trustDelta = result.trustDelta || 0;
    const trustText = trustDelta > 0 ? "心印 +" + trustDelta : trustDelta < 0 ? "心印 " + trustDelta : "心印不变";
    const maskText = result.maskBroken ? "“" + trial.maskName + "”骨障已碎" : "“" + trial.maskName + "”骨障仍存";
    const evidenceText = result.evidenceGained ? "得证物「" + trial.evidenceName + "」" : "证据不足，未得证物";
    els.actionArea.appendChild(
      actionButton({
        key: "1",
        title: "继续",
        sub: trustText + " · " + maskText + " · " + evidenceText,
        className: "primary continue-btn",
        action: "result-next",
        onClick: () => continueAfterResult()
      })
    );
    const note = document.createElement("p");
    note.className = "action-note";
    note.textContent =
      kind === "strike"
        ? "真身已被棒风削去一截气血，但师父的疑心更重了。"
        : kind === "protect"
          ? "师父暂安，白骨夫人却借退让之势养厚了真身。"
          : result.maskBroken
            ? "三证俱全，白骨夫人的这一层假面在真身战前就已裂开。"
            : "两证足可喝破，却还不足以碎去骨障。";
    els.actionArea.appendChild(note);
  }

  function continueAfterResult() {
    audio.sfx("click");
    if (state.trial === 0) {
      startInterlude("bajie");
    } else if (state.trial === 1) {
      startInterlude("gods");
    } else {
      proceedAfterTrialThree();
    }
  }

  function startInterlude(node) {
    state.view.screen = "interlude";
    state.view.interludeNode = node;
    state.view.interludeResolved = false;
    state.view.interludeChoice = null;
    state.screen = "interlude";
    renderInterlude();
    saveGame();
  }

  function renderInterlude() {
    setScreenClass("game");
    const node = state.view.interludeNode || "bajie";
    const data = INTERLUDES[node];
    const trial = R.currentTrial(state);
    setStageScene(node === "bajie" ? "village" : "mother");
    clearHotspots();
    els.battleBars.classList.add("is-hidden");
    els.bossIntent.classList.add("is-hidden");
    els.stageCaption.textContent = node === "bajie" ? "师徒之间的第一道缝" : "山腹里的见证";
    updateHud();
    updateEvidenceChips();
    resetActions();

    if (!state.view.interludeResolved) {
      setDialogue(data);
      data.choices.forEach((choice) => {
        els.actionArea.appendChild(
          actionButton({
            key: choice.key,
            title: choice.title,
            sub: choice.sub,
            className: choice.className,
            action: "interlude-" + choice.id,
            onClick: () => resolveInterlude(choice.id)
          })
        );
      });
      els.actionArea.appendChild(renderHint("这一步会改变终局里谁来帮你，也会改变师父看你的目光。"));
    } else {
      const choice = data.choices.find((item) => item.id === state.view.interludeChoice) || data.choices[0];
      setDialogue(choice.reply);
      els.actionArea.appendChild(
        actionButton({
          key: "1",
          title: node === "bajie" ? "再往前行" : "上岭",
          sub: node === "bajie" ? "白骨岭第二试" : "白骨岭第三试",
          className: "primary continue-btn",
          action: "interlude-next",
          onClick: () => advanceAfterInterlude()
        })
      );
    }
  }

  function resolveInterlude(choiceId) {
    if (busy) {
      return;
    }
    const node = state.view.interludeNode || "bajie";
    const previousTrust = state.trust;
    if (node === "bajie") {
      state = R.applyInterlude(state, "bajie", choiceId);
    } else {
      state = R.applyInterlude(state, "gods", choiceId);
    }
    state.view.interludeResolved = true;
    state.view.interludeChoice = choiceId;
    updateHud();
    audio.sfx(state.trust > previousTrust ? "trust-up" : state.trust < previousTrust ? "trust-down" : "click");
    renderInterlude();
    saveGame();
  }

  function advanceAfterInterlude() {
    const node = state.view.interludeNode;
    audio.sfx("click");
    if (state.trial < 2) {
      state = R.advanceTrial(state);
      state.view.interludeResolved = false;
      state.view.interludeChoice = null;
      if (node === "gods" && !state.godWitness) {
        showToast("岭上雾更浓了。白骨夫人少了一分警觉。", 2000);
      } else if (node === "gods" && state.godWitness) {
        showToast("山腹里留了一道土黄的金线。", 2000);
      }
      startExplore();
    } else {
      proceedAfterTrialThree();
    }
  }

  function proceedAfterTrialThree() {
    if (state.trust <= 1) {
      state = R.startBoss(state);
      renderEnding();
      return;
    }
    state.view.screen = "bossIntro";
    state.screen = "bossIntro";
    renderBossIntro();
    saveGame();
  }

  function renderBossIntro() {
    setScreenClass("game");
    setStageScene("boss");
    clearHotspots();
    els.battleBars.classList.add("is-hidden");
    els.bossIntent.classList.add("is-hidden");
    els.stageCaption.textContent = "三面归一 · 白骨真身";
    updateHud();
    updateEvidenceChips();
    const friends = [];
    if (state.bajieAllied) {
      friends.push("八戒握紧了钉耙");
    } else {
      friends.push("八戒别开了脸");
    }
    if (state.godWitness) {
      friends.push("云里垂下一线土黄的金光");
    }
    setDialogue({
      speaker: "白骨夫人",
      role: "尸魔",
      seal: "骨",
      sealClass: "seal-bone",
      text:
        "“孙悟空，你打得破皮囊，打得破他们的疑心么？”三张假面在半空叠成一张，白骨真身从雾里升起。" +
        friends.join("，") +
        "。唐僧闭目合掌，没有再念咒，也没有后退。"
    });
    resetActions();
    els.actionArea.appendChild(
      actionButton({
        key: "1",
        title: "迎战真身",
        sub: state.trust >= 4 ? "师父心印尚稳" : state.trust === 2 ? "师父仍在疑你" : "背水一战",
        className: "primary continue-btn",
        action: "boss-start",
        onClick: () => {
          audio.sfx("strike");
          state = R.startBoss(state);
          if (state.screen === "ending") {
            renderEnding();
          } else {
            state.view.screen = "boss";
            renderBoss();
            saveGame();
          }
        }
      })
    );
    els.actionArea.appendChild(renderHint("骨障、证物与队伍援手都已按前情落定。"));
  }

  function renderBoss() {
    if (!state.boss) {
      renderBossIntro();
      return;
    }
    setScreenClass("game");
    setStageScene("boss");
    clearHotspots();
    els.battleBars.classList.remove("is-hidden");
    els.bossIntent.classList.remove("is-hidden");
    els.stageCaption.textContent = "终局 · 白骨真身";
    updateHud();
    updateEvidenceChips();
    updateBattleBars();
    const boss = state.boss;
    els.bossIntentText.textContent = boss.intent.name + " · " + boss.intent.hint;
    if (boss.log && boss.log.length) {
      setDialogue({
        speaker: "战报",
        role: "真身战",
        seal: "战",
        sealClass: "seal-narrator",
        text: boss.log.join(" ")
      });
    } else {
      setDialogue({
        speaker: "悟空",
        role: "大徒弟",
        seal: "悟",
        sealClass: "",
        text: "白骨真身有三重骨障。看准她的意图，护住师父，再一重一重打碎。"
      });
    }
    renderBossActions();
  }

  function updateBattleBars() {
    const boss = state.boss;
    if (!boss) {
      return;
    }
    const playerPercent = R.clamp((boss.playerHp / boss.playerMaxHp) * 100, 0, 100);
    const masterPercent = R.clamp((boss.masterHp / boss.masterMaxHp) * 100, 0, 100);
    const bossPercent = R.clamp((boss.hp / boss.maxHp) * 100, 0, 100);
    els.playerHpFill.style.width = playerPercent + "%";
    els.masterHpFill.style.width = masterPercent + "%";
    els.bossHpFill.style.width = bossPercent + "%";
    els.playerHpText.textContent = boss.playerHp + "/" + boss.playerMaxHp;
    els.masterHpText.textContent = boss.masterHp + "/" + boss.masterMaxHp;
    els.bossHpText.textContent = boss.hp + "/" + boss.maxHp;
    $$("span[data-mask]", els.boneRings).forEach((ring) => {
      ring.classList.toggle("is-broken", !!boss.masks[ring.dataset.mask]);
    });
  }

  function renderBossActions() {
    resetActions();
    els.actionArea.innerHTML = "";
    const boss = state.boss;
    if (!boss) {
      return;
    }
    const threeReady = R.canUseThree(boss);
    const intent = boss.intent;
    const hurtMasterSoon = intent && intent.master > 0;

    els.actionArea.appendChild(
      actionButton({
        key: "1",
        title: "棒击",
        sub: "20 伤 · 骨障先挡 16",
        action: "strike",
        onClick: () => handleBossAction("strike")
      })
    );
    els.actionArea.appendChild(
      actionButton({
        key: "2",
        title: "分身护法",
        sub: "护盾 12 · 反击 8 · 余 " + boss.clonesLeft,
        action: "clone",
        disabled: boss.clonesLeft <= 0,
        onClick: () => handleBossAction("clone")
      })
    );
    els.actionArea.appendChild(
      actionButton({
        key: "3",
        title: "定身",
        sub: "跳过下一手 · 法眼余 " + boss.insight,
        action: "bind",
        disabled: boss.insight <= 0,
        onClick: () => handleBossAction("bind")
      })
    );
    els.actionArea.appendChild(
      actionButton({
        key: "4",
        title: "护师",
        sub: hurtMasterSoon ? "化解摄魂 · 唐僧回复 4" : "备下纸伞 · 唐僧回复 4",
        className: hurtMasterSoon ? "primary safe" : "safe",
        action: "guard",
        onClick: () => handleBossAction("guard")
      })
    );
    if (threeReady) {
      els.actionArea.appendChild(
        actionButton({
          key: "5",
          title: "三打",
          sub: "三证齐亮 · 终结真身",
          className: "primary",
          action: "three",
          onClick: () => handleBossAction("three")
        })
      );
    }

    const unusedEvidence = state.evidence.filter((item) => !boss.evidenceUsed.includes(item.id));
    if (unusedEvidence.length) {
      const evidenceRow = document.createElement("div");
      evidenceRow.className = "action-area";
      evidenceRow.style.flex = "0 0 100%";
      evidenceRow.style.minHeight = "0";
      evidenceRow.style.paddingTop = "0";
      unusedEvidence.forEach((item, index) => {
        const maskBroken = boss.masks[item.mask];
        evidenceRow.appendChild(
          actionButton({
            key: String(6 + index),
            title: "显证 · " + item.name,
            sub: maskBroken ? "旧证再照 · 14 伤" : "击碎骨障 · 8 伤",
            className: "safe",
            action: "evidence",
            onClick: () => handleBossAction("evidence", item.id)
          })
        );
      });
      els.actionArea.appendChild(evidenceRow);
    }

    const hintText = threeReady
      ? "三枚骨障已碎，白骨气血见底。<strong>三打</strong>可以终结这一战。"
      : "白骨夫人的下一手已经写明。先看意图，再决定破障、护师还是定身。";
    els.actionArea.appendChild(renderHint(hintText));
  }

  function handleBossAction(action, target) {
    if (busy || !state || state.view.screen !== "boss" || !state.boss) {
      return;
    }
    const before = {
      hp: state.boss.hp,
      playerHp: state.boss.playerHp,
      masterHp: state.boss.masterHp,
      masks: Object.assign({}, state.boss.masks)
    };
    busy = true;
    try {
      state = R.playerAction(state, action, target);
    } catch (error) {
      busy = false;
      showToast(error.message, 1800);
      return;
    }
    updateHud();
    updateBattleBars();
    const after = state.boss;
    const bossDamage = Math.max(0, before.hp - after.hp);
    const playerDamage = Math.max(0, before.playerHp - after.playerHp);
    const masterDamage = Math.max(0, before.masterHp - after.masterHp);
    if (bossDamage > 0) {
      floatText("69%", "49%", "-" + bossDamage, false);
    }
    if (playerDamage > 0) {
      floatText("23%", "53%", "-" + playerDamage, true);
    }
    if (masterDamage > 0) {
      floatText("43%", "64%", "-" + masterDamage, true);
    }
    const brokeMask = R.MASK_ORDER.some((mask) => !before.masks[mask] && after.masks[mask]);
    if (brokeMask) {
      audio.sfx("break");
      shakeStage();
    } else if (action === "strike" || action === "three") {
      audio.sfx("strike");
    } else if (action === "guard") {
      audio.sfx("guard");
    } else if (action === "evidence") {
      audio.sfx("clue");
    } else if (action === "bind") {
      audio.sfx("vision");
    } else if (action === "clone") {
      audio.sfx("guard");
    }
    if (playerDamage > 0 || masterDamage > 0) {
      audio.sfx("hurt");
    }

    if (state.screen === "ending") {
      window.setTimeout(() => {
        busy = false;
        renderEnding();
      }, 680);
      return;
    }

    setDialogue({
      speaker: "战报",
      role: "真身战",
      seal: "战",
      sealClass: "seal-narrator",
      text: (after.log || []).join(" ")
    });
    els.bossIntentText.textContent = after.intent.name + " · " + after.intent.hint;
    renderBossActions();
    saveGame();
    window.setTimeout(() => {
      busy = false;
    }, 260);
  }

  function shakeStage() {
    if (settings.reduced) {
      return;
    }
    els.stage.classList.remove("is-shaking");
    void els.stage.offsetWidth;
    els.stage.classList.add("is-shaking");
    window.setTimeout(() => els.stage.classList.remove("is-shaking"), 480);
  }

  function floatText(x, y, text, hurt) {
    const node = document.createElement("span");
    node.className = "float-text" + (hurt ? " hurt" : "");
    node.textContent = text;
    node.style.left = x;
    node.style.top = y;
    els.floatLayer.appendChild(node);
    window.setTimeout(() => node.remove(), 1200);
  }

  function renderEnding() {
    setScreenClass("ending");
    state.view.screen = "ending";
    state.screen = "ending";
    clearSave();
    const endingId = state.ending ? state.ending.id : "bittersweet";
    const copy = ENDING_COPY[endingId] || ENDING_COPY.bittersweet;
    els.app.dataset.ending = endingId;
    els.endingKicker.textContent = copy.kicker;
    els.endingTitle.textContent = copy.title;
    els.endingSeal.textContent = copy.seal;
    els.endingText.innerHTML = "";
    copy.paragraphs.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      els.endingText.appendChild(p);
    });
    els.endingQuote.textContent = copy.quote;
    const summary = R.gameSummary(state);
    const statItems = [
      ["心印", state.trust + "/5"],
      ["破绽", summary.clues + "/9"],
      ["证物", summary.evidence + "/3"],
      ["骨障", state.boss ? R.MASK_ORDER.filter((mask) => state.boss.masks[mask]).length + "/3 已碎" : summary.masksBroken + "/3 已碎"],
      ["八戒", state.bajieAllied ? "援手" : "未援"],
      ["山神", state.godWitness ? "作证" : "未证"]
    ];
    els.endingStats.innerHTML = "";
    statItems.forEach(([label, value]) => {
      const span = document.createElement("span");
      const b = document.createElement("b");
      b.textContent = value;
      span.append(label + " ", b);
      els.endingStats.appendChild(span);
    });
    if (state.boss) {
      const turns = document.createElement("span");
      const b = document.createElement("b");
      b.textContent = state.boss.round + " 回合";
      turns.append("真身战 ", b);
      els.endingStats.appendChild(turns);
    }
    audio.stopAmbient();
    if (["good", "bittersweet", "canonical"].includes(endingId)) {
      audio.sfx("win");
    } else {
      audio.sfx("lose");
    }
  }

  function beginNewRun() {
    clearSave();
    state = freshState();
    state.view.screen = "prologue";
    state.screen = "prologue";
    state.view.prologueStep = 0;
    audio.ensure();
    audio.startAmbient();
    setScreenClass("game");
    renderPrologue();
    saveGame();
    window.scrollTo(0, 0);
  }

  function resumeGame() {
    const saved = loadSave();
    if (!saved) {
      showToast("旧行迹已散，需重新入岭。", 1800);
      els.continueBtn.classList.add("is-hidden");
      return;
    }
    state = saved;
    audio.ensure();
    audio.startAmbient();
    setScreenClass("game");
    switch (state.view.screen) {
      case "prologue":
        renderPrologue();
        break;
      case "explore":
        resumeExplore();
        break;
      case "result":
        renderResult();
        break;
      case "interlude":
        renderInterlude();
        break;
      case "bossIntro":
        renderBossIntro();
        break;
      case "boss":
        renderBoss();
        break;
      default:
        beginNewRun();
        break;
    }
  }

  function goTitle() {
    clearSave();
    state = freshState();
    setScreenClass("title");
    els.continueBtn.classList.add("is-hidden");
    els.battleBars.classList.add("is-hidden");
    els.bossIntent.classList.add("is-hidden");
    clearHotspots();
    audio.stopAmbient();
    closeModal();
    window.scrollTo(0, 0);
  }

  function updateTitleContinue() {
    const has = !!loadSave();
    els.continueBtn.classList.toggle("is-hidden", !has);
  }

  function openModal(content, options = {}) {
    closeModal();
    previousFocus = document.activeElement;
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop && !options.locked) {
        closeModal();
      }
    });
    const card = document.createElement("div");
    card.className = "modal-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.innerHTML = content;
    backdrop.appendChild(card);
    els.modalRoot.appendChild(backdrop);
    modal = backdrop;
    const focusTarget = $("button, input, [tabindex]", card);
    if (focusTarget) {
      window.setTimeout(() => focusTarget.focus(), 30);
    }
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") {
        return;
      }
      const focusables = $$("button, input, [tabindex]", card).filter((node) => !node.disabled);
      if (!focusables.length) {
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    return card;
  }

  function closeModal() {
    if (!modal) {
      return;
    }
    modal.remove();
    modal = null;
    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
    previousFocus = null;
  }

  function openHelp() {
    const card = openModal(
      '<p class="modal-kicker">白骨三戏 · 玩法</p>' +
        "<h2>看得见，还要说得清</h2>" +
        "<ol>" +
        "<li>开法眼后，点画面上的朱砂热点查破绽。每场有三处。</li>" +
        "<li>至少两处破绽才能“以证喝破”。查满三处，真身战前会先碎对应骨障。</li>" +
        "<li>“举棒便打”会削弱真身，却让师父更疑你；“护师退让”会保住心印，却养强妖怪。</li>" +
        "<li>终局看敌方意图行动。摄魂落下前记得“护师”，骨障未碎时可用证物。</li>" +
        "<li>键盘：Enter / Space 推进，数字键选择，F 开关法眼。</li>" +
        "</ol>" +
        '<div class="modal-actions"><button type="button" class="btn btn-primary" data-close>知道了</button></div>'
    );
    $("[data-close]", card).addEventListener("click", closeModal);
  }

  function openMenu() {
    const card = openModal(
      '<p class="modal-kicker">行囊 · 设置</p>' +
        "<h2>且歇一歇</h2>" +
        '<div class="setting-row"><label for="volumeRange">音量</label><input id="volumeRange" type="range" min="0" max="1" step="0.05" value="' +
        settings.volume +
        '"></div>' +
        '<div class="setting-row"><label for="muteCheck">静音</label><input id="muteCheck" type="checkbox" ' +
        (settings.muted ? "checked" : "") +
        "></div>" +
        '<div class="setting-row"><label for="reduceCheck">减弱动效</label><input id="reduceCheck" type="checkbox" ' +
        (settings.reduced ? "checked" : "") +
        "></div>" +
        '<div class="modal-actions">' +
        '<button type="button" class="btn" data-help>玩法</button>' +
        '<button type="button" class="btn" data-save>继续游戏</button>' +
        '<button type="button" class="btn" data-restart>重新入岭</button>' +
        "</div>"
    );
    $("#volumeRange", card).addEventListener("input", (event) => {
      settings.volume = Number(event.target.value);
      settings.muted = settings.volume === 0 ? settings.muted : settings.muted;
      saveSettings();
      applySettings();
    });
    $("#muteCheck", card).addEventListener("change", (event) => {
      settings.muted = event.target.checked;
      saveSettings();
      applySettings();
    });
    $("#reduceCheck", card).addEventListener("change", (event) => {
      settings.reduced = event.target.checked;
      saveSettings();
      applySettings();
    });
    $("[data-help]", card).addEventListener("click", openHelp);
    $("[data-save]", card).addEventListener("click", closeModal);
    $("[data-restart]", card).addEventListener("click", () => {
      closeModal();
      openConfirmRestart();
    });
  }

  function openConfirmRestart() {
    const card = openModal(
      '<p class="modal-kicker">白虎岭 · 重新入岭</p>' +
        "<h2>要舍下这一程么？</h2>" +
        "<p>当前破绽、心印与证物都会散去，从序章重新开始。</p>" +
        '<div class="modal-actions">' +
        '<button type="button" class="btn btn-primary" data-confirm>重新入岭</button>' +
        '<button type="button" class="btn btn-ghost" data-cancel>再想想</button>' +
        "</div>"
    );
    $("[data-confirm]", card).addEventListener("click", () => {
      closeModal();
      beginNewRun();
    });
    $("[data-cancel]", card).addEventListener("click", closeModal);
  }

  function toggleMute() {
    settings.muted = !settings.muted;
    saveSettings();
    applySettings();
    audio.ensure();
    if (!settings.muted) {
      audio.sfx("click");
    }
    showToast(settings.muted ? "已静音。" : "声音已开。", 1200);
  }

  function onKeyDown(event) {
    if (modal) {
      if (event.key === "Escape") {
        closeModal();
      }
      return;
    }
    if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) {
      return;
    }
    if (event.key === "Escape") {
      if (state && state.view && !["title", "ending"].includes(state.view.screen)) {
        openMenu();
      }
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (state && state.view && state.view.screen === "explore" && event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleVision();
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && state && state.view && state.view.screen === "title") {
      event.preventDefault();
      beginNewRun();
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && currentActions.length === 1) {
      event.preventDefault();
      currentActions[0].onClick();
      return;
    }
    const action = currentActions.find((item) => item.key === event.key.toLowerCase());
    if (action) {
      event.preventDefault();
      action.onClick();
    }
  }

  function bindEvents() {
    els.newGameBtn.addEventListener("click", beginNewRun);
    els.continueBtn.addEventListener("click", resumeGame);
    els.helpBtnTitle.addEventListener("click", openHelp);
    els.soundBtn.addEventListener("click", toggleMute);
    els.menuBtn.addEventListener("click", openMenu);
    els.restartBtn.addEventListener("click", goTitle);
    els.endingTitleBtn.addEventListener("click", goTitle);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        audio.stopAmbient();
      } else if (state && state.view && !["title", "ending"].includes(state.view.screen)) {
        audio.startAmbient();
      }
    });
  }

  function exposeDebugApi() {
    window.BGSX = {
      version: 1,
      getSummary() {
        const summary = R.gameSummary(state);
        return Object.assign(summary, {
          screen: state.view ? state.view.screen : state.screen,
          trial: state.trial + 1,
          trust: state.trust,
          vision: state.view ? state.view.vision : false,
          boss: state.boss
            ? {
                hp: state.boss.hp,
                maxHp: state.boss.maxHp,
                playerHp: state.boss.playerHp,
                masterHp: state.boss.masterHp,
                round: state.boss.round,
                masks: Object.assign({}, state.boss.masks),
                outcome: state.boss.outcome
              }
            : null
        });
      },
      getEnding() {
        return state.ending ? state.ending.id : null;
      }
    };
  }

  function boot() {
    state = freshState();
    bindEvents();
    applySettings();
    exposeDebugApi();
    updateTitleContinue();
    setScreenClass("title");
    els.app.dataset.vision = "off";
  }

  boot();
})();

