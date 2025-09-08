import { apiGet, apiSend } from "./utils.js";

$(document).ready(function () {
  $("#loginBtn").click(function () {
    $("#login").show();
    $("#register").hide();
    $(".login-image").removeClass("register").addClass("login");
  });

  $("#registerBtn").click(function () {
    $("#register").show();
    $("#login").hide();
    $(".login-image").removeClass("login").addClass("register");
  });

  // ---- LOGIN ----
  $("#loginForm").on("submit", async function (event) {
    event.preventDefault();

    const email = $("#login-email").val();
    const password = $("#login-password").val();

    try {
      // Use proxy helper instead of direct XMLHttpRequest
      const response = await apiGet("/signin_action.php", { email, password });

      console.log("Login response:", response);

      const userId = response?.data?.id;
      if (!userId) {
        location.href = "login.html";
        return;
      }

      location.href = `todo.html?user_id=${userId}`;
    } catch (err) {
      console.error("Login failed:", err);
    }
  });

  // ---- SIGNUP ----
  $("#registerForm").on("submit", async function (event) {
    event.preventDefault();

    let formData = {};
    new FormData(this).forEach((value, key) => {
      formData[key] = value;
    });

    try {
      // Use proxy helper instead of raw XMLHttpRequest
      const response = await apiSend("POST", "/signup_action.php", formData);

      console.log("Signup response:", response);

      alert("Registration successful!");
      $("#login").show();
      $("#register").hide();
      $(".login-image").removeClass("register").addClass("login");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  });
});
