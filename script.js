// Initialize Lucide Icons & Theme
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  initTheme();
  init3DCardTilt();
  initSectionTransitions();
  initVisitorCounter();
  initDevEasterEgg();
  initChatTimestamps();
  syncCardHeight();
});

window.addEventListener("load", syncCardHeight);
window.addEventListener("resize", syncCardHeight);

/* ==========================================================================
   1. 3-WAY THEME SWITCHER (MAX GAY / LIGHT / DARK) - DEFAULT: RAINBOW
   ========================================================================== */

function initTheme() {
  let savedTheme = "rainbow";
  try {
    // Purge any stale legacy theme setting from previous tests
    localStorage.removeItem("dhananjay-theme");
    savedTheme = localStorage.getItem("dhananjay-theme-v3") || "rainbow";
  } catch (e) {
    console.warn("Storage access unavailable:", e);
  }
  applyTheme(savedTheme, false);

  const themeButtons = document.querySelectorAll(".theme-toggle-btn");
  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");
      applyTheme(theme, true);
    });
  });
}

function applyTheme(theme, isUserClick = false) {
  // Enforce rainbow if invalid
  if (!theme || (theme !== "rainbow" && theme !== "dark" && theme !== "light")) {
    theme = "rainbow";
  }

  document.documentElement.setAttribute("data-theme", theme);
  if (document.body) {
    document.body.setAttribute("data-theme", theme);
  }

  try {
    localStorage.setItem("dhananjay-theme-v3", theme);
  } catch (e) {
    // Ignore storage restriction
  }

  // Update active pill indicator
  const themeButtons = document.querySelectorAll(".theme-toggle-btn");
  themeButtons.forEach(btn => {
    if (btn.getAttribute("data-theme") === theme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Fun celebratory sparkle only on deliberate user click
  if (isUserClick) {
    triggerSparkles(0.35);
  }
}

/* ==========================================================================
   2. INTERACTIVE REJECTION SURVEY MODAL (GIRL VS BOY)
   ========================================================================== */

function openRejectionModal() {
  const modal = document.getElementById("rejection-modal");
  if (!modal) return;

  // Reset steps
  document.getElementById("rejection-step-select").classList.remove("hidden");
  document.getElementById("rejection-outcome-girl").classList.add("hidden");
  document.getElementById("rejection-outcome-boy").classList.add("hidden");
  const heartbroken = document.getElementById("rejection-outcome-heartbroken");
  if (heartbroken) heartbroken.classList.add("hidden");

  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeRejectionModal(e) {
  const modal = document.getElementById("rejection-modal");
  if (modal) {
    modal.classList.remove("active");
  }
  const quizModal = document.getElementById("quiz-modal");
  if (!quizModal || !quizModal.classList.contains("active")) {
    document.body.classList.remove("modal-open");
  }
}

function handleRejection(gender) {
  document.getElementById("rejection-step-select").classList.add("hidden");

  if (gender === "girl") {
    document.getElementById("rejection-outcome-girl").classList.remove("hidden");
  } else if (gender === "boy") {
    document.getElementById("rejection-outcome-boy").classList.remove("hidden");
    if (typeof confetti === "function") {
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#FF0055", "#990022", "#330011"]
      });
    }
  }
}

function takeItBack() {
  closeRejectionModal();
  setTimeout(() => {
    openQuizModal();
    triggerPrideBurst();
  }, 250);
}

function confirmHeartbreak() {
  const boyOutcome = document.getElementById("rejection-outcome-boy");
  const heartbroken = document.getElementById("rejection-outcome-heartbroken");
  if (boyOutcome) boyOutcome.classList.add("hidden");
  if (heartbroken) {
    heartbroken.classList.remove("hidden");
    if (typeof confetti === "function") {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#555555", "#888888", "#222222"]
      });
    }
  }
}

/* ==========================================================================
   3. LIVE 2 AM REEL BOMBARDMENT SIMULATOR
   ========================================================================== */

const incomingReels = [
  {
    type: "reel",
    author: "@malayalam_brainrot",
    text: "POV: You're standing in Kollam KSRTC fast passenger listening to sad A.R. Rahman songs",
    comment: "BRO THIS IS LITERALLY MY DAILY COMMUTE I CANNOT 💀"
  },
  {
    type: "reel",
    author: "@anime_feels_99",
    text: "Gojo Satoru edit set to slowed + reverb romantic Malayalam melody",
    comment: "If my future husband doesn't look at me like this what is the point?? 😭"
  },
  {
    type: "reel",
    author: "@puppy_sanctuary",
    text: "Stray golden puppy discovers he is adopted and gets a little yellow sweater",
    comment: "I've been sobbing for 20 minutes straight please send help 🥺🥺🥺"
  },
  {
    type: "reel",
    author: "@chathannoor_chronicles",
    text: "Handsome guy in oversized knit sweater drinking pour-over coffee on rainy terrace",
    comment: "HE HAS NO RIGHT LOOKING THIS SUAVE HELLO??? ☕🧎‍♂️"
  },
  {
    type: "reel",
    author: "@wholesome_queer",
    text: "Couple builds tiny bookshelf together on rainy Sunday afternoon",
    comment: "manifesting this for us in 2026. also are you asleep yet? pick up the video call!!"
  },
  {
    type: "reel",
    author: "@thirst_central",
    text: "Man in cream turtleneck making pour-over espresso in cozy wooden cabin",
    comment: "No thoughts, head completely empty, just him."
  },
  {
    type: "reel",
    author: "@ksrtc_speed_and_fury",
    text: "Super Fast bus taking a 90-degree hairpin turn while drifting like Tokyo Drift",
    comment: "My morning bus driver has zero fear of God or gravity. Still arrived 2 mins early for CSE lab 🚌🏎️"
  },
  {
    type: "reel",
    author: "@gym_boy_chronicles",
    text: "Guy does heavy bench press, smiles at camera, and adjusts messy curls",
    comment: "HELLO??? I just dropped my phone on my face. God has his favorites. 🧎‍♂️🔥"
  },
  {
    type: "reel",
    author: "@cat_psychology",
    text: "Orange kitten falls asleep directly on laptop keyboard while programmer is debugging",
    comment: "THIS IS LITERALLY US IF WE WERE CATS. DON'T ARGUE. 🐱💻"
  },
  {
    type: "reel",
    author: "@kerala_foodie_lore",
    text: "Crispy beef roast and hot flaky Kerala parotta at 11 PM street thalassery stall",
    comment: "Look at this. We are going here. Date night non-negotiable. 🤤🌯"
  },
  {
    type: "reel",
    author: "@indie_music_vibes",
    text: "Acoustic fingerstyle guitar with soft rain tapping on terracotta roof tiles",
    comment: "Current emotional status: Staring out the window in Chathannoor contemplating my entire life. 🌧️🎸"
  },
  {
    type: "reel",
    author: "@dating_comedy_hub",
    text: "Things day scholars do instead of texting back in 5 minutes (they were writing a paragraph)",
    comment: "Why are they calling me out like this on national algorithm?! 😂🤦‍♂️"
  },
  {
    type: "reel",
    author: "@golden_retriever_energy",
    text: "Puppy tries to catch water from garden hose and gets thoroughly soaked",
    comment: "He has the exact same two brain cells as me on Monday mornings 🐾💦"
  },
  {
    type: "reel",
    author: "@dramatic_cinema_edits",
    text: "Fahadh Faasil intense eye contact scene in slow motion",
    comment: "The cinematic aura is terrifying yet irresistible. Manifesting this intensity in romance 👁️✨"
  },
  {
    type: "reel",
    author: "@study_motivation_daily",
    text: "Studying at 3 AM with green desk lamp and cozy lofi beats",
    comment: "Pretending I'm a tragic brooding scholar in Oxford when I'm actually studying sorting algorithms ☕📚"
  },
  {
    type: "reel",
    author: "@gay_culture_today",
    text: "When he remembers your favorite canteen snack without asking",
    comment: "The bar is on the floor yet my heart is soaring into the stratosphere 🥺💖"
  },
  {
    type: "reel",
    author: "@cardio_olympics",
    text: "Man spots approaching vehicle, executes flawless Usain Bolt dash across 4-lane road",
    comment: "LEAKED FOOTAGE OF ME AT 8:29 AM RUNNING FOR THE BUS 🏃‍♂️💨"
  },
  {
    type: "reel",
    author: "@wholesome_couple_vibes",
    text: "Boyfriend gives forehead kiss and wraps him in oversized hoodie",
    comment: "OKAY LORD I SEE WHAT YOU DO FOR OTHERS. WHEN IS MY TURN?? 🙏😭"
  }
];

let totalReelsSent = 47;
let reelIndex = 0;

function simulateNewReel() {
  const feed = document.getElementById("dm-reel-feed");
  const counterText = document.getElementById("reel-counter-text");
  if (!feed) return;

  const current = incomingReels[reelIndex % incomingReels.length];
  reelIndex++;
  totalReelsSent++;

  const reelBubble = document.createElement("div");
  reelBubble.className = "bubble-received";
  reelBubble.innerHTML = `
    <span class="reel-icon">🎬</span>
    <div class="reel-snippet">
      <p><strong>Reel from ${current.author}:</strong> "${current.text}"</p>
    </div>
  `;

  const textBubble = document.createElement("div");
  textBubble.className = "bubble-received text-only";
  textBubble.innerHTML = `<p>${current.comment}</p>`;

  feed.appendChild(reelBubble);
  setTimeout(() => {
    feed.appendChild(textBubble);
    feed.scrollTop = feed.scrollHeight;
  }, 120);

  if (counterText) {
    counterText.textContent = `Reels dispatched tonight: ${totalReelsSent}`;
  }

  triggerSparkles(0.2);
}

/* ==========================================================================
   4. LAME JOKE GENERATOR (DAY SCHOLAR & COMMUTER EDITION)
   ========================================================================== */

const lameJokes = [
  {
    setup: "Why does Dhananjay always take the window seat on the Chathannoor KSRTC bus?",
    punchline: "So he can gaze out into the rain like the tragic main character of a Tamil romance movie! (True story) 🌧️🚌"
  },
  {
    setup: "Why did the CSE student refuse to close his 47 Instagram tabs?",
    punchline: "Because every single one is a reel he solemnly promised to send you at 2:40 AM. 📱💨"
  },
  {
    setup: "Why does Dhananjay always sit on the left window seat of the KSRTC bus?",
    punchline: "So he can gaze dramatically out of the window in the rain like a melancholic Malayalam movie hero! 🚌🌧️"
  },
  {
    setup: "Why don't day scholars from Chathannoor ever get lost?",
    punchline: "Because our emotional compass is strictly locked onto cute boys and hot canteen pazhampori. ☕💖"
  },
  {
    setup: "How does Dhananjay handle a tough coding lab error?",
    punchline: "He cries for 10 minutes, texts 'it's so over', and then fixes the missing semicolon. 😭💻"
  },
  {
    setup: "What did the KSRTC conductor say when Dhananjay opened Instagram?",
    punchline: "'Moné, watch your step first, your reel algorithm will survive!' 🎟️😂"
  },
  {
    setup: "Why did Dhananjay buy a power bank with 30,000 mAh capacity?",
    punchline: "Not for coding emergencies—strictly to keep video calls running when his budget Samsung starts boiling at 3:15 AM! 🔥🔋"
  },
  {
    setup: "How do you know Dhananjay is having a serious technical crisis in the lab?",
    punchline: "He sighs dramatically, lays face-down on the desk, and whispers: 'Will an engineering degree ever love me back?' 🥺🖥️"
  },
  {
    setup: "What is Dhananjay's idea of an extreme athletic cardio workout?",
    punchline: "Sprint-running from an approaching car across the highway like an Olympic track athlete with zero hesitation. 🏃‍♂️💨🚗"
  },
  {
    setup: "Why can't Dhananjay keep any romantic secrets from his homies?",
    punchline: "Because his cheeks turn 50 shades of pink if you even whisper the words 'cute boy with messy curls'. 🌸😳"
  },
  {
    setup: "What happens if you accidentally send Dhananjay a 3-second voice note saying 'hey'?",
    punchline: "He analyzes the vocal acoustic frequency for 4 hours with 3 different emotional diagnostic spreadsheets. 📈🎧"
  },
  {
    setup: "Why does Dhananjay walk extra distance from the bus stand instead of taking an auto?",
    punchline: "Auto fare: ₹50. Walking in slow-motion with wired earphones pretending he's in a Gautham Menon movie: Free! 🚶‍♂️✨"
  },
  {
    setup: "What is Dhananjay's favorite CSS display property?",
    punchline: "display: flex; because he's constantly flexing his 99% commute stamina and emotional vulnerability! 💪💅"
  },
  {
    setup: "Why did Dhananjay's KSRTC monthly bus pass have water damage on it?",
    punchline: "He dropped it in a puddle while weeping over a golden retriever rescue puppy reel in the rain. 🐶🌧️"
  },
  {
    setup: "How does Dhananjay prepare for his semester lab viva?",
    punchline: "20% lecture notes, 10% YouTube tutorials, and 70% reciting Malayalam cinema motivational dialogues in the mirror! 🎬📚"
  },
  {
    setup: "What is Dhananjay's official stance on Situationships?",
    punchline: "Zero percent tolerance! He is an ISO-certified enterprise enterprise, not an unstable open-source beta trial! ❌📦"
  },
  {
    setup: "Why did Dhananjay order two cups of canteen tea?",
    punchline: "One to drink, and one to hold romantically in case his soulmate suddenly walks down the hallway. ☕👀"
  },
  {
    setup: "What is the fastest way to summon Dhananjay to your DMs?",
    punchline: "Post an Instagram story featuring a rainy sunset, indie acoustic guitar music, and iced coffee. He will reply in 1.4 seconds. ⚡🌅"
  }
];

let currentJokeIndex = 0;

function generateJoke() {
  const setupEl = document.getElementById("joke-setup");
  const punchlineEl = document.getElementById("joke-punchline");
  const jokeBox = document.getElementById("joke-box");
  if (!jokeBox || !setupEl || !punchlineEl) return;

  jokeBox.classList.add("is-shimmering");

  setTimeout(() => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * lameJokes.length);
    } while (nextIndex === currentJokeIndex && lameJokes.length > 1);

    currentJokeIndex = nextIndex;
    setupEl.textContent = `"${lameJokes[currentJokeIndex].setup}"`;
    punchlineEl.textContent = `"${lameJokes[currentJokeIndex].punchline}"`;

    setTimeout(() => {
      jokeBox.classList.remove("is-shimmering");
      triggerSparkles(0.2);
    }, 120);
  }, 220);
}

let pityLaughCount = 0;
function laughReaction() {
  pityLaughCount++;
  const laughText = document.getElementById("laugh-text");
  const laughIcon = document.getElementById("laugh-icon");

  const icons = ["😂", "💀", "😭", "🤦‍♂️", "🦗", "👏", "🚌"];
  laughIcon.textContent = icons[pityLaughCount % icons.length];
  laughText.textContent = `Pity Laugh (+${pityLaughCount})`;

  triggerSparkles(0.15);
}

/* ==========================================================================
   5. INTERACTIVE LIKE COUNTER ON POLAROID
   ========================================================================== */

let likes = 1403;
function incrementLikes(e) {
  if (e && typeof e.stopPropagation === "function") {
    e.stopPropagation();
  }
  likes++;
  const likeEl = document.getElementById("like-count");
  if (likeEl) {
    likeEl.textContent = likes.toLocaleString();
  }

  const heartCounterEl = document.querySelector(".heart-counter");
  if (heartCounterEl) {
    heartCounterEl.classList.remove("bounce");
    void heartCounterEl.offsetWidth; // Restart micro-bounce keyframe
    heartCounterEl.classList.add("bounce");
  }

  const card = document.querySelector(".card-3d-front") || document.querySelector(".photo-card");
  if (card) {
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.style.position = "absolute";
    heart.style.right = "25px";
    heart.style.bottom = "45px";
    heart.style.fontSize = "1.6rem";
    heart.style.pointerEvents = "none";
    heart.style.transition = "all 0.75s ease-out";
    heart.style.zIndex = "99";
    card.appendChild(heart);

    setTimeout(() => {
      heart.style.transform = `translate(${Math.random() * 30 - 15}px, -70px) scale(1.3)`;
      heart.style.opacity = "0";
    }, 20);

    setTimeout(() => heart.remove(), 800);
  }
}

/* ==========================================================================
   6. CONFETTI & PRIDE SPARKLE BURSTS
   ========================================================================== */

function triggerPrideBurst() {
  if (typeof confetti !== "function") return;

  confetti({
    origin: { y: 0.7 },
    particleCount: 70,
    spread: 80,
    colors: ["#FF4589", "#FF9F45", "#FFDF45", "#45FF98", "#458BFF", "#AF45FF"]
  });
}

function triggerSparkles(intensity = 0.5) {
  if (typeof confetti !== "function") return;
  confetti({
    particleCount: Math.floor(35 * intensity),
    spread: 50,
    origin: { y: 0.8 },
    colors: ["#FF3385", "#A833FF", "#FFD166"]
  });
}

const sparkleBtn = document.getElementById("sparkle-btn");
if (sparkleBtn) {
  sparkleBtn.addEventListener("click", () => {
    triggerPrideBurst();
  });
}

/* ==========================================================================
   7. COMPATIBILITY QUIZ LOGIC (7 QUESTIONS + PROGRESS BAR)
   ========================================================================== */

let quizScore = 0;
let currentStep = 1;
const totalSteps = 7;

function openQuizModal() {
  const modal = document.getElementById("quiz-modal");
  if (modal) {
    modal.classList.add("active");
    resetQuiz();
    document.body.classList.add("modal-open");
  }
}

function closeQuizModal(e) {
  const modal = document.getElementById("quiz-modal");
  if (modal) {
    modal.classList.remove("active");
  }
  const rejectionModal = document.getElementById("rejection-modal");
  if (!rejectionModal || !rejectionModal.classList.contains("active")) {
    document.body.classList.remove("modal-open");
  }
}

function updateProgressBar(step) {
  const badge = document.getElementById("quiz-progress-badge");
  const fill = document.getElementById("quiz-progress-fill");

  if (badge) {
    badge.textContent = `QUESTION ${Math.min(step, totalSteps)} OF ${totalSteps}`;
  }
  if (fill) {
    const percentage = Math.round((step / totalSteps) * 100);
    fill.style.width = `${Math.min(100, percentage)}%`;
  }
}

function answerQuiz(stepNumber, points) {
  quizScore += points;

  const currentStepEl = document.querySelector(`.quiz-step[data-step="${stepNumber}"]`);
  if (currentStepEl) {
    currentStepEl.classList.add("hidden");
  }

  const nextStep = stepNumber + 1;
  if (nextStep <= totalSteps) {
    currentStep = nextStep;
    updateProgressBar(nextStep);
    const nextStepEl = document.querySelector(`.quiz-step[data-step="${nextStep}"]`);
    if (nextStepEl) {
      nextStepEl.classList.remove("hidden");
    }
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  const resultCard = document.getElementById("quiz-result");
  const scorePercentEl = document.getElementById("score-percentage");
  const scoreCircleEl = document.getElementById("result-score-circle");
  const headlineEl = document.getElementById("result-headline");
  const descEl = document.getElementById("result-description");
  const dmBtn = document.getElementById("result-dm-btn");
  const badge = document.getElementById("quiz-progress-badge");
  const fill = document.getElementById("quiz-progress-fill");

  if (badge) badge.textContent = "RESULT READY ✨";
  if (fill) fill.style.width = "100%";

  // DYNAMIC CONTINUOUS MATHEMATICAL SCORING (NO ARTIFICIAL 45% OR 97% CLAMPING!)
  // Max possible score is +70, Min possible is -155.
  let percent;
  if (quizScore >= 70) {
    percent = 99;
  } else if (quizScore >= 0) {
    // quizScore 0 to 69 maps smoothly and realistically from 25% to 98%
    percent = Math.round(25 + (quizScore / 70) * 73);
  } else {
    // quizScore -1 to -155 maps smoothly from 24% down to 1%
    const normalizedLoss = Math.min(1, Math.abs(quizScore) / 150);
    percent = Math.max(1, Math.round(24 - normalizedLoss * 23));
  }

  scorePercentEl.textContent = `${percent}%`;

  if (dmBtn) {
    dmBtn.innerHTML = `<span>Send ${percent}% Match to @dhananjay_403 on Insta</span> <i data-lucide="send"></i>`;
  }

  // 7 GRANULAR, HILARIOUS VERDICT TIERS
  if (percent >= 90) {
    headlineEl.textContent = "💍 SOULMATE SUPREME: WEDDING CARDS ARE BEING PRINTED!";
    descEl.textContent = `Unbelievable. You scored ${percent}%! You are Dhananjay's mythical soulmate. You accept his 50 midnight reels, embrace his anime tears, respect his deep emotional loyalty, and your phone battery can survive 3 AM video calls on his Samsung. The homie council has officially co-signed the marriage certificate. Slide into his Instagram DMs (@dhananjay_403) before another CSE suitor takes him!`;
    triggerPrideBurst();
  } else if (percent >= 78) {
    headlineEl.textContent = "💌 ELITE BOYFRIEND MATERIAL: 100% HOMIE APPROVED!";
    descEl.textContent = `Outstanding match (${percent}%)! You have the emotional maturity to handle his dramatic anime crying sessions and you actually appreciate his lame dad puns. You qualify for shared earbuds on the Chathannoor fast passenger bus. DM @dhananjay_403 on Instagram immediately with your favorite meme!`;
    triggerSparkles(0.7);
  } else if (percent >= 63) {
    headlineEl.textContent = "📱 CERTIFIED CUTIE: PASSED WITH MINOR REEL HOMEWORK";
    descEl.textContent = `Solid chemistry (${percent}%)! You're sweet, emotionally available, and fun. However, you might need light endurance training for his unhinged 2:30 AM Instagram spam and KSRTC bus philosophy debates. Send him a DM with chai & pazhampori emojis to test the vibe!`;
    triggerSparkles(0.4);
  } else if (percent >= 48) {
    headlineEl.textContent = "⚠️ EMOTIONAL GAMBLE: DHANANJAY IS ON THE FENCE";
    descEl.textContent = `Borderline territory (${percent}%). Dhananjay is deeply sensitive—if you leave him on 'read' for more than 4 hours, he will write 3 melancholic notes and stare out the bus window in the rain. DM him only if you're ready to communicate honestly and never play games.`;
  } else if (percent >= 30) {
    headlineEl.textContent = "🚩 RED FLAG WARNING: KSRTC BUS PASS REVOKED";
    descEl.textContent = `Uh-oh (${percent}%). Our proprietary Chathannoor algorithm detected dangerously low meme appreciation and severe dad-joke resistance. If you roll your eyes at his tears or tell him to get a job at 2 AM, he will file an emergency complaint with the homie committee. Proceed with caution!`;
  } else if (percent >= 15) {
    headlineEl.textContent = "🚨 STRAIGHT MAN CONTAMINATION: PROTOCOL BREACH";
    descEl.textContent = `Did an emotionally unavailable straight boy take this test?! You scored ${percent}%. Dhananjay's earbuds disconnected in pure shock. You probably say 'let's see where it goes' and forget birthdays. Re-evaluate your life choices, or retake this test with actual love in your heart.`;
  } else {
    headlineEl.textContent = "💀 CATASTROPHIC DISASTER: EMOTIONAL WAR CRIMES";
    descEl.textContent = `A shocking ${percent}%! Are you actively trying to break his heart?! You spoiled anime endings, laughed at his genuine heartbreak, and ignored his reels. Our homie legal department has drafted an emergency restraining order. Please close this browser tab and reflect on your actions.`;
  }

  resultCard.classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function resetQuiz() {
  quizScore = 0;
  currentStep = 1;
  updateProgressBar(1);

  document.querySelectorAll(".quiz-step").forEach((step, index) => {
    if (index === 0) {
      step.classList.remove("hidden");
    } else {
      step.classList.add("hidden");
    }
  });

  const resultCard = document.getElementById("quiz-result");
  if (resultCard) {
    resultCard.classList.add("hidden");
  }
}

/* ==========================================================================
   8. 3D CARD PARALLAX TILT & DOUBLE-SIDED FLIP ENGINE (PERFORMANCE-TUNED)
   ========================================================================== */

let isCardFlipped = false;

function toggleCardFlip(e) {
  if (e && typeof e.stopPropagation === "function") {
    e.stopPropagation();
  }
  const flipper = document.getElementById("hero-card-flipper");
  const tiltBox = document.getElementById("hero-card-tilt");
  if (!flipper) return;

  syncCardHeight();
  isCardFlipped = !isCardFlipped;
  if (isCardFlipped) {
    flipper.classList.add("is-flipped");
    if (tiltBox) {
      tiltBox.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
    triggerSparkles(0.25);
  } else {
    flipper.classList.remove("is-flipped");
    if (tiltBox) {
      tiltBox.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  }
}

function handleHeroCardClick(e) {
  // If user clicked heart counter, a link, rejection button, or overlay tag, don't flip
  if (
    e.target.closest(".heart-counter") ||
    e.target.closest("a") ||
    e.target.closest(".btn-not-interested") ||
    e.target.closest(".photo-overlay-tag")
  ) {
    return;
  }
  toggleCardFlip(e);
}

function init3DCardTilt() {
  const scene = document.getElementById("hero-card-scene");
  const tiltBox = document.getElementById("hero-card-tilt");
  if (!scene || !tiltBox) return;

  // Only enable cursor-based tilt on devices that support hover (mouse pointer)
  // This prevents any scroll stutter or jump on touch/mobile screens!
  const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!hasMouse) return;

  let rafId = null;

  scene.addEventListener("mousemove", (e) => {
    if (isCardFlipped) return; // Freeze tilt when viewing back specs

    const rect = scene.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth tilt up to 8 degrees
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      tiltBox.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      scene.style.setProperty("--glare-x", `${glareX.toFixed(1)}%`);
      scene.style.setProperty("--glare-y", `${glareY.toFixed(1)}%`);
      scene.style.setProperty("--glare-opacity", "0.5");
    });
  });

  scene.addEventListener("mouseleave", () => {
    if (rafId) cancelAnimationFrame(rafId);
    tiltBox.style.transition = "transform 0.35s cubic-bezier(0.2, 0.85, 0.32, 1.2)";
    tiltBox.style.transform = "rotateX(0deg) rotateY(0deg)";
    scene.style.setProperty("--glare-opacity", "0");

    setTimeout(() => {
      tiltBox.style.transition = "";
    }, 350);
  });
}

/* ==========================================================================
   10. GLOBAL ACCESSIBILITY & ESCAPE KEY HANDLER
   ========================================================================== */

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeQuizModal();
    closeRejectionModal();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".dhananjay-action-video");
  if (video) {
    video.play().catch(() => {
      // Browser autoplay policy prevented automated playback; controls available
    });
  }
});

/* ==========================================================================
   11. VERSION 2 ENHANCEMENTS: CARD SYNC, SECTIONS, VISITOR COUNTER, EASTER EGG
   ========================================================================== */

function syncCardHeight() {
  const front = document.querySelector(".card-3d-front");
  const flipper = document.getElementById("hero-card-flipper");
  if (front && flipper) {
    const h = front.offsetHeight;
    if (h > 0) {
      flipper.style.minHeight = `${h}px`;
    }
  }
}

function initSectionTransitions() {
  const sections = document.querySelectorAll(".section");
  if (!("IntersectionObserver" in window)) {
    sections.forEach(s => s.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  sections.forEach(section => {
    observer.observe(section);
  });
}

async function initVisitorCounter() {
  const visitorEl = document.getElementById("visitor-count");
  if (!visitorEl) return;

  const BASE_OFFSET = 1403;
  const COUNTER_KEY = "dhananjay_portfolio_global_visitors_2026_abhi";
  const SESSION_KEY = "dhananjay_counted_session";
  const LOCAL_CACHE_KEY = "dhananjay_last_known_count";

  // Display initial cached/baseline count immediately so there is zero delay or layout jump
  const cachedCount = parseInt(localStorage.getItem(LOCAL_CACHE_KEY) || (BASE_OFFSET + 1).toString(), 10);
  visitorEl.textContent = cachedCount.toLocaleString();

  try {
    const isNewSession = !sessionStorage.getItem(SESSION_KEY);
    const endpoint = isNewSession
      ? `https://countapi.mileshilliard.com/api/v1/hit/${COUNTER_KEY}`
      : `https://countapi.mileshilliard.com/api/v1/get/${COUNTER_KEY}`;

    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    if (typeof data.value === "number") {
      const realTotal = BASE_OFFSET + data.value;
      visitorEl.textContent = realTotal.toLocaleString();
      localStorage.setItem(LOCAL_CACHE_KEY, realTotal.toString());
      if (isNewSession) {
        sessionStorage.setItem(SESSION_KEY, "true");
      }
    }
  } catch (err) {
    // Graceful offline/ad-blocker fallback: increment local cache if first visit in session
    try {
      let fallback = parseInt(localStorage.getItem(LOCAL_CACHE_KEY) || BASE_OFFSET.toString(), 10);
      if (!sessionStorage.getItem(SESSION_KEY)) {
        fallback += 1;
        localStorage.setItem(LOCAL_CACHE_KEY, fallback.toString());
        sessionStorage.setItem(SESSION_KEY, "true");
      }
      visitorEl.textContent = fallback.toLocaleString();
    } catch (e) {
      visitorEl.textContent = "1,404";
    }
  }
}

function initDevEasterEgg() {
  const banner = `%c
  ██████╗ ██╗  ██╗ █████╗ ███╗   ██╗ █████╗ ███╗   ██╗     ██╗ █████╗ ██╗   ██╗
  ██╔══██╗██║  ██║██╔══██╗████╗  ██║██╔══██╗████╗  ██║     ██║██╔══██╗╚██╗ ██╔╝
  ██║  ██║███████║███████║██╔██╗ ██║███████║██╔██╗ ██║     ██║███████║ ╚████╔╝ 
  ██║  ██║██╔══██║██╔══██║██║╚██╗██║██╔══██║██║╚██╗██║██   ██║██╔══██║  ╚██╔╝  
  ██████╔╝██║  ██║██║  ██║██║ ╚████║██║  ██║██║ ╚████║╚█████╔╝██║  ██║   ██║   
  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝   ╚═╝   
                                                                              
   🏳️‍🌈 DHANANJAY VENTURES LLC • PARODY DATING PORTFOLIO V2.0
   💅 Certified Sensitive King • CSE '28 • Day Scholar Commuter
   💖 Masterminded & Directed with love by Abhi
   ✨ Statutory Notice: All parody references are purely cinematic fun!
`;
  console.log(banner, "color: #FF007F; font-weight: bold; font-family: monospace; text-shadow: 0 0 6px rgba(255, 0, 127, 0.4);");
  console.log("%cLooking at the source code? Check out the suitor specs or DM @dhananjay_403 on Instagram! ✨", "color: #9D4EDD; font-size: 13px; font-weight: 600; padding: 4px 0;");
}

/* ==========================================================================
   11. OFFICIAL BOYFRIEND OFFER LETTER GENERATOR
   ========================================================================== */

function openOfferLetterModal(name) {
  const modal = document.getElementById("offer-letter-modal");
  if (!modal) return;

  const input = document.getElementById("offer-candidate-input");
  if (name && typeof name === "string") {
    input.value = name;
    updateOfferLetterName(name);
  } else if (!input.value) {
    updateOfferLetterName("Prospective Suitor");
  }

  // Update dynamic date
  const dateEl = document.getElementById("offer-doc-date");
  if (dateEl) {
    const now = new Date();
    const options = { year: "numeric", month: "long" };
    dateEl.textContent = `DATE: ${now.toLocaleDateString("en-US", options).toUpperCase()}`;
  }

  // Set random reference code if not set
  const refEl = document.getElementById("offer-ref-tag");
  if (refEl && !refEl.dataset.initialized) {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    refEl.textContent = `REF: DHANANJAY-HR-2026-${randomHex}`;
    refEl.dataset.initialized = "true";
  }

  modal.classList.add("active");
  document.body.classList.add("modal-open");
  if (window.lucide) lucide.createIcons();
  triggerSparkles(0.6);
}

function closeOfferLetterModal(e) {
  const modal = document.getElementById("offer-letter-modal");
  if (!e || e.target === modal || e.target.classList.contains("modal-close-btn") || e.target.closest(".modal-close-btn")) {
    if (modal) modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }
}

function updateOfferLetterName(rawVal) {
  const clean = rawVal ? rawVal.trim() : "";
  const displayName = clean || "Prospective Suitor";

  const displayEl = document.getElementById("offer-candidate-display");
  const sigCandidateEl = document.getElementById("offer-candidate-sig");
  const subCandidateEl = document.getElementById("offer-candidate-sub");

  if (displayEl) displayEl.textContent = displayName;
  if (sigCandidateEl) sigCandidateEl.textContent = displayName;
  if (subCandidateEl) subCandidateEl.textContent = displayName;
}

function copyOfferLetterText() {
  const input = document.getElementById("offer-candidate-input");
  const candidateName = (input && input.value.trim()) || "Prospective Suitor";
  const refEl = document.getElementById("offer-ref-tag");
  const refCode = (refEl && refEl.textContent) || "REF: DHANANJAY-HR-2026-X";

  const letterText = `📜 FORMAL LETTER OF ROMANTIC APPOINTMENT
Company: DHANANJAY ROMANCE VENTURES LLC
Division: Dept. of Homie Logistics & Romance Acquisitions
${refCode} | STATUS: BINDING ROMANCE IPO

Dear ${candidateName},

Following algorithmic due diligence by the Homie Council, Dhananjay Ventures LLC hereby extends this formal offer of romantic appointment for the position of:
👑 SENIOR EXECUTIVE BOYFRIEND (Chathannoor & Kollam Division)

KEY TERMS & COMPENSATION (CTC):
• 100% unconditional loyalty, zero-ghosting SLA
• Unlimited 3 AM philosophy calls on his boiling Samsung
• Guaranteed daily delivery of 47-60 unhinged Instagram reels
• Priority KSRTC fast-passenger window seat & fresh Pazhampori sharing
• Gentle emotional support during anime tears (strictly no "it's just a cartoon")
• Any sudden deployment of "let's see where it goes" triggers civil litigation in Kollam Court

Approved & Countersigned by:
— Homie Defense Council (Executive Matchmaking Directorate)
— ${candidateName} (Candidate Acceptance)

*Statutory Notice: ഈ സൈറ്റിലുള്ള കഥാപാത്രങ്ങളും പരാമർശങ്ങളും തികച്ചും സാങ്കൽപ്പികം മാത്രമാണ്. ജീവിച്ചിരിക്കുന്നവരോ മരിച്ചവരോ ആയി എന്തെങ്കിലും സാമ്യം തോന്നുന്നുണ്ടെങ്കിൽ അത് തികച്ചും യാദൃച്ഛികം മാത്രം.`;

  navigator.clipboard.writeText(letterText).then(() => {
    const btnText = document.getElementById("copy-contract-btn-text");
    if (btnText) {
      const original = btnText.textContent;
      btnText.textContent = "Contract Copied! 💅 Paste in DMs";
      setTimeout(() => {
        btnText.textContent = original;
      }, 3000);
    }
  }).catch(() => {
    alert("Contract text copied to clipboard!");
  });
}

function downloadOfferLetterPNG() {
  const input = document.getElementById("offer-candidate-input");
  const candidateName = (input && input.value.trim()) || "Prospective Suitor";
  const refEl = document.getElementById("offer-ref-tag");
  const refCode = (refEl && refEl.textContent) || "REF: DHANANJAY-HR-2026-X";

  // Create High-Res Offscreen Canvas (960 x 1320 px)
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 1320;
  const ctx = canvas.getContext("2d");

  // 1. Parchment paper background
  ctx.fillStyle = "#FCFBF7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Gold border frame
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

  // 3. Top Rainbow Foil Bar
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, "#FF007F");
  grad.addColorStop(0.25, "#FF5500");
  grad.addColorStop(0.5, "#FFCC00");
  grad.addColorStop(0.75, "#00E676");
  grad.addColorStop(1, "#9D4EDD");
  ctx.fillStyle = grad;
  ctx.fillRect(28, 28, canvas.width - 56, 10);

  // 4. Header: Company & Meta
  ctx.fillStyle = "#1D1124";
  ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("DHANANJAY ROMANCE VENTURES LLC", 60, 85);

  ctx.fillStyle = "#6C5874";
  ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Department of Homie Logistics & Romance Acquisitions", 60, 110);
  ctx.fillText("Chathannoor Regional Hub • CSE '28 Operational Unit", 60, 130);

  ctx.textAlign = "right";
  ctx.fillStyle = "#FF007F";
  ctx.font = "bold 13px ui-monospace, monospace";
  ctx.fillText(refCode, canvas.width - 60, 85);

  ctx.fillStyle = "#6C5874";
  ctx.font = "13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("STATUS: BINDING ROMANCE IPO", canvas.width - 60, 108);
  ctx.fillText("DATE: OCTOBER 2026", canvas.width - 60, 128);
  ctx.textAlign = "left";

  // 5. Divider
  ctx.fillStyle = grad;
  ctx.fillRect(60, 150, canvas.width - 120, 2);

  // 6. Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#1D1124";
  ctx.font = "bold 26px 'Bricolage Grotesque', sans-serif";
  ctx.fillText("FORMAL LETTER OF ROMANTIC APPOINTMENT", canvas.width / 2, 200);

  ctx.fillStyle = "#55445C";
  ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("SUBJECT: Formal Offer for Senior Executive Boyfriend (Chathannoor Division)", canvas.width / 2, 230);
  ctx.textAlign = "left";

  // 7. Salutation & Intro
  ctx.fillStyle = "#1D1124";
  ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Dear " + candidateName + ",", 60, 280);

  ctx.fillStyle = "#4A3A52";
  ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
  let curY = 310;
  const introText = "Following algorithmic due diligence, emotional stress-testing, and unanimous approval by the Homie Council, Dhananjay Ventures LLC is pleased to formally extend this executive appointment. You have demonstrated exemplary patience, verified dad-joke immunity, and zero situationship contamination.";
  curY = wrapCanvasText(ctx, introText, 60, curY, canvas.width - 120, 24);

  // 8. Clauses Box
  curY += 15;
  ctx.fillStyle = "rgba(255, 240, 248, 0.7)";
  ctx.fillRect(60, curY, canvas.width - 120, 420);
  ctx.strokeStyle = "#F0D9E6";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, curY, canvas.width - 120, 420);

  let clauseY = curY + 30;
  const clauses = [
    { title: "1. Designation & Reporting: ", text: "Senior Executive Boyfriend (Chathannoor & Kollam Division). Reporting directly to Dhananjay with oversight by the Homie Matchmaking Council." },
    { title: "2. Compensation (CTC): ", text: "100% unconditional loyalty, unlimited 3 AM philosophy calls on his boiling Samsung, priority KSRTC window seat sharing, and fresh Pazhampori rations." },
    { title: "3. Daily Bandwidth & Reel SLA: ", text: "Guaranteed 47-60 unhinged Instagram reels daily. Candidate agrees to maintain minimum 80% heart-react SLA within 3 hours of transmission." },
    { title: "4. Emotional Care Protocol: ", text: "During fictional anime character deaths, candidate shall supply blankets and snacks without uttering 'Bro it's just a cartoon'." },
    { title: "5. Liquidated Damages & Jurisdiction: ", text: "Any deployment of 'let's see where it goes' or ghosting constitutes incurable breach of contract, punishable by civil litigation in Kollam Court and DDoS of Spotify Wrapped." }
  ];

  clauses.forEach((cl) => {
    ctx.fillStyle = "#1D1124";
    ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(cl.title, 80, clauseY);

    ctx.fillStyle = "#44334C";
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    clauseY = wrapCanvasText(ctx, cl.text, 80, clauseY + 20, canvas.width - 160, 21);
    clauseY += 10;
  });

  // 9. Statutory Malayalam Notice
  curY += 450;
  ctx.fillStyle = "#7A6980";
  ctx.font = "italic 12px 'Manjari', sans-serif";
  ctx.fillText("*Statutory Notice: ഈ സൈറ്റിലുള്ള കഥാപാത്രങ്ങളും പരാമർശങ്ങളും തികച്ചും സാങ്കൽപ്പികം മാത്രമാണ്. ജീവിച്ചിരിക്കുന്നവരോ മരിച്ചവരോ ആയി എന്തെങ്കിലും സാമ്യം തോന്നുന്നുണ്ടെങ്കിൽ അത് തികച്ചും യാദൃച്ഛികം മാത്രം.", 60, curY);

  // 10. Signatures & Official Gold Seal
  curY += 60;
  // Homie Council Signature
  ctx.fillStyle = "#1D1124";
  ctx.font = "32px 'Caveat', cursive";
  ctx.fillText("Homie Council", 85, curY);

  ctx.strokeStyle = "#1D1124";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, curY + 8);
  ctx.lineTo(260, curY + 8);
  ctx.stroke();

  ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Homie Defense Council", 80, curY + 28);
  ctx.fillStyle = "#6C5874";
  ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Executive Matchmaking Directorate", 80, curY + 46);
  ctx.fillText("Homie Emotional Defense Board", 80, curY + 62);

  // Candidate Signature
  ctx.fillStyle = "#FF007F";
  ctx.font = "34px 'Caveat', cursive";
  ctx.fillText(candidateName, canvas.width - 240, curY);

  ctx.strokeStyle = "#1D1124";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(canvas.width - 260, curY + 8);
  ctx.lineTo(canvas.width - 80, curY + 8);
  ctx.stroke();

  ctx.fillStyle = "#1D1124";
  ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(candidateName, canvas.width - 260, curY + 28);
  ctx.fillStyle = "#6C5874";
  ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Candidate Digital Acceptance", canvas.width - 260, curY + 46);
  ctx.fillText("Countersigned via Mutual Consent", canvas.width - 260, curY + 62);

  // Circular Gold Seal in Center
  const sealX = canvas.width / 2;
  const sealY = curY + 20;
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.rotate(-0.1);
  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.fillStyle = "#FFF9E6";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 3]);
  ctx.strokeStyle = "#D4AF37";
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#B3861B";
  ctx.font = "bold 9px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("★ OFFICIAL ★", 0, -22);
  ctx.font = "900 13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("APPROVED", 0, -3);
  ctx.font = "bold 9px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("HOMIE HQ", 0, 16);
  ctx.fillText("SEAL OF ABHI", 0, 30);
  ctx.restore();

  // 11. Trigger Download
  const link = document.createElement("a");
  link.download = `Dhananjay_Boyfriend_Offer_Letter_${candidateName.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}

/* ==========================================================================
   12. 3 AM DHANANJAY AI CHATBOT CONTROLLER (GEMINI 3.5 FLASH-LITE POWERED)
   ========================================================================== */

let isChatOpen = false;
let chatHistory = [];
let isChatLoading = false;
const SESSION_CHAT_LIMIT = 10;
const CHAT_COOLDOWN_MS = 3000;

function toggleDhananjayChat() {
  const drawer = document.getElementById("chat-drawer");
  const pill = document.getElementById("chat-floating-pill");
  const badge = document.getElementById("chat-unread-badge");
  if (!drawer || !pill) return;

  isChatOpen = !isChatOpen;
  if (isChatOpen) {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    pill.classList.add("hidden-pill");
    if (badge) badge.style.display = "none";
    setTimeout(() => {
      const input = document.getElementById("chat-user-input");
      if (input && !input.disabled) input.focus();
    }, 300);
    triggerSparkles(0.4);
  } else {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    pill.classList.remove("hidden-pill");
  }

  if (window.lucide) lucide.createIcons();
}

function initChatTimestamps() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const initTimeEl = document.getElementById("chat-initial-time");
  if (initTimeEl) initTimeEl.textContent = timeStr;

  const initGreetingEl = document.getElementById("chat-initial-greeting");
  if (initGreetingEl) {
    initGreetingEl.textContent = `Hey there 👋 It's ${timeStr}, phone is running a bit warm, but here I am. What's on your mind? 🥺`;
  }

  const pillText = document.getElementById("chat-pill-text");
  if (pillText) {
    pillText.textContent = `${timeStr} AI Chat 💬`;
  }
}

function clearDhananjayChat() {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  chatHistory = [];
  sessionStorage.removeItem("dhananjay_chat_count");

  const input = document.getElementById("chat-user-input");
  if (input) {
    input.disabled = false;
    input.placeholder = "Ask Dhananjay anything...";
  }

  const sendBtn = document.getElementById("chat-send-btn");
  if (sendBtn) sendBtn.disabled = false;

  const subHeader = document.querySelector(".chat-header-sub");
  if (subHeader) subHeader.textContent = "Chathannoor Hub • Samsung Temp: 58°C 🔥";

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  container.innerHTML = `
    <div class="chat-msg chat-msg-bot">
      <div class="chat-bubble">
        <p>Chat memory wiped! 🧹 Still up here in Chathannoor at ${timeStr}. What's on your mind? 🥺</p>
        <span class="chat-msg-time">${timeStr}</span>
      </div>
    </div>
    <div class="chat-quick-chips" id="chat-quick-chips">
      <button class="quick-chip" onclick="quickSendChat('Why aren\'t you sleeping yet? 😴')">Why aren't you sleeping? 😴</button>
      <button class="quick-chip" onclick="quickSendChat('How was the KSRTC commute today? 🚌')">How's the KSRTC commute? 🚌</button>
      <button class="quick-chip" onclick="quickSendChat('Did you finish your lab code? 💻')">Did you finish lab code? 💻</button>
      <button class="quick-chip" onclick="quickSendChat('Tell me about your childhood crush Diya 🌸')">Childhood crush Diya? 🌸</button>
      <button class="quick-chip" onclick="quickSendChat('Tell me your worst dad joke 💀')">Drop a dad joke 💀</button>
    </div>
    <div class="chat-typing-indicator hidden" id="chat-typing-indicator">
      <div class="typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
      <span class="typing-text">Dhananjay is typing...</span>
    </div>
  `;
}

function quickSendChat(text) {
  const input = document.getElementById("chat-user-input");
  if (!input || input.disabled) return;
  input.value = text;
  handleChatSubmit();
}

async function handleChatSubmit(e) {
  if (e) e.preventDefault();
  if (isChatLoading) return;

  const input = document.getElementById("chat-user-input");
  const sendBtn = document.getElementById("chat-send-btn");
  if (!input || input.disabled) return;
  const userText = input.value.trim();
  if (!userText) return;

  input.value = "";
  isChatLoading = true;

  // Hide quick chips once chatting starts
  const chips = document.getElementById("chat-quick-chips");
  if (chips) chips.style.display = "none";

  // Append user message bubble
  appendChatBubble(userText, "user");

  // Show typing indicator
  const typing = document.getElementById("chat-typing-indicator");
  if (typing) typing.classList.remove("hidden");
  scrollChatToBottom();

  // GUARDRAIL 1: SESSION LIMIT CHECK (10 Messages MAX - Protects Token Quota)
  let currentMsgCount = parseInt(sessionStorage.getItem("dhananjay_chat_count") || "0", 10);
  if (currentMsgCount >= SESSION_CHAT_LIMIT) {
    setTimeout(() => {
      if (typing) typing.classList.add("hidden");
      const thermalOverloadMsg = `Hey wait! 🚨 My budget Samsung just hit 76°C! The back glass is sizzling. Battery is at 2%, and if I send one more text my mother will wake up. Slide into my Instagram DMs (@dhananjay_403) before this phone shuts down! 📱🤍<br><a href="https://www.instagram.com/dhananjay_403/" target="_blank" rel="noopener noreferrer" class="chat-dm-direct-btn">Slide into @dhananjay_403 on Insta 💌</a>`;
      appendChatBubbleHTML(thermalOverloadMsg, "bot", true);
      
      const subHeader = document.querySelector(".chat-header-sub");
      if (subHeader) subHeader.textContent = "Chathannoor Hub • Samsung Temp: 76°C 🔥 (OVERHEATED)";
      input.placeholder = "Samsung in thermal lockdown 🔥 (DM on Insta)";
      input.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
      isChatLoading = false;
      scrollChatToBottom();
    }, 750);
    return;
  }

  // Increment session count
  currentMsgCount += 1;
  sessionStorage.setItem("dhananjay_chat_count", currentMsgCount.toString());

  // GUARDRAIL 2: 3-SECOND COOLDOWN (Stops rapid Enter spamming)
  if (sendBtn) {
    sendBtn.disabled = true;
    setTimeout(() => {
      if (!input.disabled) sendBtn.disabled = false;
    }, CHAT_COOLDOWN_MS);
  }

  // Fallback replies in case of network cut
  const fallbackReplies = [
    "Phone is getting a little warm, but I'm here. Did you manage to get some rest today?",
    "Surviving the morning KSRTC bus from Chathannoor drained my social battery, honestly 🚌",
    "Someone brought up school days earlier and I remembered how convinced I was that I liked Diya back in 7th grade... before my complete gay awakening haha 🌸",
    "If someone drops 'let's see where it goes' in my DMs one more time, I'm logging off for the night 💀",
    "I'm supposed to finish my lab assignment right now, but scrolling reels is winning.",
    "Why did the computer get cold on the bus? Because it left its Windows open. Yes, my jokes are this dry 💀",
    "Pazhampori and hot chai tomorrow morning sounds heavenly right now ☕",
    "Battery is pretty low right now, but what were you saying?"
  ];

  try {
    chatHistory.push({ role: "user", text: userText });

    let botReply = "";
    const endpoints = ["/api/chat", "/.netlify/functions/chat"];
    let succeeded = false;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            history: chatHistory.slice(-6)
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.reply) {
            botReply = data.reply;
            succeeded = true;
            break;
          }
        }
      } catch (err) {
        // Fallback to next endpoint
      }
    }

    if (!succeeded) {
      await new Promise(r => setTimeout(r, 600));
      const randomIndex = Math.floor(Math.random() * fallbackReplies.length);
      botReply = fallbackReplies[randomIndex];
    }

    if (typing) typing.classList.add("hidden");
    appendChatBubble(botReply, "bot");
    chatHistory.push({ role: "assistant", text: botReply });

  } catch (err) {
    if (typing) typing.classList.add("hidden");
    const fallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    appendChatBubble(fallback, "bot");
  } finally {
    isChatLoading = false;
    scrollChatToBottom();
  }
}

function appendChatBubble(text, sender) {
  const container = document.getElementById("chat-messages-container");
  const typing = document.getElementById("chat-typing-indicator");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg chat-msg-${sender}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  msgDiv.innerHTML = `
    <div class="chat-bubble">
      <p>${escapeHTML(text)}</p>
      <span class="chat-msg-time">${timeStr}</span>
    </div>
  `;

  if (typing) {
    container.insertBefore(msgDiv, typing);
  } else {
    container.appendChild(msgDiv);
  }

  scrollChatToBottom();
}

function appendChatBubbleHTML(htmlContent, sender, isWarning) {
  const container = document.getElementById("chat-messages-container");
  const typing = document.getElementById("chat-typing-indicator");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg chat-msg-${sender}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  msgDiv.innerHTML = `
    <div class="chat-bubble ${isWarning ? 'chat-thermal-warning' : ''}">
      <p>${htmlContent}</p>
      <span class="chat-msg-time">${timeStr}</span>
    </div>
  `;

  if (typing) {
    container.insertBefore(msgDiv, typing);
  } else {
    container.appendChild(msgDiv);
  }

  scrollChatToBottom();
}

function scrollChatToBottom() {
  const container = document.getElementById("chat-messages-container");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
