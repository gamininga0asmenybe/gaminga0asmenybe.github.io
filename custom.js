
const form = document.getElementById("contactForm");

if (form) {
  const btn = document.getElementById("submitBtn");

  // Laukai
  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const emailInput = document.getElementById("email");
  const addressInput = document.getElementById("address");
  const q1Input = document.getElementById("q1");
  const q2Input = document.getElementById("q2");
  const q3Input = document.getElementById("q3");
  const phoneInput = document.getElementById("phone");

  // El. pašto regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Visi real-time tikrinami laukai (be telefono)
  const fields = [fname, lname, emailInput, addressInput, q1Input, q2Input, q3Input];

  fields.forEach(el => {
    el.addEventListener("input", validateForm);
  });

  // Telefono real-time formatavimas
  phoneInput.addEventListener("input", formatPhone);

  function formatPhone(e) {
    let v = e.target.value.replace(/\D/g, ""); // tik skaičiai

    // Pašalinam pradinį 0, jei yra (pvz. 8600...)
    if (!v.startsWith("370")) {
      if (v.startsWith("0")) v = v.substring(1);
    }

    // Pridedam šalies kodą, jei jo nėra
    if (!v.startsWith("370")) v = "370" + v;

    // Lietuvos formatas: +370 6xx xxxxx
    let f = "+370 ";

    if (v.length >= 4) f += v.charAt(3);      // 6
    if (v.length >= 5) f += v.charAt(4);      // x
    if (v.length >= 6) f += v.charAt(5);      // x

    if (v.length >= 7) f += " " + v.substring(6, 11); // xxxxx

    // Max iki +370 6xx xxxxx (14 simbolių)
    e.target.value = f.substring(0, 14);

    validateForm();
  }

  function showError(id, msg) {
    const input = document.getElementById(id);
    const error = input.parentElement.querySelector(".error-text");
    input.classList.add("error");
    error.textContent = msg;
  }

  function clearError(id) {
    const input = document.getElementById(id);
    const error = input.parentElement.querySelector(".error-text");
    input.classList.remove("error");
    error.textContent = "";
  }

  function validateForm() {
    let valid = true;

    // Vardas
    if (fname.value.trim() === "" || !/^[A-Za-zÀ-ž]+$/.test(fname.value)) {
      showError("fname", "Įvesk teisingą vardą (tik raidės)");
      valid = false;
    } else {
      clearError("fname");
    }

    // Pavardė
    if (lname.value.trim() === "" || !/^[A-Za-zÀ-ž]+$/.test(lname.value)) {
      showError("lname", "Pavardė turi būti tik iš raidžių");
      valid = false;
    } else {
      clearError("lname");
    }

    // El. paštas
    if (!emailRegex.test(emailInput.value.trim())) {
      showError("email", "Neteisingas el. pašto formatas");
      valid = false;
    } else {
      clearError("email");
    }

    // Adresas
    if (addressInput.value.trim() === "") {
      showError("address", "Įrašyk adresą");
      valid = false;
    } else {
      clearError("address");
    }

    // Įvertinimai 1–10
    ["q1", "q2", "q3"].forEach(id => {
      const val = Number(document.getElementById(id).value);
      if (val < 1 || val > 10) {
        showError(id, "Reikšmė turi būti 1–10");
        valid = false;
      } else {
        clearError(id);
      }
    });

    // Telefonas
    if (phoneInput.value.length < 14) {
      showError("phone", "Netinkamas telefono formatas");
      valid = false;
    } else {
      clearError("phone");
    }

    // Submit tik kai viskas ok
    btn.disabled = !valid;
  }

  // Submit – visi 4–6 punktai
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      vardas: fname.value,
      pavarde: lname.value,
      email: emailInput.value,
      tel: phoneInput.value,
      adresas: addressInput.value,
      q1: Number(q1Input.value),
      q2: Number(q2Input.value),
      q3: Number(q3Input.value)
    };

    const avg = ((data.q1 + data.q2 + data.q3) / 3).toFixed(1);

    // Objektas į konsolę
  
    console.log("Vidurkis:", `${data.vardas} ${data.pavarde}: ${avg}`);

    // Rezultatai apačioje (tik jei yra #results)
    const results = document.getElementById("results");
    if (results) {
      results.innerHTML = `
        <p><strong>Vardas:</strong> ${data.vardas}</p>
        <p><strong>Pavardė:</strong> ${data.pavarde}</p>
        <p><strong>El. paštas:</strong> ${data.email}</p>
        <p><strong>Tel. nr.:</strong> ${data.tel}</p>
        <p><strong>Adresas:</strong> ${data.adresas}</p>
        <p><strong>Vidurkis:</strong> ${data.vardas} ${data.pavarde}: ${avg}</p>
      `;
    }

    // Sėkmingo pateikimo pranešimas (tik jei yra #popup)
    const popup = document.getElementById("popup");
    if (popup) {
      popup.innerHTML = "Duomenys pateikti sėkmingai!";
      popup.style.display = "block";
    }
  });

  // Pradinė validacija
  validateForm();
}
