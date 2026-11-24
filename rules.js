(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BoneRules = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const TRIALS = [
    {
      id: "village",
      number: 1,
      title: "第一试 · 村姑送斋",
      short: "村姑",
      mask: "color",
      maskName: "色相",
      evidenceId: "meal-truth",
      evidenceName: "斋饭真相",
      evidenceGlyph: "饭",
      scene: "village",
      hotspots: ["meal", "shadow", "bajie"]
    },
    {
      id: "mother",
      number: 2,
      title: "第二试 · 老妇寻女",
      short: "老妇",
      mask: "mercy",
      maskName: "慈相",
      evidenceId: "mother-truth",
      evidenceName: "老妇破绽",
      evidenceGlyph: "杖",
      scene: "mother",
      hotspots: ["cane", "tears", "wrist"]
    },
    {
      id: "father",
      number: 3,
      title: "第三试 · 老翁寻妻女",
      short: "老翁",
      mask: "age",
      maskName: "老相",
      evidenceId: "father-truth",
      evidenceName: "老翁破绽",
      evidenceGlyph: "珠",
      scene: "father",
      hotspots: ["beads", "footprint", "name"]
    }
  ];

  const MASK_ORDER = ["color", "mercy", "age"];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function initialState() {
    return {
      version: 1,
      screen: "title",
      trial: 0,
      trust: 3,
      foundByTrial: [[], [], []],
      dispositions: [],
      masks: { color: false, mercy: false, age: false },
      evidence: [],
      bajieAllied: false,
      godWitness: false,
      bossHpMod: 0,
      interlude: [],
      boss: null,
      ending: null,
      lastResult: null,
      stats: { clues: 0, strikes: 0, reveals: 0, guards: 0 }
    };
  }

  function currentTrial(state) {
    return TRIALS[state.trial] || TRIALS[TRIALS.length - 1];
  }

  function maxTrust() {
    return 5;
  }

  function addTrust(state, delta) {
    state.trust = clamp(state.trust + delta, 0, maxTrust());
  }

  function hasEvidence(state, evidenceId) {
    return state.evidence.some((item) => item.id === evidenceId);
  }

  function addEvidence(state, trial, clueCount) {
    if (clueCount < 2 || hasEvidence(state, trial.evidenceId)) {
      return;
    }
    state.evidence.push({
      id: trial.evidenceId,
      mask: trial.mask,
      name: trial.evidenceName,
      glyph: trial.evidenceGlyph,
      trial: trial.id
    });
  }

  function applyDisposition(inputState, kind) {
    if (!["reveal", "strike", "protect"].includes(kind)) {
      throw new Error("未知处置: " + kind);
    }
    const state = clone(inputState);
    const trial = currentTrial(state);
    if (state.dispositions.some((item) => item.trial === trial.id)) {
      throw new Error("本场已经处置，不能重复结算");
    }
    const clueCount = state.foundByTrial[state.trial].length;
    if (kind === "reveal" && clueCount < 2) {
      throw new Error("至少两处破绽才能以证喝破");
    }

    const before = {
      trust: state.trust,
      bossHpMod: state.bossHpMod,
      masks: clone(state.masks),
      evidenceCount: state.evidence.length
    };

    if (kind === "reveal") {
      addTrust(state, 1);
      if (clueCount === 3) {
        state.masks[trial.mask] = true;
      }
      addEvidence(state, trial, clueCount);
      state.stats.reveals += 1;
    } else if (kind === "strike") {
      addTrust(state, -1);
      state.bossHpMod -= 8;
      addEvidence(state, trial, clueCount);
      state.stats.strikes += 1;
    } else {
      addTrust(state, 1);
      state.bossHpMod += 8;
      addEvidence(state, trial, clueCount);
    }

    state.dispositions.push({
      trial: trial.id,
      mask: trial.mask,
      kind,
      clueCount,
      trustBefore: before.trust,
      trustAfter: state.trust,
      maskBroken: state.masks[trial.mask],
      evidenceGained: state.evidence.length > before.evidenceCount
    });

    state.lastResult = {
      trial: trial.id,
      kind,
      clueCount,
      trustDelta: state.trust - before.trust,
      trust: state.trust,
      maskBroken: state.masks[trial.mask],
      evidenceGained: state.evidence.length > before.evidenceCount,
      bossDelta: state.bossHpMod - before.bossHpMod
    };
    return state;
  }

  function applyInterlude(inputState, node, choice) {
    const state = clone(inputState);
    if (node === "bajie") {
      if (choice === "cover") {
        addTrust(state, -2);
        state.bajieAllied = true;
      } else if (choice === "expose") {
        addTrust(state, 1);
        state.bajieAllied = false;
      } else {
        throw new Error("未知八戒选择");
      }
    } else if (node === "gods") {
      if (choice === "summon") {
        state.godWitness = true;
        state.bossHpMod += 6;
      } else if (choice === "quiet") {
        state.godWitness = false;
        state.bossHpMod -= 6;
      } else {
        throw new Error("未知山神选择");
      }
    } else {
      throw new Error("未知关系节点");
    }
    state.interlude.push({ node, choice, trust: state.trust });
    return state;
  }

  function advanceTrial(inputState) {
    const state = clone(inputState);
    if (state.trial < TRIALS.length - 1) {
      state.trial += 1;
    }
    return state;
  }

  function bossIntentForRound(round) {
    const phase = ((round - 1) % 3) + 1;
    if (phase === 1) {
      return {
        id: "claw",
        name: "骨爪",
        player: 12,
        master: 0,
        hint: "悟空将受 12 点伤害"
      };
    }
    if (phase === 2) {
      return {
        id: "fog",
        name: "迷魂雾",
        player: 8,
        master: 8,
        hint: "悟空 -8，唐僧 -8"
      };
    }
    return {
      id: "soul",
      name: "摄魂",
      player: 0,
      master: 24,
      hint: "唐僧将受 24 点伤害；护师可化解"
    };
  }

  function allMasksBroken(state) {
    return MASK_ORDER.every((mask) => state.masks[mask]);
  }

  function prebrokenCount(state) {
    return MASK_ORDER.filter((mask) => state.masks[mask]).length;
  }

  function startBoss(inputState) {
    const state = clone(inputState);
    if (state.trust <= 1) {
      state.ending = { id: "expelled", reason: "trust" };
      state.screen = "ending";
      return state;
    }
    const maxHp = clamp(120 + state.bossHpMod + (state.trust === 2 ? 10 : 0), 80, 170);
    state.boss = {
      maxHp,
      hp: maxHp,
      playerMaxHp: 75,
      playerHp: 75,
      masterMaxHp: 45,
      masterHp: 45,
      round: 1,
      intent: bossIntentForRound(1),
      masks: clone(state.masks),
      shieldHp: {
        color: state.masks.color ? 0 : 16,
        mercy: state.masks.mercy ? 0 : 16,
        age: state.masks.age ? 0 : 16
      },
      prebroken: prebrokenCount(state),
      ward: 0,
      guard: false,
      bindNext: false,
      insight: state.trust >= 4 ? 4 : 3,
      clonesLeft: 3,
      evidenceUsed: [],
      bajieAllied: state.bajieAllied,
      godWitness: state.godWitness,
      outcome: null,
      log: [],
      history: []
    };
    state.stats.guards = 0;
    state.screen = "boss";
    return state;
  }

  function frontMask(boss) {
    for (const mask of MASK_ORDER) {
      if (!boss.masks[mask] && (boss.shieldHp[mask] || 0) > 0) {
        return mask;
      }
    }
    return null;
  }

  function dealToBoss(boss, amount) {
    let remaining = amount;
    const mask = frontMask(boss);
    if (mask) {
      const absorbed = Math.min(boss.shieldHp[mask], remaining);
      boss.shieldHp[mask] -= absorbed;
      remaining -= absorbed;
      if (boss.shieldHp[mask] <= 0) {
        boss.masks[mask] = true;
      }
    }
    if (remaining > 0) {
      boss.hp = Math.max(0, boss.hp - remaining);
    }
    return { amount, absorbed: amount - remaining, mask };
  }

  function canUseThree(boss) {
    return boss.hp <= 30 && allMasksBroken({ masks: boss.masks });
  }

  function finishCheck(state) {
    const boss = state.boss;
    if (!boss || boss.outcome) {
      return state;
    }
    if (boss.playerHp <= 0) {
      boss.outcome = "bad_wukong";
      state.ending = { id: "bad_wukong", reason: "wukong-down" };
      state.screen = "ending";
    } else if (boss.masterHp <= 0) {
      boss.outcome = "bad_master";
      state.ending = { id: "bad_master", reason: "master-down" };
      state.screen = "ending";
    } else if (boss.hp <= 0) {
      boss.outcome = "win";
      state.ending = chooseWinEnding(state);
      state.screen = "ending";
    }
    return state;
  }

  function applySupport(state) {
    const boss = state.boss;
    const round = boss.round;
    if (round % 2 !== 0) {
      return;
    }
    if (boss.godWitness) {
      boss.hp = Math.max(0, boss.hp - 5);
      boss.log.push("山神金线自云中垂下，白骨夫人受 5 点伤。");
    }
    if (boss.bajieAllied) {
      boss.hp = Math.max(0, boss.hp - 7);
      boss.log.push("八戒从侧后抡起钉耙，白骨夫人受 7 点伤。");
    }
  }

  function enemyAct(state) {
    const boss = state.boss;
    if (boss.bindNext) {
      boss.bindNext = false;
      boss.log.push("定身法起，白骨夫人这一手停在半空。");
      return;
    }
    const intent = boss.intent;
    let playerDamage = intent.player;
    if (playerDamage > 0 && boss.ward > 0) {
      const absorbed = Math.min(boss.ward, playerDamage);
      boss.ward -= absorbed;
      playerDamage -= absorbed;
      boss.log.push("分身纸影挡下 " + absorbed + " 点伤害。");
      if (boss.ward === 0) {
        boss.log.push("纸影散作毫毛。");
      }
    }
    if (playerDamage > 0) {
      boss.playerHp = Math.max(0, boss.playerHp - playerDamage);
      boss.log.push("白骨夫人的" + intent.name + "落在悟空身上，" + playerDamage + " 点伤。");
    }
    if (intent.master > 0) {
      if (boss.guard) {
        boss.log.push("护师纸伞撑开，唐僧未伤。");
      } else {
        boss.masterHp = Math.max(0, boss.masterHp - intent.master);
        boss.log.push("唐僧被摄魂所侵，" + intent.master + " 点伤。");
      }
    }
    boss.guard = false;
  }

  function playerAction(inputState, action, target) {
    const state = clone(inputState);
    const boss = state.boss;
    if (!boss || boss.outcome) {
      return state;
    }
    const before = {
      hp: boss.hp,
      playerHp: boss.playerHp,
      masterHp: boss.masterHp,
      masks: clone(boss.masks)
    };
    boss.log = [];
    let skipEnemy = false;
    let endedByThree = false;

    if (action === "strike") {
      const base = 20 + (boss.ward > 0 ? 6 : 0);
      const result = dealToBoss(boss, base);
      boss.log.push("金箍棒压下，" + (result.absorbed ? "骨障吸收 " + result.absorbed + " 点，" : "") + "白骨夫人共受 " + base + " 点。");
      if (boss.ward > 0) {
        boss.log.push("分身余势使棒风更沉。");
      }
    } else if (action === "evidence") {
      const evidence = state.evidence.find((item) => item.id === target);
      if (!evidence || boss.evidenceUsed.includes(evidence.id)) {
        throw new Error("该证物不可用");
      }
      boss.evidenceUsed.push(evidence.id);
      if (!boss.masks[evidence.mask]) {
        boss.masks[evidence.mask] = true;
        boss.shieldHp[evidence.mask] = 0;
        boss.hp = Math.max(0, boss.hp - 8);
        boss.log.push("“" + evidence.name + "”钉住一张假面，骨障碎裂，白骨夫人受 8 点伤。");
      } else {
        boss.hp = Math.max(0, boss.hp - 14);
        boss.log.push("旧证再亮，白骨夫人被照得退了一步，受 14 点伤。");
      }
    } else if (action === "clone") {
      if (boss.clonesLeft <= 0) {
        throw new Error("毫毛已尽");
      }
      boss.clonesLeft -= 1;
      boss.ward += 12;
      const result = dealToBoss(boss, 8);
      boss.log.push("悟空拔毫毛一吹，纸影护身，反手一击。");
      if (result.absorbed > 0) {
        boss.log.push("反击被骨障挡去 " + result.absorbed + " 点。");
      }
    } else if (action === "bind") {
      if (boss.insight <= 0) {
        throw new Error("法眼余力不足");
      }
      boss.insight -= 1;
      boss.bindNext = true;
      skipEnemy = true;
      boss.log.push("定！白骨夫人被钉在原地，下一手使不出来。");
    } else if (action === "guard") {
      boss.guard = true;
      boss.masterHp = Math.min(boss.masterMaxHp, boss.masterHp + 4);
      state.stats.guards += 1;
      boss.log.push("悟空横棒护在唐僧身前，纸伞展开。");
    } else if (action === "three") {
      if (!canUseThree(boss)) {
        throw new Error("三打时机未到");
      }
      boss.hp = 0;
      endedByThree = true;
      boss.log.push("三证齐亮，三骨环尽碎。悟空一棒落下，白骨夫人散作白灰。");
    } else {
      throw new Error("未知战斗行动: " + action);
    }

    if (!endedByThree && boss.hp > 0) {
      if (!skipEnemy) {
        enemyAct(state);
      }
      if (boss.hp > 0) {
        applySupport(state);
      }
      const wasWon = boss.hp <= 0;
      if (!wasWon) {
        boss.round += 1;
        boss.intent = bossIntentForRound(boss.round);
      }
    }

    boss.history.push({
      turn: boss.round,
      action,
      target: target || null,
      before,
      after: {
        hp: boss.hp,
        playerHp: boss.playerHp,
        masterHp: boss.masterHp,
        masks: clone(boss.masks)
      }
    });

    finishCheck(state);
    return state;
  }

  function chooseWinEnding(state) {
    if (state.trust >= 4 && state.boss.prebroken === 3) {
      return { id: "good", reason: "all-evidence-and-trust" };
    }
    if (state.trust <= 2) {
      return { id: "canonical", reason: "victory-but-distrusted" };
    }
    return { id: "bittersweet", reason: "victory-with-scars" };
  }

  function bossIntent(state) {
    return state.boss ? state.boss.intent : null;
  }

  function gameSummary(state) {
    return {
      trust: state.trust,
      clues: state.foundByTrial.reduce((sum, list) => sum + list.length, 0),
      evidence: state.evidence.length,
      masksBroken: MASK_ORDER.filter((mask) => state.masks[mask]).length,
      bajieAllied: state.bajieAllied,
      godWitness: state.godWitness,
      dispositionCount: state.dispositions.length,
      ending: state.ending ? state.ending.id : null
    };
  }

  return {
    TRIALS,
    MASK_ORDER,
    initialState,
    currentTrial,
    applyDisposition,
    applyInterlude,
    advanceTrial,
    startBoss,
    playerAction,
    bossIntent,
    bossIntentForRound,
    canUseThree,
    allMasksBroken,
    chooseWinEnding,
    gameSummary,
    clamp,
    clone
  };
});

