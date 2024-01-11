window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");
  fetch(`http://127.0.0.1:3000/api/users/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.response) {
        const user = data.response;
        const userName = `${user.firstname} ${user.lastname}`;

        localStorage.setItem("gender", user.gender);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userImage", user.image_url);

        let userImage = document.getElementById("userImage");
        userImage.setAttribute("src", `${user.image_url}`);
        userImage.classList.add("user-image");

        const nameElement = document.getElementById("userFirstName");
        const fullNameElement = document.getElementById("userName");
        nameElement.textContent = `${user.firstname}`;
        fullNameElement.textContent = userName;
      } else {
        const errorMessage = "User not found";
        alert(errorMessage);
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
});

export function isLoggedIn() {
  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken = parseJwt(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp && decodedToken.exp > currentTime) {
      return true;
    } else {
      return false;
    }
  }

  return false;
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", logout);

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("gender");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userImage");
  window.location.href = "login.html";
}

const hobbyScoutCard = document.getElementById("hobbyScoutCard");
hobbyScoutCard.addEventListener("click", navigateTohobbyScout);

function navigateTohobbyScout() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");
  window.location.href = `friends.html?id=${userId}`;
}

const projectMateCard = document.getElementById("projectMateCard");
projectMateCard.addEventListener("click", navigateToProjectMate);

function navigateToProjectMate() {
  window.location.href = "projectMate.html";
}

const collabHubCard = document.getElementById("collabHubCard");
collabHubCard.addEventListener("click", navigateToCollabHub);

function navigateToCollabHub() {
  window.location.href = "colab-hub.html";
}
