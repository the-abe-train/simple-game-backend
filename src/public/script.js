const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const values = Object.values(registerForm).reduce((obj, field) => {
      if (field.name) {
        obj[field.name] = field.value;
      }
      return obj;
    }, {});
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
  } catch (error) {
    console.error(error);
  }
})

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const values = Object.values(loginForm).reduce((obj, field) => {
      if (field.name) {
        obj[field.name] = field.value;
      }
      return obj;
    }, {});
    const res = await fetch("/api/authorize", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    // console.log("values", values);
  } catch (error) {
    console.error(error);
  }
});

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", async () => {
  try {
    console.log('logout button pressed')
    await fetch("/api/logout", {
      method: "POST",
    });
  } catch (e) {
    console.error(e);
  }
})

const scoreForm = document.getElementById("score-form");
scoreForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const score = new FormData(scoreForm).get('score');
  try {
    console.log(score);
    await fetch("/api/score/update", {
      method: "PUT",
      body: JSON.stringify({score}),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
  } catch (e) {
    console.error(e);
  }
})