const defaultAvatarImagesMale = [
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1689147542~exp=1689148142~hmac=968c457a978184dde3bf7e364dd132ce26cc9c971ce4b08af88b46d41d18cc64",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-punk-hair-jacket_23-2149436198.jpg?t=st=1689147542~exp=1689148142~hmac=a40a3a5fa519679469892bafcd070e8cf4b3122e6a93683b541fc4b4e2a20ea3",
];

const defaultAvatarImagesFemale = [
  "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg?t=st=1689147542~exp=1689148142~hmac=65f9edd5da3657fc35500961aef09f88c450c56bdebb9abc644b0b1623c9ebe4",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2149436186.jpg?t=st=1689147542~exp=1689148142~hmac=d570c07a59b3c358cfa10d4dc0c0aac7b3ef4dd3401a9b738370eb6f040cab83",
  "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg?t=st=1689147542~exp=1689148142~hmac=33ace8f6cea231355a25b038ed4296b1195f3699e1df8be4b9aa52b5589afb63",
];

let userId = localStorage.getItem("userId");

const previousBtn = document.getElementById("previousBtn");
previousBtn.addEventListener("click", async () => {
  currentPage--;
  await fetchPeople(userId, keyword);
  updatePaginationButtons();
});

const nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", async () => {
  currentPage++;
  await fetchPeople(userId, keyword);
  updatePaginationButtons();
});

let dashboardBtn = document.getElementById("dashboard-btn");
dashboardBtn.setAttribute("href", `dashboard.html?id=${userId}`);
let people = [];
let currentPage = 1;
let keyword = "";
const PAGE_SIZE = 3;

function updatePaginationButtons() {
  previousBtn.disabled = currentPage === 1;
  nextBtn.disabled = people.length < PAGE_SIZE;
}

function addModalEventListenersAccept(friend, acceptRequestModal) {
  const acceptModalDoneBtn = document.getElementById("acceptModalDoneBtn");
  const acceptModalCancelBtn = document.getElementById("acceptModalCancelBtn");

  acceptModalDoneBtn.addEventListener("click", async () => {
    const request_id = friend.reqId;
    const URL = `http://127.0.0.1:3000/api/friends/${request_id}/accept-request`;
    try {
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log("success");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  });

  acceptModalCancelBtn.addEventListener("click", () => {
    acceptRequestModal.hide();
  });
}

function addModalEventListenersReject(friend, rejectRequestModal) {
  const rejectModalDoneBtn = document.getElementById("rejectModalDoneBtn");
  const rejectModalCancelBtn = document.getElementById("rejectModalCancelBtn");

  rejectModalDoneBtn.addEventListener("click", async () => {
    const request_id = friend.reqId;

    const URL = `http://127.0.0.1:3000/api/friends/${request_id}/reject-request`;

    try {
      const response = await fetch(URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log("success");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  });

  rejectModalCancelBtn.addEventListener("click", () => {
    rejectRequestModal.hide();
  });
}

function addModalEventListenersSend(friend, sendRequestModal) {
  const sendModalDoneBtn = document.getElementById("sendModalDoneBtn");
  const sendModalCancelBtn = document.getElementById("sendModalCancelBtn");

  sendModalDoneBtn.addEventListener("click", async () => {
    const sender_id = Number(getUrlParamters().id);
    const recipient_id = friend.id;
    const status = "";
    const data = {
      sender_id,
      recipient_id,
      status,
    };
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/api/friends/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        console.log("success");
      }
    } catch (error) {
      console.error(error);
    }
  });

  sendModalCancelBtn.addEventListener("click", () => {
    sendRequestModal.hide();
  });
}

function addModalEventListenersCancel(friend, cancelRequestModal) {
  const cancelModalDoneBtn = document.getElementById("cancelModalDoneBtn");
  const cancelModalCancelBtn = document.getElementById("cancelModalCancelBtn");

  cancelModalDoneBtn.addEventListener("click", async () => {
    const request_id = friend.reqId;
    const URL = `http://127.0.0.1:3000/api/friends/${request_id}/cancel-request`;
    try {
      const response = await fetch(URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log("success");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  });

  cancelModalCancelBtn.addEventListener("click", () => {
    cancelRequestModal.hide();
  });
}

function addModalEventListenersRemove(friend, removeFriendModal) {
  const removeFriendModalDoneBtn = document.getElementById(
    "removeFriendModalDoneBtn"
  );
  const removeFriendModalCancelBtn = document.getElementById(
    "removeFriendModalCancelBtn"
  );

  removeFriendModalDoneBtn.addEventListener("click", async () => {
    const request_id = friend.reqId;

    const URL = `http://127.0.0.1:3000/api/friends/${request_id}/remove-friend`;

    try {
      const response = await fetch(URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log("success");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  });

  removeFriendModalCancelBtn.addEventListener("click", () => {
    removeFriendModal.hide();
  });
}

async function removeFriend(friend) {
  const removeFriendModal = new bootstrap.Modal(
    document.getElementById("removeFriendModal")
  );
  removeFriendModal.show();
  addModalEventListenersRemove(friend, removeFriendModal);
}

async function addFriend(friend) {
  const sendRequestModal = new bootstrap.Modal(
    document.getElementById("sendRequestModal")
  );
  console.log(friend);
  sendRequestModal.show();
  addModalEventListenersSend(friend, sendRequestModal);
}

async function acceptFriendRequest(friend) {
  const acceptRequestModal = new bootstrap.Modal(
    document.getElementById("acceptRequestModal")
  );
  acceptRequestModal.show();
  addModalEventListenersAccept(friend, acceptRequestModal);
}

async function rejectFriendRequest(friend) {
  const rejectRequestModal = new bootstrap.Modal(
    document.getElementById("rejectRequestModal")
  );
  rejectRequestModal.show();
  addModalEventListenersReject(friend, rejectRequestModal);
}

async function cancelFriendRequest(friend) {
  const cancelRequestModal = new bootstrap.Modal(
    document.getElementById("cancelRequestModal")
  );
  cancelRequestModal.show();
  addModalEventListenersCancel(friend, cancelRequestModal);
}

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

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
  const query = document.getElementById("searchInput").value;
  keyword = query;
  currentPage = 1;
  fetchPeople(userId, keyword);
});

function getUrlParamters() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

function addFriendString(id) {
  return `<button type="button" class="btn" id="addFriendBtn${id}" style="background-color:#5D4995; color:#ffffff">Add
    Friend</button>`;
}

function recipientPendingFriendString(id) {
  return `<div class="row">
    <div class="col md-6"><button type="button" class="btn" id="acceptRequstBtn${id}" style="background-color:#5D4995; color:#ffffff; width:100%"><span class="ms-1">Accept</span></button></div>
    <div class="col md-6"><button type="button" class="btn" id="rejectRequestBtn${id}" style="color:#5D4995; border: 1px solid #5D4995; width:100%"><span class="ms-1">Reject</span></button></div>
 </div>`;
}

function senderPendingFriendString(id) {
  return `<button type="button" class="btn" id="cancelRequestBtn${id}" style="background-color:#5D4995; color:#ffffff">Cancel
    Request</button>`;
}

function acceptedFriendString(id) {
  return `<button type="button" class="btn" id="removeFriendBtn${id}" style="background-color:#5D4995; color:#ffffff">Unfriend</button>`;
}

function getActionButtons(person, index) {
  if (person.status === "PENDING") {
    if (person.sender_id.toString() === userId) {
      return senderPendingFriendString(index);
    } else if (person.recipient_id.toString() === userId) {
      return recipientPendingFriendString(index);
    }
  } else if (person.status === "ACCEPTED") {
    return acceptedFriendString(index);
  } else {
    return addFriendString(index);
  }
}

function renderPeople() {
  const friendsContiainer = document.getElementById("friendsRow");
  let templateString = "";

  if (people.length === 0) {
    templateString += `<h4 class="alert alert-danger">No suggestions found</h4>`;
    friendsContiainer.innerHTML = templateString;
  } else {
    people.forEach((person, index) => {
      templateString += `<div class="card friendItem" style="width: 18rem;">
          <img class="card-img-top userImage"
              src="${getRandomAvatar(person.gender)}"
              alt="Card image cap">
          <div class="card-body" style="text-align: center">
              <h5 class="card-title">${
                person.firstname + " " + person.lastname
              }</h5>
              ${getActionButtons(person, index)}
          </div>
      </div>`;
    });
    friendsContiainer.innerHTML = templateString;

    people.forEach((person, index) => {
      if (person.status === "PENDING") {
        if (person.sender_id.toString() === userId) {
          const cancelRequestBtn = document.getElementById(
            `cancelRequestBtn${index}`
          );
          cancelRequestBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            await cancelFriendRequest(person);
          });
        } else if (person.recipient_id.toString() === userId) {
          const acceptRequstBtn = document.getElementById(
            `acceptRequstBtn${index}`
          );
          const rejectRequestBtn = document.getElementById(
            `rejectRequestBtn${index}`
          );

          acceptRequstBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            await acceptFriendRequest(person);
          });
          rejectRequestBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            await rejectFriendRequest(person);
          });
        }
      } else if (person.status === "ACCEPTED") {
        const removeFriendBtn = document.getElementById(
          `removeFriendBtn${index}`
        );
        removeFriendBtn.addEventListener("click", async (event) => {
          event.preventDefault();
          await removeFriend(person);
        });
      } else {
        const addFriendBtn = document.getElementById(`addFriendBtn${index}`);
        addFriendBtn.addEventListener("click", async (event) => {
          event.preventDefault();
          await addFriend(person);
        });
      }
    });
  }
}

async function fetchPeople(id, query) {
  const URL = `http://localhost:3000/api/friends/${id}/search`;
  const requestBody = JSON.stringify({ keyword: query, page: currentPage });

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    const result = await response.json();
    people = result.response;
    await renderPeople();
    updatePaginationButtons();
  } catch (error) {
    alert("Something went wrong");
    console.error(error);
  }
}

fetchPeople(getUrlParamters().id, "");

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

window.addEventListener("DOMContentLoaded", () => {
  const friendRequestBtn = document.getElementById("friendRequestBtn");
  const suggestedFriendsBtn = document.getElementById("suggestedFriendsBtn");
  const peopleYouMayKnowBtn = document.getElementById("peopleYouMayKnowBtn");
  const allFriendsBtn = document.getElementById("allFriendsBtn");
  const sentRequestBtn = document.getElementById("sentRequestBtn");
  const searchPeopleBtn = document.getElementById("searchPeopleBtn");
  searchPeopleBtn.addEventListener("click", (event) => {
    window.location.href = `../client/search.html?id=${
      getUrlParamters().id
    }`;
  });
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
  sentRequestBtn.addEventListener("click", (event) => {
    window.location.href = `../client/sentRequest.html?id=${
      getUrlParamters().id
    }`;
  });
});
