const defaultAvatarImagesMale = [
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1689147542~exp=1689148142~hmac=968c457a978184dde3bf7e364dd132ce26cc9c971ce4b08af88b46d41d18cc64",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-punk-hair-jacket_23-2149436198.jpg?t=st=1689147542~exp=1689148142~hmac=a40a3a5fa519679469892bafcd070e8cf4b3122e6a93683b541fc4b4e2a20ea3",
];

const defaultAvatarImagesFemale = [
  "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg?t=st=1689147542~exp=1689148142~hmac=65f9edd5da3657fc35500961aef09f88c450c56bdebb9abc644b0b1623c9ebe4",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2149436186.jpg?t=st=1689147542~exp=1689148142~hmac=d570c07a59b3c358cfa10d4dc0c0aac7b3ef4dd3401a9b738370eb6f040cab83",
  "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg?t=st=1689147542~exp=1689148142~hmac=33ace8f6cea231355a25b038ed4296b1195f3699e1df8be4b9aa52b5589afb63",
];

function getRandomAvatar(gender) {
  if (gender == "Male") {
    return defaultAvatarImagesMale[
      Math.floor(Math.random() * defaultAvatarImagesMale.length)
    ];
  } else {
    return defaultAvatarImagesFemale[
      Math.floor(Math.random() * defaultAvatarImagesFemale.length)
    ];
  }
}

let userId = localStorage.getItem("userId");

let dashboardBtn = document.getElementById("dashboard-btn");
dashboardBtn.setAttribute("href", `dashboard.html?id=${userId}`);

function getUrlParamters() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

let friends = [];

function renderFriends() {
  const friendsContiainer = document.getElementById("friendsRow");
  let templateString = "";

  if (friends.length === 0) {
    templateString += `<h4 class="alert alert-danger">No suggestions found</h4>`;
    friendsContiainer.innerHTML = templateString;
  } else {
    friends.forEach((friend, index) => {
      templateString += `<div class="card friendItem" style="width: 18rem;">
        <img class="card-img-top userImage"
            src="${getRandomAvatar(friend.gender)}"
            alt="Card image cap">
        <div class="card-body" style="text-align: center">
            <h5 class="card-title">${
              friend.firstname + " " + friend.lastname
            }</h5>
            <p class="card-text">
            Hobbies<br>
            ${friend.hobbies
              .map(
                (hobby) =>
                  `<button style="background-color: #483387;border: none;border-radius: 10px;color:#ffffff">${hobby.name}</button>`
              )
              .join(" ")}
          </p>
        </div>
    </div>`;
    });
    friendsContiainer.innerHTML = templateString;
  }
}

async function fetchAllFriends(id) {
  const URL = `http://localhost:3000/api/friends/${id}`;
  try {
    const response = await fetch(URL);
    const result = await response.json();
    friends = result.response;
    await renderFriends();
  } catch (error) {
    alert("Something went wrong");
    console.error(error);
  }
}

fetchAllFriends(getUrlParamters().id);

window.addEventListener("DOMContentLoaded", () => {
  const friendRequestBtn = document.getElementById("friendRequestBtn");
  const suggestedFriendsBtn = document.getElementById("suggestedFriendsBtn");
  const peopleYouMayKnowBtn = document.getElementById("peopleYouMayKnowBtn");
  const allFriendsBtn = document.getElementById("allFriendsBtn");
  const searchPeopleBtn = document.getElementById("searchPeopleBtn");
  const sentRequestBtn = document.getElementById("sentRequestBtn");
  friendRequestBtn.addEventListener("click", (event) => {
    window.location.href = `../client/friendRequest.html?id=${
      getUrlParamters().id
    }`;
  });
  suggestedFriendsBtn.addEventListener("click", (event) => {
    window.location.href = `../client/friends.html?id=${getUrlParamters().id}`;
  });
  peopleYouMayKnowBtn.addEventListener("click", (event) => {
    window.location.href = `../client/peopleYouMayKnow.html?id=${
      getUrlParamters().id
    }`;
  });
  allFriendsBtn.addEventListener("click", (event) => {
    window.location.href = `../client/allFriends.html?id=${
      getUrlParamters().id
    }`;
  });
  searchPeopleBtn.addEventListener("click", (event) => {
    window.location.href = `../client/search.html?id=${
      getUrlParamters().id
    }`;
  });
  sentRequestBtn.addEventListener("click", (event) => {
    window.location.href = `../client/sentRequest.html?id=${
      getUrlParamters().id
    }`;
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
