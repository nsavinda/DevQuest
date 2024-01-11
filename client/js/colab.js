let userId = localStorage.getItem("userId");

let dashboardBtn = document.getElementById("dashboard-btn");
dashboardBtn.setAttribute("href", `dashboard.html?id=${userId}`);

//Collaboration Space
var whiteBoardCanvas;
var sharedDocsViewList;
var selectedGroup;
var apiURL = "http://127.0.0.1:3000";

const sidebar = document.querySelector(".sidebar");

// Add a click event listener to the sidebar
sidebar.addEventListener("click", function (event) {
  // Check if the clicked element is a link inside a .singleSideBarItem div
  const clickedLink = event.target.closest(".singleSideBarItem a");
  if (clickedLink) {
    // Remove the 'selectedSideBarItem' class from all links' parent divs
    const allLinks = document.querySelectorAll(".singleSideBarItem a");
    allLinks.forEach((link) => {
      link.parentElement.classList.remove("selectedSideBarItem");
    });
    // Add the 'selectedSideBarItem' class to the clicked link's parent div
    clickedLink.parentElement.classList.add("selectedSideBarItem");
  }
});

$(document).ready(function () {
  addEventSearchGroupInput();
  $("#btnSaveCreateGroup").click(async function (e) {
    e.preventDefault();
    let group_name = $("#txtGroupName").val(),
      group_desc = $("#txtGroupDesc").val();
    let data = { group_name, group_desc };
    let responseId = await saveNewGroup(data);
    await updateUserGroupStatus(responseId);
  });
});

// Group Search & Retrieve
async function searchGroupsByKeyword(keyword) {
  try {
    const response = await fetch(
      `${apiURL}/api/groups/keywordsearch/${keyword}`
    );

    if (response.ok) {
      return response.json();
    } else if (response.status === 403) {
      throw new Error("Invalid User Id");
    } else if (response.status === 404) {
      throw new Error("Invalid User Id");
    } else {
      throw new Error("An error occurred");
    }
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

async function saveNewGroup(data) {
  //-1 means no id found
  return await fetch(`${apiURL}/api/groups/addNewGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        return data.response;
      } else {
        alert("Something went wrong! Group may already exists.");
        return -1;
      }
    });
}

async function updateUserGroupStatus(group_id) {
  //let user_id = 4; //Default for testing , production can use localStorage for actual user id retrieval

  if (typeof group_id === "number") {
    let data = { group_id, user_id: parseInt(userId) };
    const response = await fetch(`${apiURL}/api/groups/addUserIntoGroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.response == "number") {
          alert("User added to group successfully!");
        } else {
          alert("Error - User may have already joined this group.");
        }
      });
  }
}

//  Join Group Feature
async function joinUserToGroup(group_id) {
  await updateUserGroupStatus(group_id);
}

// Chat/Messaging
function addChatBoxToCoLabSpace() {}

function sendMessageToChat() {}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

async function addEventSearchGroupInput() {
  $("#btnSearchGroup").on("click", async function (e) {
    const fetchResponse = await searchGroupsByKeyword(
      $("#txtSearchGroup").val()
    );
    $(".groupSearchResultList").empty();
    if (fetchResponse.response.length > 0) {
      let response = fetchResponse.response;
      for (let i = 0; i < response.length; i++) {
        createGroupBox(response[i]);
      }
    } else {
      $(".groupSearchResultList").append(
        "No groups found with keyword provided."
      );
    }
  });
}

function createGroupBox(data) {
  // name,description,hobbies,capacity

  let id = data.id,
    name = data.name,
    description = data.description,
    hobbies = data.hobbies,
    capacity = data.capacity;

  let html =
    '<div class="col">' +
    '<div class="colab-card card h-100">' +
    '<div class="card-body h-100">' +
    `<h5 class=\"card-title\">${name}</h5>` +
    `<p class="card-text">${description}</p></div>` +
    ` <div class="card-footer">` +
    `<div class=\"d-flex card-body justify-content-center\"><a href=\"#\" onclick=\"joinUserToGroup(${id})\" class=\"btn btn-primary\">Join Group</a></div>` +
    `<small class="text-body-secondary">${capacity} people joined this group</small>` +
    "</div></div></div>";
  $(".groupSearchResultList").append(html);
}

async function loadJoinedGroup() {
  this.event.preventDefault();
  // let userId = 4;
  let fetchResponse = await findJoinedGroup(userId);
  let response = fetchResponse.response;
  $(".joinedGroupSearchResultList").empty();
  if (response.length > 0) {
    for (let i = 0; i < response.length; i++) {
      createJoinedGroupBox(response[i]);
    }
  } else {
    $(".joinedGroupSearchResultList").append("You have not joined any groups.");
  }
}

async function findJoinedGroup(userId) {
  this.event.preventDefault();
  try {
    let user_id = parseInt(userId);
    let response = await fetch(`${apiURL}/api/groups/${user_id}`);

    if (response.ok) {
      return response.json();
    } else if (response.status === 403) {
      throw new Error("Invalid User Id");
    } else if (response.status === 404) {
      throw new Error("Invalid User Id");
    } else {
      throw new Error("An error occurred");
    }
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

function createJoinedGroupBox(data) {
  // name,description,hobbies,capacity

  let name = data.name,
    description = data.description,
    hobbies = data.hobbies,
    capacity = data.capacity;

  let html =
    '<div class="col">' +
    '<div class="colab-card card h-100">' +
    '<div class="card-body h-100">' +
    `<h5 class=\"card-title\">${name}</h5>` +
    `<p class="card-text">${description}</p></div>` +
    ` <div class="card-footer">` +
    '<div class="d-flex card-body justify-content-center"><a href="#" class="btn btn-primary">View Group</a></div>' +
    "</div></div></div>";
  $(".joinedGroupSearchResultList").append(html);
}

async function loadJoinedGroupWhiteBoard() {
  // let userId = 4;
  let fetchResponse = await findJoinedGroup(userId);
  let response = fetchResponse.response;
  $(".whiteboardDropdownList").empty();
  if (response.length > 0) {
    for (let i = 0; i < response.length; i++) {
      createWhiteBoardDropdownLink(response[i]);
    }
  } else {
    $(".whiteboardDropdownList").append(
      '<li><a class="dropdown-item disabled">No Groups Found</a></li>'
    );
  }
}

function createWhiteBoardDropdownLink(data) {
  let name = data.name,
    group_id = data.id;
  let html = ` <li><a class="dropdown-item" href="#" onclick="loadWhiteBoard(${group_id},'${name}')">${name}</a></li>`;
  $(".whiteboardDropdownList").append(html);
}

async function loadWhiteBoard(group_id, name) {
  localStorage.setItem("group_idSelected", group_id);
  $("#whiteBoardTitle").empty();
  $("#whiteBoardTitle").append(" - ", name);
  let canvasWidth = 640,
    canvasHeight = 360;

  $("#colabCanvasContainer").addClass("d-block");
  $("#colabCanvasContainer").removeClass("d-none");

  // Reset Fabric Canvas
  if (whiteBoardCanvas != null) {
    whiteBoardCanvas.dispose();
  }
  // Fetch WhiteBoard content
  const whiteBoardDataResponse = await loadWhiteBoardData();
  const jsonString =
    whiteBoardDataResponse.response.length > 0
      ? whiteBoardDataResponse.response[0].whiteboard_json
      : "{}";
  let jsonData = JSON.parse(jsonString);
  // Render WhiteBoard

  whiteBoardCanvas = new fabric.Canvas("colabCanvas", {
    width: canvasWidth,
    height: canvasHeight,
  });
  if (jsonData) {
    whiteBoardCanvas.loadFromJSON(
      jsonData,
      function () {
        whiteBoardCanvas.renderAll();
      },
      function (o, object) {}
    );
  }
}

async function loadJoinedGroupSharedDocs() {
  this.event.preventDefault();
  let fetchResponse = await findJoinedGroup(userId);
  response = fetchResponse.response;
  $(".sharedDocsDropdownList").empty();
  if (response.length > 0) {
    for (let i = 0; i < response.length; i++) {
      createSharedDocsDropdownLink(response[i]);
    }
  } else {
    $(".sharedDocsDropdownList").append(
      '<li><a class="dropdown-item disabled">No Groups Found</a></li>'
    );
  }
}

function createSharedDocsDropdownLink(data) {
  let name = data.name,
    group_id = data.id;
  let html = ` <li><a class="dropdown-item" href="#" onclick="loadSharedDocsView(${group_id},'${name}')">${name}</a></li>`;
  $(".sharedDocsDropdownList").append(html);
}

function changeWhiteBoardAction(target) {
  [
    "whiteBoardSelect",
    "whiteBoardErase",
    "whiteBoardDraw",
    "whiteBoardClear",
    "whiteBoardSave",
  ].forEach((action) => {
    const t = document.getElementById(action);
    t.classList.remove("active");
  });
  if (typeof target === "string") target = document.getElementById(target);
  target.classList.add("active");
  switch (target.id) {
    case "whiteBoardSelect":
      whiteBoardCanvas.isDrawingMode = false;
      break;
    case "whiteBoardErase":
      whiteBoardCanvas.freeDrawingBrush = new fabric.EraserBrush(
        whiteBoardCanvas
      );
      whiteBoardCanvas.freeDrawingBrush.width = 10;
      whiteBoardCanvas.isDrawingMode = true;
      break;
    case "whiteBoardDraw":
      whiteBoardCanvas.freeDrawingBrush = new fabric.PencilBrush(
        whiteBoardCanvas
      );
      whiteBoardCanvas.freeDrawingBrush.width = 35;
      whiteBoardCanvas.isDrawingMode = true;
      break;
    case "whiteBoardClear":
      whiteBoardCanvas.clear();
      break;

    case "whiteBoardSave":
      if (confirm("Please click OK to save current whiteboard data.")) {
        let jsonData = whiteBoardCanvas.toJSON();
        saveWhiteBoardData(jsonData);
      } else {
        alert("Whiteboard data will not be saved.");
      }
      break;
    default:
      break;
  }
}

// Whiteboard Backend Function
async function loadWhiteBoardData() {
  let group_id = localStorage.getItem("group_idSelected");
  let response = await fetch(`${apiURL}/api/colab/get-whiteboard/${group_id}`);
  if (response.ok) {
    return await response.json();
  } else {
    return "{}"; //empty json string
  }
}
async function saveWhiteBoardData(whiteboard_json) {
  try {
    let group_id = localStorage.getItem("group_idSelected");
    let user_id = localStorage.getItem("userId");
    let data = {
      whiteboard_json: JSON.stringify(whiteboard_json),
      group_id,
      user_id,
    };
    await fetch(`${apiURL}/api/colab/post-whiteboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        alert("Whiteboard data saved successfully.");
      }
    });
  } catch (err) {
    return { error: err.message };
  }
}

const setDrawableErasableProp = (drawable, value) => {
  whiteBoardCanvas.get(drawable)?.set({ erasable: value });
  changeAction("erase");
};

async function loadSharedDocsView(group_id, name) {
  localStorage.setItem("group_idSelected", group_id);
  $("#sharedDocsJoinedGroupView").addClass("d-block");
  $("#sharedDocsJoinedGroupView").removeClass("d-none");
  $("#sharedDocsTitle").empty();
  $("#sharedDocsTitle").append(" - ", name);

  // Fetch the files based on groupId
  $("#sharedDocsJoinedGroupList").empty();
  let dataResponse = await fetchSharedDocList();
  let data = dataResponse.response;
  if (data.length != 0) {
    for (let i = 0; i < data.length; i++) {
      createSharedDocListItem(data[i]);
    }
  } else {
    $("#sharedDocsJoinedGroupList").append(
      "<li><span>No documents found.</span></li>"
    );
  }
}

function createSharedDocListItem(data) {
  let html =
    '<li class="col-sm-4"><div class="card">' +
    '<div class="card-body">' +
    `<h5 class="card-title">${data.file_name}` +
    '<i class="bi bi-file-earmark-text text-danger float-end"></i></h5>' +
    `<p class="card-text">${data.file_desc}</p>` +
    `<a href="#" download class="link" onclick="downloadFile(${data.id});return false;">Open Document</a>` +
    "</div></div></li>";

  $("#sharedDocsJoinedGroupList").append(html);
}

async function fetchSharedDocList() {
  const group_id = localStorage.getItem("group_idSelected");
  try {
    let response = await fetch(
      `${apiURL}/api/colab/find-shared-docs/${group_id}`
    );

    if (response.ok) {
      return response.json();
    } else if (response.status === 403) {
      throw new Error("Invalid Group Id");
    } else if (response.status === 404) {
      throw new Error("Invalid Group Id");
    } else {
      throw new Error("An error occurred");
    }
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

async function downloadFile(doc_id) {
  this.event.preventDefault();
  let data = { doc_id };
  let filename;
  try {
    response = await fetch(`${apiURL}/api/colab/download-doc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        filename = response.headers.get("File-Name");
        return response.status === 200
          ? response.blob()
          : Promise.reject("something went wrong");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.target = "_blank";
        // the filename you want
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  } catch (err) {
    return { error: err.message };
  }
}

async function uploadDocAsForm() {
  try {
    let doc = document.getElementById("txtDocUpload").files[0];
    let desc = document.getElementById("txtDocDesc").value;
    let group_id = localStorage.getItem("group_idSelected");
    let user_id = localStorage.getItem("userId");
    let formData = new FormData();

    formData.append("doc", doc);
    formData.append("desc", desc);
    formData.append("group_id", group_id);
    formData.append("user_id", user_id);
    response = await fetch(`${apiURL}/api/colab/add-doc-group`, {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.ok) {
        alert("Document uploaded successfully.");
      } else {
        alert("Error: Document upload failed");
      }
    });
  } catch (err) {
    return { error: err.message };
  }
}
