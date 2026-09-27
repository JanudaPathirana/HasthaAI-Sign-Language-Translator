// ======================================
// app.js - hasthaAI
// Sign Language Translator
// Fixed + 5 New Features Added
// ======================================

// --- Dictionary (10 words now) ---
var dictionary = {
  hello:  { english: "Hello",      sinhala: "ආයුබෝවන් (Ayubowan)",     emoji: "👋", sinRoman: "Ayubowan" },
  thanks: { english: "Thank You",  sinhala: "ස්තූතියි (Sthutiyi)",      emoji: "🙏", sinRoman: "Sthutiyi" },
  yes:    { english: "Yes",        sinhala: "ඔව් (Ow)",                 emoji: "✅", sinRoman: "Ow" },
  no:     { english: "No",         sinhala: "නෑ (Næ)",                  emoji: "❌", sinRoman: "Næ" },
  love:   { english: "I Love You", sinhala: "මම ආදරෙයි (Mama Adareyi)",  emoji: "❤️", sinRoman: "Mama Adareyi" },
  help:   { english: "Help",       sinhala: "උදව් (Udaw)",              emoji: "🆘", sinRoman: "Udaw" },
  sorry:  { english: "Sorry",      sinhala: "මට කනගාටුයි (Mata Kanagatuyi)", emoji: "😔", sinRoman: "Mata Kanagatuyi" },
  good:   { english: "Good",       sinhala: "හොඳයි (Hondai)",           emoji: "👍", sinRoman: "Hondai" },
  bad:    { english: "Bad",        sinhala: "නරකයි (Narakai)",          emoji: "👎", sinRoman: "Narakai" },
  water:  { english: "Water",      sinhala: "වතුර (Wathura)",           emoji: "💧", sinRoman: "Wathura" }
};

// Sign descriptions (how to do each sign)
var signDescriptions = {
  hello:  "✋ Open your hand flat and wave it side to side near your face.",
  thanks: "🙏 Place your flat hand on your chin, then move it forward.",
  yes:    "✊ Make a fist and nod it up and down (like nodding your head).",
  no:     "☝️ Extend index and middle fingers, then tap them closed like scissors.",
  love:   "🤟 Extend your thumb, index finger, and pinky — keep others folded.",
  help:   "👍 Place fist (thumb up) on open palm, then lift both hands upward.",
  sorry:  "✊ Make a fist and rub it in a circle on your chest.",
  good:   "👍 Extend your thumb upward with a closed fist.",
  bad:    "👎 Extend your thumb downward with a closed fist.",
  water:  "💧 Make a W shape with fingers, then tap your chin twice."
};

// ======================================
// FEATURE 1 FIX: Renamed from translate()
// to detectSign() — avoids browser conflict
// ======================================

// Stores last detected word for speaking
var lastDetectedKey = "";
var lastSignKey     = "";

// Translation history list
var historyList = [];

// ======================================
// FUNCTION: detectSign(word)
// Called when user clicks a sign button
// ======================================
function detectSign(word) {
  var resultBox  = document.getElementById("result-box");
  var resultText = document.getElementById("result-text");
  var speakBtn   = document.getElementById("speak-btn");
  var confWrap   = document.getElementById("conf-wrap");
  var confBar    = document.getElementById("conf-bar");
  var confLabel  = document.getElementById("conf-label");

  if (dictionary[word]) {
    var data = dictionary[word];
    lastDetectedKey = word;

    // FEATURE 1: Animated confidence bar
    var confidence = getRandomConfidence();
    confWrap.style.display = "flex";
    confBar.style.width = "0%";
    confLabel.textContent = "0%";

    // Animate bar filling up
    setTimeout(function() {
      confBar.style.width = confidence + "%";
      confLabel.textContent = confidence + "%";
      // Change bar colour based on confidence
      if (confidence >= 90) {
        confBar.style.backgroundColor = "#06d6a0"; // green
      } else if (confidence >= 80) {
        confBar.style.backgroundColor = "#ffd166"; // yellow
      } else {
        confBar.style.backgroundColor = "#ef476f"; // red
      }
    }, 100);

    // Show translation result
    resultText.innerHTML =
      "<strong>Sign Detected:</strong> " + data.emoji + "<br/><br/>" +
      "<strong>English:</strong> " + data.english + "<br/>" +
      "<strong>Sinhala:</strong> " + data.sinhala + "<br/><br/>" +
      "<em>✅ AI Confidence: " + confidence + "%</em>";

    resultBox.style.borderColor = "#06d6a0";
    speakBtn.disabled = false;

    // FEATURE 4: Add to history
    addToHistory(data.emoji, data.english, data.sinhala);

  } else {
    resultText.innerHTML = "❌ Word not found.";
    speakBtn.disabled = true;
  }
}

// ======================================
// FUNCTION: speakWord()
// Speaks the English translation
// ======================================
function speakWord() {
  if (lastDetectedKey === "") return;
  var text = dictionary[lastDetectedKey].english;
  speak(text, "en-US");
}

// ======================================
// FUNCTION: clearResult()
// Clears the result box
// ======================================
function clearResult() {
  document.getElementById("result-text").innerHTML = "Click a sign button above to see the translation.";
  document.getElementById("result-box").style.borderColor = "#4361ee";
  document.getElementById("speak-btn").disabled = true;
  document.getElementById("conf-wrap").style.display = "none";
  lastDetectedKey = "";
}

// ======================================
// FUNCTION: showSign()
// Shows sign description for typed word
// ======================================
function showSign() {
  var input    = document.getElementById("text-input").value;
  var signText = document.getElementById("sign-text");
  var speakEngBtn = document.getElementById("speak-english-btn");
  var speakSinBtn = document.getElementById("speak-sinhala-btn");

  var word  = input.toLowerCase().trim();
  var found = false;

  for (var key in dictionary) {
    if (key === word || dictionary[key].english.toLowerCase() === word) {
      var data = dictionary[key];
      lastSignKey = key;
      signText.innerHTML =
        "<strong>Sign for:</strong> " + data.emoji + " " + data.english + "<br/><br/>" +
        "<strong>How to do it:</strong><br/>" + signDescriptions[key] + "<br/><br/>" +
        "<strong>Sinhala:</strong> " + data.sinhala;
      speakEngBtn.disabled = false;
      speakSinBtn.disabled = false;
      found = true;
      break;
    }
  }

  if (!found) {
    signText.innerHTML =
      "❌ <strong>\"" + input + "\"</strong> not found.<br/>" +
      "Try: hello, yes, no, thanks, love, help, sorry, good, bad, water";
    speakEngBtn.disabled = true;
    speakSinBtn.disabled = true;
    lastSignKey = "";
  }
}

// Allow pressing Enter key in text input
document.getElementById("text-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") { showSign(); }
});

// ======================================
// FEATURE 2: Speak English & Sinhala
// ======================================
function speakSignEnglish() {
  if (lastSignKey === "") return;
  speak(dictionary[lastSignKey].english, "en-US");
}

function speakSignSinhala() {
  if (lastSignKey === "") return;
  // Speak the romanised version since Sinhala TTS may not be available
  speak(dictionary[lastSignKey].sinRoman, "en-US");
}

// Shared speak helper function
function speak(text, lang) {
  window.speechSynthesis.cancel(); // stop any current speech first
  var speech = new SpeechSynthesisUtterance(text);
  speech.lang = lang;
  speech.rate = 0.85;
  window.speechSynthesis.speak(speech);
}

// ======================================
// FEATURE 3: Quiz Game
// ======================================
var quizScore   = 0;
var quizTotal   = 0;
var quizAnswer  = "";

function startQuiz() {
  // Pick a random word
  var keys = Object.keys(dictionary);
  var randomKey = keys[Math.floor(Math.random() * keys.length)];
  quizAnswer = randomKey;

  var desc = signDescriptions[randomKey];
  document.getElementById("quiz-question").innerHTML =
    "<strong>What word does this sign represent?</strong><br/><br/>" +
    "<em>" + desc + "</em>";

  // Generate 4 options (1 correct + 3 wrong)
  var options = [randomKey];
  while (options.length < 4) {
    var rand = keys[Math.floor(Math.random() * keys.length)];
    if (!options.includes(rand)) options.push(rand);
  }

  // Shuffle options
  options.sort(function() { return Math.random() - 0.5; });

  // Show buttons
  var optionsDiv = document.getElementById("quiz-options");
  optionsDiv.innerHTML = "";
  options.forEach(function(opt) {
    var btn = document.createElement("button");
    btn.className = "quiz-btn";
    btn.textContent = dictionary[opt].emoji + " " + dictionary[opt].english;
    btn.onclick = function() { checkAnswer(opt); };
    optionsDiv.appendChild(btn);
  });

  document.getElementById("quiz-feedback").textContent = "";
}

function checkAnswer(selected) {
  quizTotal++;
  var feedback = document.getElementById("quiz-feedback");

  if (selected === quizAnswer) {
    quizScore++;
    feedback.textContent = "✅ Correct! Well done!";
    feedback.style.color = "#06d6a0";
  } else {
    feedback.textContent = "❌ Wrong! The answer was: " + dictionary[quizAnswer].english;
    feedback.style.color = "#ef476f";
  }

  document.getElementById("quiz-score").textContent =
    "Score: " + quizScore + " / " + quizTotal;

  // Load next question after 1.5 seconds
  setTimeout(startQuiz, 1800);
}

// ======================================
// FEATURE 4: Translation History
// ======================================
function addToHistory(emoji, english, sinhala) {
  var now = new Date();
  var time = now.toLocaleTimeString();

  historyList.unshift({ emoji: emoji, english: english, sinhala: sinhala, time: time });

  // Keep only last 10
  if (historyList.length > 10) historyList.pop();

  renderHistory();
}

function renderHistory() {
  var histDiv = document.getElementById("history-list");

  if (historyList.length === 0) {
    histDiv.innerHTML = "<p style='color:#888;'>No translations yet.</p>";
    return;
  }

  var html = "";
  historyList.forEach(function(item) {
    html +=
      "<div class='history-item'>" +
        "<span class='hist-emoji'>" + item.emoji + "</span>" +
        "<span><strong>" + item.english + "</strong> — " + item.sinhala + "</span>" +
        "<span class='hist-time'>" + item.time + "</span>" +
      "</div>";
  });
  histDiv.innerHTML = html;
}

function clearHistory() {
  historyList = [];
  renderHistory();
}

// ======================================
// FEATURE 5: Dark Mode Toggle
// (button added dynamically to header)
// ======================================
var darkMode = false;

// Add dark mode button to header
window.onload = function() {
  var header = document.querySelector(".header");
  var dmBtn  = document.createElement("button");
  dmBtn.id        = "dark-mode-btn";
  dmBtn.textContent = "🌙 Dark Mode";
  dmBtn.onclick   = toggleDarkMode;
  header.appendChild(dmBtn);
};

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
  document.getElementById("dark-mode-btn").textContent = darkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// ======================================
// HELPER: getRandomConfidence()
// Simulates an AI confidence score (82–97)
// ======================================
function getRandomConfidence() {
  return Math.floor(Math.random() * 16) + 82;
}
