
const hobbieList = ["Reading", "Writing", "Coding", "Singing", "Dancing"];
const skillsList = [
  "Communication",
  "Technical proficiency",
  "Creative problem-solving",
  "Attention to detail",
  "Time management",
  "Collaboration and teamwork",
  "Adaptability",
  "Research and learning",
  "Leadership",
  "Passion and enthusiasm",
];

const showSuggestions = (event) => {
  const inputElementId = event.target.id;
  const inputElement = document.getElementById(inputElementId);
  const parentElement = inputElement.parentElement.parentElement.parentElement;
  const parentElementId = parentElement.id;
  const suggestionsElementId = `${parentElementId}Suggestions`;
  const suggestionsElement = document.getElementById(suggestionsElementId);
  const optionList = parentElementId.includes("hobbie")
    ? hobbieList
    : skillsList;

  let lastInputValue = inputElement.value;
  suggestionsElement.innerHTML = "";

  if (lastInputValue !== "") {
    const filteredOptions = optionList.filter(
      (option) =>
        option.toLowerCase().indexOf(lastInputValue.toLowerCase()) > -1
    );
    filteredOptions.forEach((option) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("col-md-4");
      suggestionItem.classList.add("suggesstionItem");
      suggestionItem.innerHTML = `<span class="badge rounded-pill border border-secondary text-bg-light mb-1 me-2">${option}</span>`;
      suggestionItem.addEventListener("click", () => {
       lastInputValue = option;
      inputElement.value = lastInputValue;
        suggestionsElement.innerHTML = "";
      });
      suggestionsElement.appendChild(suggestionItem);
    });
  }

  document.addEventListener("click", (clickEvent) => {
    const targetElement = clickEvent.target;
    if (
      !inputElement.contains(targetElement) &&
      !suggestionsElement.contains(targetElement)
    ) {
      suggestionsElement.innerHTML = "";
    }
  });
};

let hobbieCount = 1;
const hobbieContinaer = document.getElementById("hobbiesContainer");
const addHobbieBtn = document.getElementById("addHobbieBtn");

const hobbieItem0 = document.getElementById("hobbieItem0");
const hobbieItem0Suggestions = document.getElementById(
  "hobbieItem0Suggestions"
);
const hobbieItem0Name = document.getElementById("hobbieItem0Name");
hobbieItem0Name.addEventListener("keyup", showSuggestions);

const createNewHobby = () => {
  const newHobby = document.createElement("div");
  const hobbieItemPosition = hobbieCount - 1;
  newHobby.innerHTML = `
  <div id="hobbieItem${hobbieItemPosition}">
    <div class="d-flex justify-content-between">
    <div class="input-group input-group-sm mb-3 me-2">
        <span class="input-group-text ml-2" id="inputGroup-sizing-sm">Hobbie</span>
        <input type="text" class="form-control" aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm" id="hobbieItem${hobbieItemPosition}Name"/>
    </div>
    <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Rate</span>
        <input type="number" class="form-control" aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm" id="hobbieItem${hobbieItemPosition}Rate" />
    </div>
    <i class="bi bi-x-circle ms-2 mt-1 closeIcon"></i>
  </div>
  <div id="hobbieItem${hobbieItemPosition}Suggestions" class="d-flex flex-row"></div>
</div>
  `;

  const removeIcon = newHobby.querySelector(".closeIcon");
  removeIcon.setAttribute("id", `removeHobbie${hobbieItemPosition}`);
  removeIcon.addEventListener("click", removeHobbieEventListner);

  const hobbieName = newHobby.querySelector(
    `#hobbieItem${hobbieItemPosition}Name`
  );
  hobbieName.addEventListener("keyup", showSuggestions);

  hobbieContinaer.appendChild(newHobby);
};

addHobbieBtn.addEventListener("click", () => {
  if (hobbieCount < 5) {
    hobbieCount++;
    createNewHobby();
  } else {
    alert("You can add only 5 hobbies");
  }
});

const removeHobbyEventListner = (e) => {
  const id = e.target.id;
  const iconElement = document.getElementById(id);
  const hobbieElement = iconElement.parentElement;
  hobbieElement.remove();
};

let skillCount = 1;
const skillContinaer = document.getElementById("skillsContainer");
const addSkillBtn = document.getElementById("addSkillBtn");

const skillItem0 = document.getElementById("skillItem0");
const skillItem0Suggestions = document.getElementById("skillItem0Suggestions");
const skillItem0Name = document.getElementById("skillItem0Name");
skillItem0Name.addEventListener("keyup", showSuggestions);

const createNewSkill = () => {
  const newSkill = document.createElement("div");
  const skillItemPosition = skillCount - 1;
  newSkill.innerHTML = `
  <div id="skillItem${skillItemPosition}">
    <div class="d-flex justify-content-between">
    <div class="input-group input-group-sm mb-3 me-2">
        <span class="input-group-text ml-2" id="inputGroup-sizing-sm">Skill</span>
        <input type="text" class="form-control" aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm" id="skillItem${skillItemPosition}Name"/>
    </div>
    <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Rate</span>
        <input type="number" class="form-control" aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm" id="skillItem${skillItemPosition}Rate" />
    </div>
    <i class="bi bi-x-circle ms-2 mt-1 closeIcon"></i>
  </div>
  <div id="skillItem${skillItemPosition}Suggestions" class="d-flex flex-row"></div>`;
  const removeIcon = newSkill.querySelector(".closeIcon");
  removeIcon.setAttribute("id", `removeSkill${skillItemPosition}`);
  removeIcon.addEventListener("click", removeSkillEventListner);

  const skillName = newSkill.querySelector(`#skillItem${skillItemPosition}Name`);
  skillName.addEventListener("keyup", showSuggestions);

  skillContinaer.appendChild(newSkill);
};

addSkillBtn.addEventListener("click", () => {
  if (skillCount < 5) {
    skillCount++;
    createNewSkill();
  } else {
    alert("You can add only 5 skills");
  }
});

const removeSkillEventListner = (e) => {
  const id = e.target.id;
  const iconElement = document.getElementById(id);
  const skillElement = iconElement.parentElement;
  skillElement.remove();
};

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("signupForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("emailInput").value;
      const firstname = document.getElementById("firstnameInput").value;
      const lastname = document.getElementById("lastnameInput").value;
      const hobbies = getHobbies();
      const skills = getSkills();
      const password = document.getElementById("passwordInput").value;
      const image_url = document.getElementById("image_urlInput").value;
      const gender = document.querySelector('input[name="gender"]:checked');

      const response = await signupUser(
        email,
        firstname,
        lastname,
        password,
        hobbies,
        skills,
        image_url,
        gender
        
      );
      if (response.error) {
        alert(response.error);
      } else {
        window.location.href = `../client/login.html`;
      }
    });
  } else {
    console.error("signupForm not found");
  }
});

async function signupUser(
  email,
  firstname,
  lastname,
  password,
  hobbies,
  skills,
  image_url,
  gender
) {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        password,
        hobbies,
        skills,
        image_url,
        gender
      }),
    });

    if (response.ok) {
      return response.json();
    } else if (response.status === 403) {
      throw new Error("Email already exists!");
    } else {
      throw new Error("An error occurred");
    }
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

function getHobbies() {
  const hobbies = [];
  for (i = 0; i < 5; i++) {
    const hobbieName = document.getElementById(`hobbieItem${i}Name`)?.value;
    const hobbieRate = document.getElementById(`hobbieItem${i}Rate`)?.value;

    if (hobbieName && hobbieRate) {
      hobbies.push({
        name: hobbieName,
        rate: hobbieRate,
      });
    }
  }
  return hobbies;
}

function getSkills() {
  const skills = [];
  for (i = 0; i < 5; i++) {
    const skillName = document.getElementById(`skillItem${i}Name`)?.value;
    const skillRate = document.getElementById(`skillItem${i}Rate`)?.value;

    if (skillName && skillRate) {
      skills.push({
        name: skillName,
        rate: skillRate,
      });
    }
  }
  return skills;
}
