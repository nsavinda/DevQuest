let userId;
let userName;
let userImage;

let isAddProject = false;
let isAddTask = false;
let isProjectSelected = false;
let isTaskSelected = false;
let isEditProject = false;
let isEditTask = false;

function getUserInfo() {
  userId = localStorage.getItem("userId");
  let userImageUrl = localStorage.getItem("userImage");

  userName = document.getElementById("username");
  userName.innerHTML = localStorage.getItem("userName");

  userImage = document.getElementById("userImage");
  userImage.setAttribute("src", `${userImageUrl}`);
  userImage.classList.add("user-image");

  let homeBtn = document.getElementById("projectMate-header");
  homeBtn.addEventListener("click", () => {
    document.getElementById("body-container").style.display = "none";
    document.getElementById("stats-container").style.display = "none";
    document.getElementById("welcome-container").style.display = "";
  });

  let addProjectBtn = document.getElementById("add-project-btn");
  addProjectBtn.addEventListener("click", (event) => {
    event.preventDefault();
    isAddProject = true;
    isProjectSelected = false;
    projectCardEventClick(null);
  });

  let dashboardBtn = document.getElementById("dashboard-btn");
  dashboardBtn.setAttribute("href", `dashboard.html?id=${userId}`);
}

let userGroups;

async function getUserGroups(userId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/groups/${userId}/userGroups`
    );
    const result = await response.json();
    userGroups = result.response;
    if (userGroups.length == 0) {
      document.getElementById("welcome-footer").innerText = "Oops! You have to join a group from Colab Hub first to work in projects!";
    } else {
      document.getElementById("welcome-footer").innerText = "Select a group from the navigation bar on the left";
    }
    renderUserGroups(userGroups);
  } catch (error) {
    console.error(error);
  }
}

function renderUserGroups(userGroups) {
  userGroups.forEach((group) => {
    let li = document.createElement("li");
    li.classList.add(
      "p-2",
      "bd-highlight",
      "group-item",
      "d-flex",
      "flex-row",
      "bd-highlight",
      "mb-3",
      "align-items-center"
    );
    li.innerHTML = `${group.name}`;
    li.addEventListener("click", groupEventClick);
    groupList.appendChild(li);
  });
}

getUserInfo();
getUserGroups(userId);

var selectedUserGroupId;
var selectedUserGroupName;
var selectedGroupTags;

async function groupEventClick(eventObj) {
  eventObj.preventDefault();
  document.getElementById("welcome-container").style.display = "none";
  document.getElementById("body-container").style.display = "";
  document.getElementById("stats-container").style.display = "";
  userGroups.forEach((group) => {
    if (eventObj.target.innerText == group.name) {
      selectedUserGroupId = group.group_id;
      selectedUserGroupName = group.name;
      selectedGroupTags = group.hobbies;
    }
  });
  await getGroupProjects(selectedUserGroupId);

  let groupHeader = document.getElementById("group-header");
  groupHeader.innerHTML = selectedUserGroupName;

  let groupTags = document.getElementById("group-tags-container");
  groupTags.innerHTML = "";
  let groupTag = document.createElement("div");
  groupTag.classList.add("group-tag");
  groupTag.innerHTML = selectedGroupTags.slice(2, -2);
  groupTags.appendChild(groupTag);

  getPieChartData();
  await getUserTasks(userId, selectedUserGroupId);
}

let groupId;
let groupProjects = [];

async function getGroupProjects(groupId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/groups/${groupId}/groupProjects`
    );
    const result = await response.json();
    groupProjects = result.response;
    renderGroupProjects();
  } catch (error) {
    console.error(error);
  }
}

function renderGroupProjects() {
  const todoProjects = document.getElementById("to-do-col");
  const inProgressProjects = document.getElementById("in-progress-col");
  const doneProjects = document.getElementById("done-col");

  todoProjects.innerHTML = "";
  inProgressProjects.innerHTML = "";
  doneProjects.innerHTML = "";

  groupProjects.forEach((project) => {
    let project_card = document.createElement("div");
    project_card.classList.add("project-card");

    let project_name = document.createElement("span");
    project_name.classList.add("project-name-card");
    project_name.innerHTML = `${project.name}`;

    let project_desc = document.createElement("span");
    project_desc.classList.add("project-desc-card");
    project_desc.innerHTML = `${project.description}`;

    let dueDate_text = document.createElement("span");
    dueDate_text.classList.add("project-name-card");
    dueDate_text.innerHTML = "Due Date";

    let project_dueDate = document.createElement("span");
    project_dueDate.classList.add("project-desc-card");
    project_dueDate.innerHTML = `${project.dueDate}`;

    let card_bottom_container = document.createElement("div");
    card_bottom_container.classList.add("card-bottom-container");

    let card_bottom_left_container = document.createElement("div");
    card_bottom_left_container.classList.add("card-bottom-left-container");

    let card_bottom_right_container = document.createElement("div");
    card_bottom_right_container.classList.add("card-bottom-right-container");

    let image_tag = document.createElement("IMG");

    image_tag.setAttribute("src", `${project.image_url}`);
    image_tag.classList.add("project-card-image");

    card_bottom_right_container.appendChild(image_tag);

    let card_top_container = document.createElement("div");
    card_top_container.classList.add("card-top-container");

    card_top_container.appendChild(project_name);
    card_top_container.appendChild(project_desc);
    card_bottom_left_container.appendChild(dueDate_text);
    card_bottom_left_container.appendChild(project_dueDate);
    project_card.appendChild(card_top_container);

    card_bottom_container.appendChild(card_bottom_left_container);
    card_bottom_container.appendChild(card_bottom_right_container);

    project_card.appendChild(card_bottom_container);

    if (project.projectStatus == "To-Do") {
      todoProjects.appendChild(project_card);
    } else if (project.projectStatus == "In-Progress") {
      inProgressProjects.appendChild(project_card);
    } else if (project.projectStatus == "Done") {
      doneProjects.appendChild(project_card);
    }

    project_card.addEventListener("click", function () {
      isProjectSelected = true;
      projectCardEventClick(project);
    });
  });
}

function getPieChartData() {
  let tdp_count = 0;
  let ipp_count = 0;
  let dp_count = 0;

  groupProjects.forEach((project) => {
    if (project.projectStatus == "To-Do") {
      tdp_count++;
    } else if (project.projectStatus == "In-Progress") {
      ipp_count++;
    } else if (project.projectStatus == "Done") {
      dp_count++;
    }
  });

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Projects Stats",
      fontFamily: "Arial",
      fontWeight: "550",
    },
    data: [
      {
        type: "pie",
        startAngle: 240,
        yValueFormatString: '##0.00"%"',
        indexLabel: "{label} {y}",
        dataPoints: [
          {
            y: (ipp_count / groupProjects.length) * 100,
            label: "In-Progress",
            color: "#483387",
          },
          {
            y: (dp_count / groupProjects.length) * 100,
            label: "Done",
            color: "#4fc23c",
          },
          {
            y: (tdp_count / groupProjects.length) * 100,
            label: "To-Do",
            color: "#ff615a",
          },
        ],
      },
    ],
  });
  chart.render();
}

async function updateProjectDetail(
  projectName,
  projectDescription,
  endDate,
  projectId
) {
  const URL = `http://127.0.0.1:3000/api/groups/${projectId}/updateProject`;
  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName,
        projectDescription,
        endDate,
      }),
    });
    if (response.status === 200) {
      alert("Updated successfully");
      isEditProject = false;
      location.reload();
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

async function updateProjectStatus(projectId, status) {
  const URL = `http://127.0.0.1:3000/api/groups/${projectId}/updateProjectStatus`;
  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });
    if (response.status === 200) {
      alert("Updated successfully");
      isEditProject = false;
      location.reload();
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

async function updateTaskDetail(
  taskName,
  taskDescription,
  endDate,
  assignee,
  taskId
) {
  const URL = `http://127.0.0.1:3000/api/groups/${taskId}/updateTask`;
  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskName,
        taskDescription,
        endDate,
        assignee,
      }),
    });
    if (response.status === 200) {
      alert("Updated successfully");
      isEditTask = false;
      location.reload();
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

async function updateTaskStatus(taskId, status) {
  const URL = `http://127.0.0.1:3000/api/groups/${taskId}/updateTaskStatus`;
  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });
    if (response.status === 200) {
      alert("Updated successfully");
      isEditProject = false;
      location.reload();
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

async function renderEditProject(project) {
  if (isEditProject && isProjectSelected) {
    document.getElementById("close-btn").style.display = "none";
    document.getElementById("add-task").disabled = true;
    if (document.getElementById("task-item") != null) {
      document.getElementById("task-item").disabled = true;
    }

    document.getElementById("projectStatus").disabled = true;
    document.getElementById("projectStatus").style.cursor = "context-menu";

    document.getElementById("decriptionColumnTitle").innerText = "Edit Project";
    document.getElementById("projectNameRow").innerHTML = `
    <span id="projectNameLabel">Project Name</span>
    <input type="text" name="projectName" value="${project.name}">
    <span id="projectDecriptionLabel">Project Description</span>
    <textarea name="projectDescription">${project.description}</textarea>
    `;

    document.getElementById(
      "endDate"
    ).innerHTML = `<input type="date" name="endDate" value="${project.dueDate}">`;

    document.getElementById("cancelButton").style.display = "block";
    document.getElementById("saveProjectButton").style.display = "block";
    document.getElementById("cancelButton").style.marginLeft = "250px";
    document.getElementById("saveProjectButton").style.marginLeft = "20px";
    document.getElementById("editProjectButton").style.display = "none";

    document
      .getElementById("saveProjectButton")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        if (isEditProject) {
          let projectName = document.querySelector(
            '[name="projectName"]'
          ).value;
          let projectDescription = document.querySelector(
            '[name="projectDescription"]'
          ).value;
          let endDate = document.querySelector('[name="endDate"]').value;
          let projectId = project.id;
          await updateProjectDetail(
            projectName,
            projectDescription,
            endDate,
            projectId
          );
        }
      });
  }
}

function renderEditTask(task, project, users) {
  if (isEditTask && isTaskSelected) {
    document.getElementById("close-btn").disabled = true;
    document.getElementById("back-btn").disabled = true;
    document.getElementById("taskStatus").disabled = true;
    document.getElementById("taskStatus").style.cursor = "context-menu";

    document.getElementById("decriptionColumnTitle").innerText = "Edit Task";
    document.getElementById("projectNameRow").innerHTML = `
      <h5 id="projectNameLabel">${project.name} / 
      <input type="text" name="taskName" value="${task.name}"></h5>
      <span id="projectDecriptionLabel">Task Description</span>
      <textarea name="taskDescription">${task.description}</textarea>
    `;

    document.getElementById("projectOwnerColumn").innerHTML =
      '<select name="taskAssignee"></select>';
    let assigneeSelect = document.querySelector('[name="taskAssignee"]');
    users.forEach((user) => {
      assigneeSelect.innerHTML += `<option value=${user.id}>
      <img class="user-profile-picture" id="projectOwnerProfilePicture" src=${
        user.image_url
      }  ${user.id == task.assigneeId ? "selected" : ""}/>
      <span>${user.firstname + " " + user.lastname}</span>
      </option>
      `;
    });

    assigneeSelect.value = task.assigneeId;

    document.getElementById(
      "endDate"
    ).innerHTML = `<input type="date" name="endDate" value="${task.dueDate}">`;

    document.getElementById("saveProjectButton").style.display = "block";
    document.getElementById("cancelButton").style.display = "block";
    document.getElementById("saveProjectButton").style.marginLeft = "20px";
    document.getElementById("cancelButton").style.marginLeft = "700px";
    document.getElementById("editProjectButton").style.display = "none";

    document
      .getElementById("saveProjectButton")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        if (isEditTask) {
          let taskName = document.querySelector('[name="taskName"]').value;
          let taskDescription = document.querySelector(
            '[name="taskDescription"]'
          ).value;
          let endDate = document.querySelector('[name="endDate"]').value;
          let assignee = document.querySelector('[name="taskAssignee"]').value;
          let taskId = task.id;
          await updateTaskDetail(
            taskName,
            taskDescription,
            endDate,
            assignee,
            taskId
          );
        }
      });
  }
}

function renderProjectDetails(project, tasks, users, selectedTask) {
  if (isAddProject) {
    document.getElementById("modalTitle").innerText = selectedUserGroupName;
    document.getElementById("decriptionColumnTitle").innerText =
      "Add New Project";
    document.getElementById("projectNameRow").innerHTML = `
    <span id="projectNameLabel">Project Name</span>
    <input type="text" name="projectName" value="">
    <span id="projectDecriptionLabel">Project Description</span>
    <textarea name="projectDescription"></textarea>
    `;

    document.getElementById("close-btn").style.display = "none";
    document.getElementById("projectStatusLable").innerText = "Project Status";
    document.getElementById("projectStatus").style.display = "grid";
    document.getElementById("projectStatus").value = "To-Do";
    document.getElementById("projectStatus").disabled = true;
    document.getElementById("projectStatus").style.cursor = "context-menu";
    document.getElementById("projectOwnerLabel").innerText = "Owner";

    let projectOwner = {};
    let userId = localStorage.getItem("userId");
    users.forEach((user) => {
      if (user.id == userId) {
        projectOwner = user;
        return;
      }
    });

    document
      .getElementById("projectOwnerProfilePicture")
      .setAttribute("src", projectOwner.image_url);
    document.getElementById("projectOwnerName").innerText =
      projectOwner.firstname + " " + projectOwner.lastname;
    document.getElementById("taskReporterRow").style.display = "none";
    document.getElementById("startDate").innerText = new Date()
      .toJSON()
      .slice(0, 10);
    document.getElementById(
      "endDate"
    ).innerHTML = `<input type="date" name="endDate" value="">`;
    document.getElementById("editProject").style.display = "block";
    document.getElementById("cancelButton").style.display = "block";
    document.getElementById("saveProjectButton").style.display = "block";
    document.getElementById("saveProjectButton").style.marginLeft = "20px";
    document.getElementById("cancelButton").style.marginLeft = "700px";
    document.getElementById("tasksListRow").style.display = "none";
    document.getElementById("addTask").style.display = "none";
    document.getElementById("editProjectButton").style.display = "none";
    document.getElementById("close-btn").disabled = true;
    document.getElementById("add-task").disabled = true;
    document.getElementById("projectStatus").disabled = true;
    document.getElementById("projectStatus").style.cursor = "context-menu";

    document
      .getElementById("saveProjectButton")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        let projectName = document.querySelector('[name="projectName"]').value;
        let projectDescription = document.querySelector(
          '[name="projectDescription"]'
        ).value;
        let projectStatus = document.querySelector(
          '[name="projectStatus"]'
        ).value;
        let currentDate = new Date().toJSON().slice(0, 10);
        let endDate = document.querySelector('[name="endDate"]').value;

        if (projectName == "" || projectDescription == "" || endDate == "") {
          alert("Fill in all the details first!");
        } else {
          addNewProject(
            projectName,
            projectDescription,
            currentDate,
            endDate,
            userId,
            selectedUserGroupId,
            projectStatus
          );
        }
      });
  }

  if (isProjectSelected) {
    document.getElementById("modalTitle").innerText = selectedUserGroupName;
    document.getElementById("decriptionColumnTitle").innerText =
      "Project Details";
    document.getElementById("projectNameLabel").innerText = project.name;
    document.getElementById("projectDescription").innerText =
      project.description;

    const tasksList = document.getElementById("tasksList");
    tasksList.innerHTML = "";
    if (tasks.length == 0) {
      tasksList.innerHTML = "No Tasks Added Yet!";
      tasksList.style.marginLeft = "15px";
    } else {
      tasks.forEach((task) => {
        let listGroupItem = document.createElement("button");
        listGroupItem.id = "task-item";
        listGroupItem.setAttribute("type", "button");
        listGroupItem.classList.add(
          "list-group-item",
          "list-group-item-action"
        );
        tasksList.appendChild(listGroupItem);
        let assignee = {};
        users.forEach((user) => {
          if (user.id == task.assigneeId) {
            assignee = user;
            return;
          }
        });
        listGroupItem.innerHTML = `
            <div class="row">
              <div class="col">${task.name}</div>
              <div class="col">
                <select class="task-status-dropdown" name="status" id="status" disabled>
                  <option value="ToDo" ${
                    task.taskStatus == "To-Do" ? "selected" : ""
                  }>To Do</option>
                  <option value="InProgress" ${
                    task.taskStatus == "In-Progress" ? "selected" : ""
                  }>In progress</option>
                  <option value="Done" ${
                    task.taskStatus == "Done" ? "selected" : ""
                  }>Done</option>
                </select>
              </div>
              <div class="col">
                <img class="user-profile-picture"
                  src="${
                    assignee.image_url != ""
                      ? assignee.image_url
                      : "https://th.bing.com/th/id/OIP.bEl-isZYhCmzsIGyhdEatgHaEK?pid=ImgDet&rs=1"
                  }" />
                <span>${assignee.firstname + " " + assignee.lastname}</span>
              </div>
            </div>
            `;

        listGroupItem.addEventListener("click", function () {
          isProjectSelected = false;
          isTaskSelected = true;
          isEditProject = false;
          renderProjectDetails(project, tasks, users, task);
        });
      });
    }
    document.getElementById("projectStatusLable").innerText = "Project Status";
    document.getElementById("projectStatus").style.display = "grid";
    document.getElementById("taskStatus").style.display = "none";
    document.getElementById("projectStatus").value = project.projectStatus;

    let updatedStatus = "";

    document
      .getElementById("projectStatus")
      .addEventListener("change", async (event) => {
        updatedStatus = event.target.value;
        await updateProjectStatus(project.id, updatedStatus);
      });

    document.getElementById("projectOwnerLabel").innerText = "Owner";

    let projectOwner = {};
    users.forEach((user) => {
      if (user.id == project.ownerId) {
        projectOwner = user;
        return;
      }
    });
    document
      .getElementById("projectOwnerProfilePicture")
      .setAttribute(
        "src",
        projectOwner.image_url != ""
          ? project.image_url
          : "https://th.bing.com/th/id/OIP.bEl-isZYhCmzsIGyhdEatgHaEK?pid=ImgDet&rs=1"
      );
    document.getElementById("projectOwnerName").innerText =
      projectOwner.firstname + " " + projectOwner.lastname;

    document.getElementById("taskReporterRow").style.display = "none";
    document.getElementById("startDate").innerText = project.createdDate;
    document.getElementById("endDate").innerText = project.dueDate;
    document.getElementById("saveProjectButton").style.display = "none";
    document.getElementById("editProject").style.display = projectOwner.id == userId ? "block" : "none";
    document
      .getElementById("editProjectButton")
      .addEventListener("click", function (event) {
        event.preventDefault();
        isEditProject = isProjectSelected;
        isEditTask = isTaskSelected;

        if (isEditProject) {
          renderEditProject(project);
        }
      });

    document.getElementById("addTask").addEventListener("click", (event) => {
      event.preventDefault();
      isAddTask = true;
      isProjectSelected = false;
      renderProjectDetails(project, null, users, null);
    });
  }

  if (isTaskSelected) {
    document.getElementById("back-btn").style.display = "grid";
    document.getElementById("modalTitle").innerText = "";
    document.getElementById("modalTitle").style.backgroundColor = "white";
    document.getElementById("tasksListRow").style.display = "none";
    document.getElementById("addTask").style.display = "none";
    document.getElementById("decriptionColumnTitle").innerText = "Task Details";
    document.getElementById("projectNameLabel").innerText =
      project.name + " / " + selectedTask.name;
    document.getElementById("projectDescription").innerText =
      selectedTask.description;

    document.getElementById("projectStatusLable").innerText = "Task Status";
    document.getElementById("taskStatus").style.display = "grid";
    document.getElementById("projectStatus").style.display = "none";
    document.getElementById("taskStatus").value = selectedTask.taskStatus;

    let updatedStatus = "";
    document
      .getElementById("taskStatus")
      .addEventListener("change", async (event) => {
        updatedStatus = event.target.value;
        await updateTaskStatus(selectedTask.id, updatedStatus);
        await getUserTasks(userId, selectedUserGroupId);
      });

    let assignee = {};
    users.forEach((user) => {
      if (user.id == selectedTask.assigneeId) {
        assignee = user;
        return;
      }
    });
    document.getElementById("projectOwnerLabel").innerText = "Assignee";
    document
      .getElementById("projectOwnerProfilePicture")
      .setAttribute(
        "src",
        assignee.image_url != ""
          ? assignee.image_url
          : "https://th.bing.com/th/id/OIP.bEl-isZYhCmzsIGyhdEatgHaEK?pid=ImgDet&rs=1"
      );
    document.getElementById("projectOwnerName").innerText =
      assignee.firstname + " " + assignee.lastname;

    let reporter = {};
    users.forEach((user) => {
      if (user.id == selectedTask.reporterId) {
        reporter = user;
        return;
      }
    });

    document.getElementById("taskReporterRow").style.display = "block";
    document.getElementById("taskReporterLabel").innerText = "Reporter";
    document
      .getElementById("taskReporterProfilePicture")
      .setAttribute(
        "src",
        reporter.image_url != ""
          ? reporter.image_url
          : "https://th.bing.com/th/id/OIP.bEl-isZYhCmzsIGyhdEatgHaEK?pid=ImgDet&rs=1"
      );
    document.getElementById("taskReporterName").innerText =
      reporter.firstname + " " + reporter.lastname;

    document.getElementById("startDate").innerText = selectedTask.createdDate;
    document.getElementById("endDate").innerText = selectedTask.dueDate;

    document.getElementById("editProject").style.display = "block";
    document
      .getElementById("editProjectButton")
      .addEventListener("click", function (event) {
        event.preventDefault();
        isEditProject = isProjectSelected;
        isEditTask = isTaskSelected;

        if (isEditTask) {
          renderEditTask(selectedTask, project, users);
        }
      });
  }
  if (isAddTask) {
    document.getElementById("modalTitle").innerText = "";
    document.getElementById("modalTitle").style.backgroundColor = "white";

    document.getElementById("tasksListRow").style.display = "none";
    document.getElementById("addTask").style.display = "none";
    document.getElementById("decriptionColumnTitle").innerText = "Add New Task";

    document.getElementById("projectNameRow").innerHTML = `
      <h5 id="projectNameLabel">${project.name} / 
      <input type="text" name="taskName" value=""></h5>
      <span id="projectDecriptionLabel">Task Description</span>
      <textarea name="taskDescription"></textarea>
    `;

    document.getElementById("projectStatusLable").innerText = "Task Status";
    document.getElementById("taskStatus").style.display = "grid";
    document.getElementById("taskStatus").value = "To-Do";
    document.getElementById("projectStatus").style.display = "none";
    document.getElementById("close-btn").disabled = true;
    document.getElementById("taskStatus").disabled = true;
    document.getElementById("taskStatus").style.cursor = "context-menu";

    document.getElementById("projectOwnerColumn").innerHTML =
      '<select name="taskAssignee"></select>';
    let assigneeSelect = document.querySelector('[name="taskAssignee"]');
    users.forEach((user) => {
      assigneeSelect.innerHTML += `<option value=${user.id}>
      <img class="user-profile-picture" id="projectOwnerProfilePicture" src=${
        user.image_url
      }  ${user.id == userId ? "selected" : ""}/>
      <span>${user.firstname + " " + user.lastname}</span>
      </option>
      `;
    });

    assigneeSelect.value = userId;

    document.getElementById("projectOwnerLabel").innerText = "Assignee";

    let reporter = {};
    users.forEach((user) => {
      if (user.id == userId) {
        reporter = user;
        return;
      }
    });

    document.getElementById("taskReporterRow").style.display = "block";
    document.getElementById("taskReporterLabel").innerText = "Reporter";
    document
      .getElementById("taskReporterProfilePicture")
      .setAttribute(
        "src",
        reporter.image_url != ""
          ? reporter.image_url
          : "https://th.bing.com/th/id/OIP.bEl-isZYhCmzsIGyhdEatgHaEK?pid=ImgDet&rs=1"
      );
    document.getElementById("taskReporterName").innerText =
      reporter.firstname + " " + reporter.lastname;

    document.getElementById("startDate").innerText = new Date()
      .toJSON()
      .slice(0, 10);

    document.getElementById(
      "endDate"
    ).innerHTML = `<input type="date" name="endDate" value="">`;

    document.getElementById("editProject").style.display = "block";
    document.getElementById("saveProjectButton").style.display = "block";
    document.getElementById("cancelButton").style.display = "block";
    document.getElementById("saveProjectButton").style.marginLeft = "20px";
    document.getElementById("cancelButton").style.marginLeft = "700px";
    document.getElementById("editProjectButton").style.display = "none";

    document
      .getElementById("saveProjectButton")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        let taskName = document.querySelector('[name="taskName"]').value;
        let taskDescription = document.querySelector(
          '[name="taskDescription"]'
        ).value;
        let endDate = document.querySelector('[name="endDate"]').value;
        let assignee = document.querySelector('[name="taskAssignee"]').value;
        let status = document.getElementById("taskStatus").value;
        let currentDate = new Date().toJSON().slice(0, 10);

        if (taskName == "" || taskDescription == "" || endDate == "") {
          alert("Fill in all the details first!");
        } else {
          addNewTask(
            taskName,
            taskDescription,
            assignee,
            userId,
            currentDate,
            endDate,
            project.id,
            status
          );
        }
      });
  }
}

async function getUsersOfGroup(project, tasks) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/groups/${selectedUserGroupId}/users`
    );
    const result = await response.json();
    const users = result.response;
    await renderProjectDetails(project, tasks, users, null);
  } catch (error) {
    console.error(error);
  }
}

async function getProjectTasks(project) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/groups/${project.id}/projectTasks`
    );
    const result = await response.json();
    await getUsersOfGroup(project, result.response);
    result.response;
  } catch (error) {
    console.error(error);
  }
}

let project;

async function getProjectById(projectId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/groups/${projectId}/project`
    );
    const result = await response.json();
    let project = result.response;
    isProjectSelected = true;
    isTaskSelected = false;
    document.getElementById("tasksListRow").style.display = "grid";
    document.getElementById("addTask").style.display = "grid";
    document.getElementById("modalTitle").style.backgroundColor = "#48338799";
    document.getElementById("back-btn").style.display = "none";
    getProjectTasks(project[0]);
  } catch (error) {
    console.error(error);
  }
}

var newProjectModal = document.getElementById("projectTaskModal");
var newProjectButton = document.getElementsByClassName("new-project")[0];
var modalClose = document.getElementsByClassName("close")[0];
var backBtn = document.getElementById("back-btn");

function projectCardEventClick(project) {
  newProjectModal.style.display = "block";
  document.getElementById("body-container").classList.add("blur-background");
  document.getElementById("stats-container").classList.add("blur-background");
  document.getElementById("page-header").classList.add("blur-background");
  document.getElementById("sidebar").classList.add("blur-background");
  if (!isAddProject) {
    localStorage.setItem("projectId", project.id);
    newProjectModal.style.display = "block";
    getProjectTasks(project);
  } else {
    getUsersOfGroup(null, null);
  }
}

modalClose.onclick = function () {
  newProjectModal.style.display = "none";
  document.getElementById("body-container").classList.remove("blur-background");
  document
    .getElementById("stats-container")
    .classList.remove("blur-background");
  document.getElementById("page-header").classList.remove("blur-background");
  document.getElementById("sidebar").classList.remove("blur-background");
  isTaskSelected = false;
  isEditProject = false;
  isEditTask = false;
  isAddProject = false;
  isAddTask = false;
  document.getElementById("tasksListRow").style.display = "grid";
  document.getElementById("addTask").style.display = "grid";
  document.getElementById("modalTitle").style.backgroundColor = "#48338799";
  document.getElementById("back-btn").style.display = "none";
};

backBtn.onclick = function () {
  let projectId = localStorage.getItem("projectId");
  getProjectById(projectId);
};

window.onclick = function (event) {
  if (event.target == newProjectModal) {
    newProjectModal.style.display = "none";
    isTaskSelected = false;
    isEditProject = false;
    isEditTask = false;
    isAddProject = false;
    isAddTask = false;
  }
};

let userTasks = [];

async function getUserTasks(userId, groupId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/groups/${userId}/${groupId}/userTasks`
    );
    const result = await response.json();
    userTasks = result.response;
    sortUserTasks();
    renderUserTasks();
  } catch (error) {
    console.error(error);
  }
}

function sortUserTasks() {
  userTasks.sort(function (a, b) {
    return getRemainingDays(a.dueDate) - getRemainingDays(b.dueDate);
  });
  for (let i = 0; i < userTasks.length; i++) {
    if (userTasks[i].taskStatus == "Done") {
      let index = userTasks.indexOf(userTasks[i]);
      userTasks.splice(index, 1);
      i--;
    }
  }
}

function renderUserTasks() {
  const goalSetterContainer = document.getElementById("goalSetterContainer");
  goalSetterContainer.innerHTML = "";

  userTasks.forEach((task) => {
    const taskCol = document.createElement("div");
    taskCol.classList.add("col", "task-col");

    const row1 = document.createElement("div");
    row1.classList.add("row");
    const col1 = document.createElement("div");
    col1.classList.add("col");
    col1.innerHTML = `<b>${task.projectName}</b>`;
    row1.appendChild(col1);
    const col2 = document.createElement("div");
    col2.classList.add("col");
    col2.innerHTML = `<b>Project Status</b> - ${task.projectStatus}`;
    row1.appendChild(col2);

    const row2 = document.createElement("div");
    row2.classList.add("row");
    const col3 = document.createElement("div");
    col3.classList.add("col");
    col3.innerHTML = `<b>${task.name}</b>`;
    row2.appendChild(col3);
    const col4 = document.createElement("div");
    col4.classList.add("col");
    col4.innerHTML = `<b>Task Status</b> - ${task.taskStatus}`;
    row2.appendChild(col4);

    const row3 = document.createElement("div");
    row3.classList.add("row");
    const col5 = document.createElement("div");
    col5.classList.add("col");
    col5.innerHTML = `<b>Due Date</b> - ${task.dueDate}`;
    row3.appendChild(col5);
    let remainingDaysCount = getRemainingDays(task.dueDate);
    const col6 = document.createElement("div");
    col6.classList.add("col");
    if (remainingDaysCount > 0) {
      col6.innerHTML = `${remainingDaysCount} Days remaining`;
      col6.classList.add("remaining-days");
    } else {
      col6.innerHTML = `OVERDUE!`;
      col6.classList.add("overdue-task");
    }
    row3.appendChild(col6);

    taskCol.appendChild(row1);
    taskCol.appendChild(row2);
    taskCol.appendChild(row3);

    goalSetterContainer.appendChild(taskCol);
  });
}

function getRemainingDays(dueDate) {
  var currentDate = new Date();
  var dueDate = new Date(dueDate);
  var Difference_In_Time = dueDate.getTime() - currentDate.getTime();
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days.toFixed();
}

async function addNewProject(
  projectName,
  projectDescription,
  currentDate,
  endDate,
  userId,
  selectedUserGroupId,
  status
) {
  const URL = `http://127.0.0.1:3000/api/groups/addNewProject`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName,
        projectDescription,
        currentDate,
        endDate,
        userId,
        selectedUserGroupId,
        status,
      }),
    });

    if (response.ok) {
      alert("Project added successfully");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

async function addNewTask(
  name,
  taskDescription,
  assignee,
  reporter,
  createdDate,
  dueDate,
  projectId,
  taskStatus
) {
  const URL = `http://127.0.0.1:3000/api/groups/addNewTask`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        taskDescription,
        assignee,
        reporter,
        createdDate,
        dueDate,
        projectId,
        taskStatus,
      }),
    });

    if (response.ok) {
      alert("Task added successfully");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

document.getElementById("cancelButton").addEventListener("click", (event) => {
  isTaskSelected = false;
  isEditProject = false;
  isEditTask = false;
  isAddProject = false;
  isAddTask = false;
});
