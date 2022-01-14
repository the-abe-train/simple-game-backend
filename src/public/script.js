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
    await fetch("/api/player", {
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
    await fetch("/api/authorization", {
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
    await fetch("/api/authorization", {
      method: "DELETE",
    });
  } catch (e) {
    console.error(e);
  }
})

const deleteAcctBtn = document.getElementById("delete-acct-btn");
deleteAcctBtn.addEventListener("click", async () => {
  try {
    console.log('logout button pressed')
    await fetch("/api/player", {
      method: "DELETE",
    });
  } catch (e) {
    console.error(e);
  }
})

const getPlayerBtn = document.getElementById("get-player-btn");
getPlayerBtn.addEventListener("click", async () => {
  try {
    console.log('logout button pressed')
    await fetch("/api/player");
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
    await fetch("/api/player/score", {
      method: "PUT",
      body: JSON.stringify({ score }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
  } catch (e) {
    console.error(e);
  }
})