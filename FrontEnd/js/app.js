const gallery = document.querySelector(".gallery")
const filtersBox = document.querySelector(".filters-container")

let works = []; 
let categories = []; 

//RECUPERER LES DONNEES DANS L'API
/////Récupérer les travaux
async function getWorks() {
  const url = "http://localhost:5678/api/works" //lien de l'API
  try {
    const reponse = await fetch(url)
    if (!reponse.ok) {
      throw new Error(`Statut de réponse : ${reponse.status}`)
    }

    works = await reponse.json()
    displayWorks(works)

  } catch (erreur) {
    console.error(erreur.message)
  }
}

/////Récupérer les catégories
async function getCategories() {
  const url = "http://localhost:5678/api/categories" //lien de l'API
  try {
    const reponse = await fetch(url)
    if (!reponse.ok) {
      throw new Error(`Statut de réponse : ${reponse.status}`)
    }

    categories = await reponse.json()
    // console.log(categories)

    displayFilters(categories)
  // clickFilter()
  } catch (erreur) {
    console.error(erreur.message)
  }
}

/////Afficher les travaux 
function displayWorks(worksToDisplay) {
  gallery.innerHTML = "";

  worksToDisplay.forEach((work) => {
    const figure = document.createElement("figure")

    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                      <figcaption>${work.title}</figcaption>`

    gallery.appendChild(figure)
  })
}

/////Afficher les catégories 
function displayFilters(categories) {
  filtersBox.innerHTML = ""

  const allButton = createFilterButton("Tous", "all", true)

  filtersBox.appendChild(allButton)

  categories.forEach((category) => {
    const button = createFilterButton(category.name, category.id)

    filtersBox.appendChild(button)
  })
}

/////Création des boutons filtres 
function createFilterButton(label, categoryId, isActive = false) {
  const button = document.createElement("button")

  button.textContent = label
  button.classList.add("filter") 
  button.classList.add(`category-${categoryId}`) 

  if(isActive) {
    button.classList.add("active")
  }

  button.addEventListener("click",()=> {
    document.querySelectorAll(".filter").forEach((filter) =>{
      filter.classList.remove("active")
    })

    button.classList.add("active")

    if(categoryId === "all"){
      displayWorks(works)
    } else {
      const filteredWorks = works.filter((work) => {
        return work.categoryId === Number(categoryId)
      })

      displayWorks(filteredWorks)
    }

    console.log(categoryId)
  })

  return button
}



// SOMMES NOUS CONNECTE ?

function checkAuth() {
  const token = localStorage.getItem("token")
  const navLogin = document.getElementById('log')
  const filtersContainer = document.querySelector(".filters-container")
  const banniere = document.getElementById('mode-edition')
  if (token) {
    // L'utilisateur est connecté
    logout()
    showAdminFeatures() // Affiche tes boutons "modifier", etc.
    filtersContainer.style.display = "none"
    banniere.style.display = null

  } else {
    // L'utilisateur n'est pas connecté
    if (navLogin) navLogin.textContent = "login"
  }
  token === ""
}



///// SE CONNECTER 
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
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // console.log(email, password)
    const result = await auth.login(email, password);

    if(!result.success) {
        console.log(result.message);
        const message = document.getElementById('message')
        message.innerHTML="<p class='erreur'>Identifiant ou mot de passe erroné</p>"
    } else {
        console.log("connecté");
        // open('index.html')
        document.location.href = "index.html"
    }
  });
}

///// SE DECONNECTER
function logout() {
  const navLogin = document.getElementById('log')
  if (!navLogin) return
  navLogin.textContent = "logout"

  navLogin.addEventListener("click", (e) => {
    e.preventDefault()
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "index.html" // Recharge la page pour revenir à l'état "non connecté"
  });
}


///// LES PARAMETRES DE MODIFICATIONS

///Afficher le bouton "modifier"

const btnModifier = document.getElementById('btn-modal')

function showAdminFeatures() {
  if (btnModifier) {
    btnModifier.style.display = null
    btnModifier.setAttribute('aria-hidden', 'false')
    btnModifier.setAttribute('aria-modal', 'true')
    btnModifier.addEventListener("click", openModal)
  }
}

///MODAL 1 : modifier la galerie 

//où on l'affiche 
const modalGallery = document.getElementById('modal-gallery')

//appeler la gallerie 
function displayModal (worksToDisplay) {
  modalGallery.innerHTML = "";

  worksToDisplay.forEach((work) => {
    const modifWork = document.createElement("figure")

    modifWork.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}" class="gallery-img">
                          <button class="delete-work"><i class="fa-solid fa-trash-can"></i></button>`

    modalGallery.appendChild(modifWork)
  })
}

//boutons supprimer un projet 
// const deleteBtn = modifWork.querySelector(".delete-work")
// deleteBtn.addEventListener("click", async (e) => {
//   e.preventDefault()
//   await deleteWork(work.id)
// })


let currentModal = null 
const target1 = document.getElementById('modal1')

//affichage de la modale
const openModal = function (e) {
  e.preventDefault()
  if (!target1) return 
  target1.style.display = null
  target1.setAttribute('aria-hidden', 'false')
  target1.setAttribute('aria-modal', 'true')
  console.log("ouverture de la modale")
  displayModal(works)
}

//Fermer la modale

target1.addEventListener('click', (event)=> {
  if (event.target === target1) {
    target1.style.display = "none"
    console.log("ovlerlay cliqué")}
  })


///// AJOUTER UN PROJET 
const btnAdd = document.getElementById('add-project')
const target2 = document.getElementById('modal2')

// affichage de la modale

btnAdd.addEventListener("click", (e)=> {
  e.preventDefault()
  if (!target2) return 
  target2.style.display = null
  target2.setAttribute('aria-hidden', 'false')
  target2.setAttribute('aria-modal', 'true')
  console.log("ouverture de la modale 2")
  target1.style.display = "none"
  // addFormulaire()
  categoriesNewWork(categories) 
})

// MODAL 2 : ajouter un projet 
const categoryNewWork = document.getElementById('categorie-new-work')

function categoriesNewWork (categoriesList) {
  if (!categoryNewWork) return
  categoryNewWork.innerHTML = ""
  console.log("categorie test")

  const defautOption = document.createElement("option")
  defautOption.value = ""
  defautOption.textContent = "Sélectionner une catégorie"
  categoryNewWork.appendChild(defautOption)
  
  categoriesList.forEach((category) => {
    const optionCategory = document.createElement("option")

    optionCategory.value = category.id
    optionCategory.textContent = category.name

    categoryNewWork.appendChild(optionCategory)
  })
}

//Fermer la modale

if (target2) {
  target2.addEventListener('click', (event) => {
    if (event.target === target2) {
      target2.style.display = "none"
      target2.setAttribute('aria-hidden', 'true')
      target2.removeAttribute('aria-modal')
      console.log("overlay 2 cliqué")
    }
  });
}



getWorks()
getCategories()
document.addEventListener("DOMContentLoaded", checkAuth)
