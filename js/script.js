// Menunggu sampai seluruh HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     HELPER VALIDATION
  ========================= */

  function isValidEmail(email) {
    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
    return pattern.test(email);
  }

  /* =========================
     REGISTER
  ========================= */

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!username || !email || !password || !confirmPassword) {
        alert("Semua field wajib diisi!");
        return;
      }

      if (!isValidEmail(email)) {
        alert("Format email tidak valid!");
        return;
      }

      if (password.length < 6) {
        alert("Password minimal 6 karakter!");
        return;
      }

      if (password !== confirmPassword) {
        alert("Password tidak sama!");
        return;
      }

      const userData = {
        username: username,
        email: email,
        password: password
      };

      localStorage.setItem("assistbroUser", JSON.stringify(userData));

      alert("Register berhasil! Silakan login.");
      registerForm.reset();
      window.location.href = "login.html";
    });
  }

  /* =========================
     LOGIN
  ========================= */

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      if (!email || !password) {
        alert("Email dan password wajib diisi!");
        return;
      }

      if (!isValidEmail(email)) {
        alert("Format email tidak valid!");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("assistbroUser"));

      if (!storedUser) {
        alert("Belum ada akun terdaftar!");
        return;
      }

      if (email === storedUser.email && password === storedUser.password) {
        alert("Login berhasil! Selamat datang, " + storedUser.username + " 🎉");
        window.location.href = "index.html";
      } else {
        alert("Email atau password salah!");
      }
    });
  }

  /* =========================
     CONTACT
  ========================= */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        alert("Semua field harus diisi!");
        return;
      }

      if (!isValidEmail(email)) {
        alert("Format email tidak valid!");
        return;
      }

      alert("Pesan berhasil dikirim! 🎉");
      contactForm.reset();
    });
  }

  /* =========================
     KALKULATOR ESTIMASI HARGA
  ========================= */

  const serviceSelect = document.getElementById("serviceSelect");
  const workDays = document.getElementById("workDays");
  const result = document.getElementById("result");

  if (serviceSelect && workDays && result) {

    window.calculatePrice = function () {
      const servicePrice = parseInt(serviceSelect.value);
      const days = parseInt(workDays.value);

      if (!days || days <= 0) {
        result.innerText = "Masukkan jumlah hari yang valid!";
        return;
      }

      const total = servicePrice * days;

      result.innerText =
        "Total Estimasi: Rp " + total.toLocaleString("id-ID");
    };

  }

});
