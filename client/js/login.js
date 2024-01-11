window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("emailInput").value;
      const password = document.getElementById("passwordInput").value;

      const response = await loginUser(email, password);
      if (response.error) {
        alert(response.error);
      } else {
        console.log(response);
        localStorage.setItem("token", response.response.token);
        window.location.href = `../client/dashboard.html?id=${response.response.id}`;
      }
    });
  } else {
    console.error("loginForm not found");
  }
});

async function loginUser(email, password) {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else if (response.status === 403) {
      document.getElementById("errorMsg").innerHTML = data.message;
    } else if (response.status === 404) {
      document.getElementById("errorMsg").innerHTML = data.message;
    } else {
      throw new Error("An error occurred");
    }
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}
