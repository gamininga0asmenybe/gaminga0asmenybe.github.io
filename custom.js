// ========================
// Kontaktų forma
// ========================
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const submitBtn = document.getElementById("submitBtn");
  const popup = document.getElementById("popup");
  const resultsDiv = document.getElementById("results");

  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const emailInput = document.getElementById("email");
  const addressInput = document.getElementById("address");
  const q1Input = document.getElementById("q1");
  const q2Input = document.getElementById("q2");
  const q3Input = document.getElementById("q3");
  const phoneInput = document.getElementById("phone");

  const formFields = [
    fname,
    lname,
    emailInput,
    addressInput,
    phoneInput,
    q1Input,
    q2Input,
    q3Input,
  ].filter(Boolean);

  function setError(input, message) {
    if (!input) return;
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("error-text")) {
      errorDiv.textContent = message || "";
    }
  }

  function clearGlobalMessage() {
    if (popup) {
      popup.style.display = "none";
      popup.textContent = "";
    }
  }

  function validateField(input) {
    if (!input) return true;

    const value = input.value.trim();
    const id = input.id;
    let valid = true;
    let message = "";

    if (!value) {
      message = "Šis laukas privalomas.";
      valid = false;
    } else {
      if (id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          message = "Įveskite teisingą el. pašto adresą.";
          valid = false;
        }
      } else if (id === "phone") {
        const digits = value.replace(/\D/g, "");
        if (digits.length < 8) {
          message = "Įveskite teisingą telefono numerį.";
          valid = false;
        }
      } else if (id === "q1" || id === "q3") {
        const num = Number(value);
        if (Number.isNaN(num) || num < 1 || num > 10) {
          message = "Reikšmė turi būti nuo 1 iki 10.";
          valid = false;
        }
      } else if (id === "q2") {
        if (value.length < 10) {
          message = "Atsakymas turi būti bent 10 simbolių.";
          valid = false;
        }
      }
    }

    setError(input, message);
    return valid;
  }

  function validateForm() {
    let isValid = true;

    formFields.forEach((field) => {
      const fieldValid = validateField(field);
      if (!fieldValid) {
        isValid = false;
      }
    });

    if (submitBtn) {
      submitBtn.disabled = !isValid;
    }

    return isValid;
  }

  formFields.forEach((field) => {
    field.addEventListener("input", () => {
      clearGlobalMessage();
      validateField(field);
      validateForm();
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearGlobalMessage();

    if (!validateForm()) {
      if (popup) {
        popup.textContent = "Pataisykite klaidas formoje.";
        popup.style.display = "block";
      }
      return;
    }

    const submittedData = {
      fname: fname ? fname.value.trim() : "",
      lname: lname ? lname.value.trim() : "",
      email: emailInput ? emailInput.value.trim() : "",
      address: addressInput ? addressInput.value.trim() : "",
      phone: phoneInput ? phoneInput.value.trim() : "",
      q1: q1Input ? q1Input.value.trim() : "",
      q2: q2Input ? q2Input.value.trim() : "",
      q3: q3Input ? q3Input.value.trim() : "",
    };

    if (popup) {
      popup.textContent = "Duomenys pateikti sėkmingai!";
      popup.style.display = "block";
    }

    if (resultsDiv) {
      resultsDiv.innerHTML = `
        <h4>Jūsų pateikti duomenys</h4>
        <ul>
          <li>Vardas: ${submittedData.fname}</li>
          <li>Pavardė: ${submittedData.lname}</li>
          <li>El. paštas: ${submittedData.email}</li>
          <li>Adresas: ${submittedData.address}</li>
          <li>Telefonas: ${submittedData.phone}</li>
          <li>Bendras pasitenkinimas: ${submittedData.q1}</li>
          <li>Atsiliepimas: ${submittedData.q2}</li>
          <li>Ar rekomenduotumėte: ${submittedData.q3}</li>
        </ul>
      `;
    }

    contactForm.reset();
    formFields.forEach((field) => setError(field, ""));
    if (submitBtn) {
      submitBtn.disabled = true;
    }
  });

  validateForm();
}

// ========================
// Atminties kortelių žaidimas
// ========================
const gameBoard = document.getElementById("gameBoard");
const gameDifficultySelect = document.getElementById("gameDifficulty");
const gameStartBtn = document.getElementById("gameStartBtn");
const gameResetBtn = document.getElementById("gameResetBtn");
const movesCountSpan = document.getElementById("movesCount");
const matchesCountSpan = document.getElementById("matchesCount");
const totalPairsSpan = document.getElementById("totalPairs");
const timerSpan = document.getElementById("timer");
const bestEasySpan = document.getElementById("bestEasy");
const bestHardSpan = document.getElementById("bestHard");
const gameMessageDiv = document.getElementById("gameMessage");

if (
  gameBoard &&
  gameDifficultySelect &&
  gameStartBtn &&
  gameResetBtn &&
  movesCountSpan &&
  matchesCountSpan &&
  totalPairsSpan &&
  timerSpan
) {
  // 6+ unikalūs elementai – iš viso 12, kad tiktų ir 4x3, ir 6x4
  const CARD_DATA = [
    { id: "heart", iconClass: "bi bi-heart-fill" },
    { id: "star", iconClass: "bi bi-star-fill" },
    { id: "music", iconClass: "bi bi-music-note-beamed" },
    { id: "controller", iconClass: "bi bi-controller" },
    { id: "camera", iconClass: "bi bi-camera-fill" },
    { id: "palette", iconClass: "bi bi-palette-fill" },
    { id: "moon", iconClass: "bi bi-moon-stars-fill" },
    { id: "sun", iconClass: "bi bi-sun-fill" },
    { id: "cloud", iconClass: "bi bi-cloud-fill" },
    { id: "lightning", iconClass: "bi bi-lightning-charge-fill" },
    { id: "coffee", iconClass: "bi bi-cup-hot-fill" },
    { id: "book", iconClass: "bi bi-book-fill" },
  ];

  const BEST_KEYS = {
    easy: "memoryGame_best_easy",
    hard: "memoryGame_best_hard",
  };

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let totalPairs = 0;
  let timerSeconds = 0;
  let timerInterval = null;
  let gameActive = false;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function updateStats() {
    movesCountSpan.textContent = String(moves);
    matchesCountSpan.textContent = String(matches);
    totalPairsSpan.textContent = String(totalPairs);
  }

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function updateTimer() {
    timerSpan.textContent = formatTime(timerSeconds);
  }

  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerSeconds = 0;
    updateTimer();
  }

  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerSeconds = 0;
    updateTimer();

    timerInterval = setInterval(() => {
      timerSeconds += 1;
      updateTimer();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function setGameMessage(text, type) {
    if (!gameMessageDiv) return;
    gameMessageDiv.textContent = text || "";
    gameMessageDiv.classList.remove("win", "info");
    if (type) {
      gameMessageDiv.classList.add(type);
    }
  }

  function loadBestResults() {
    if (!bestEasySpan || !bestHardSpan) return;
    const easyBest = localStorage.getItem(BEST_KEYS.easy);
    const hardBest = localStorage.getItem(BEST_KEYS.hard);
    bestEasySpan.textContent = easyBest ? easyBest : "-";
    bestHardSpan.textContent = hardBest ? hardBest : "-";
  }

  function updateBestResult() {
    const difficulty = gameDifficultySelect.value === "hard" ? "hard" : "easy";
    const key = BEST_KEYS[difficulty];
    const currentBest = localStorage.getItem(key);

    if (!currentBest || moves < Number(currentBest)) {
      localStorage.setItem(key, String(moves));
      loadBestResults();
    }
  }

  // Dinamiškai sugeneruojame kortelių lentą pagal pasirinkta sudėtingumą
  function buildBoard() {
    const difficulty = gameDifficultySelect.value === "hard" ? "hard" : "easy";
    const pairsCount = difficulty === "easy" ? 6 : 12;

    totalPairs = pairsCount;
    moves = 0;
    matches = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    gameActive = false;

    updateStats();

    gameBoard.innerHTML = "";
    gameBoard.classList.remove("easy", "hard");
    gameBoard.classList.add(difficulty === "easy" ? "easy" : "hard");

    const selectedCards = CARD_DATA.slice(0, pairsCount);
    const deck = [...selectedCards, ...selectedCards];
    shuffle(deck);

    deck.forEach((item) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.id = item.id;

      const inner = document.createElement("div");
      inner.className = "memory-card-inner";

      const front = document.createElement("div");
      front.className = "memory-card-front";

      const back = document.createElement("div");
      back.className = "memory-card-back";
      back.innerHTML = `<i class="${item.iconClass}"></i>`;

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      card.addEventListener("click", () => handleCardClick(card));

      gameBoard.appendChild(card);
    });
  }

  function handleCardClick(card) {
    if (!gameActive) return;
    if (lockBoard) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) {
      return;
    }

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves += 1;
    updateStats();

    if (firstCard.dataset.id === secondCard.dataset.id) {
      handleMatch();
    } else {
      handleMismatch();
    }
  }

  function handleMatch() {
    if (!firstCard || !secondCard) return;

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matches += 1;
    updateStats();

    firstCard = null;
    secondCard = null;

    if (matches === totalPairs) {
      gameActive = false;
      stopTimer();
      setGameMessage("Laimėjote!", "win");
      updateBestResult();
    }
  }

  function handleMismatch() {
    if (!firstCard || !secondCard) return;

    lockBoard = true;

    setTimeout(() => {
      if (firstCard) {
        firstCard.classList.remove("flipped");
      }
      if (secondCard) {
        secondCard.classList.remove("flipped");
      }

      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }

  function startNewGame() {
    buildBoard();
    resetTimer();
    startTimer();
    gameActive = true;
    setGameMessage("Žaidimas pradėtas!", "info");
  }

  gameStartBtn.addEventListener("click", () => {
    startNewGame();
  });

  gameResetBtn.addEventListener("click", () => {
    startNewGame();
  });

  gameDifficultySelect.addEventListener("change", () => {
    buildBoard();
    resetTimer();
    setGameMessage('Pasirinktas naujas sudėtingumo lygis. Spauskite "Start".', "info");
  });

  // Inicializacija: užkrauna lentą ir geriausius rezultatus
  loadBestResults();
  buildBoard();
  resetTimer();
  setGameMessage('Pasirinkite sudėtingumo lygį ir spauskite "Start".', "info");
}
