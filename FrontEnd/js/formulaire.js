const auth = {
  async login(email, password) {
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.userId));

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: "Erreur serveur" };
    }
  }
}

const form = document.querySelector('form')

///// Quand on submit
form.addEventListener("submit", async (event) => {
    // On empêche le comportement par défaut
    event.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const result = await auth.login(email, password)

    if(!result.success) {
        console.log(result.message)
    }
    console.log("connecté")
})
