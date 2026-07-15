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

    displayFilters(categories)
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
  if (!filtersBox) return
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
      const filteredWorks = works.filter((work) => work.categoryId === Number(categoryId))
      displayWorks(filteredWorks)
    }
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
    if (filtersContainer) filtersContainer.style.display = "none"
    if (banniere) banniere.style.display = null

  } else {
    // L'utilisateur n'est pas connecté
    if (navLogin) navLogin.textContent = "login"
    if(banniere) banniere.style.display = "none"
  }
}



///// SE CONNECTER 
const auth = {
  async login(email, password) {
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
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

const loginForm = document.getElementById('loginForm')
///// Quand on submit
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const result = await auth.login(email, password)

    if(!result.success) {
        const message = document.getElementById('message')
        message.innerHTML="<p class='erreur'>Identifiant ou mot de passe erroné</p>"
    } else {
        console.log("connecté");
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

//appeler la gallerie & les boutons supprimer un projet 
function displayModal(worksToDisplay) {
  modalGallery.innerHTML = "";

  worksToDisplay.forEach((work) => {
    const modifWork = document.createElement("figure");

    modifWork.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}" class="gallery-img">
                          <button class="delete-work"><i class="fa-solid fa-trash-can"></i></button>`;

    // On récupère le bouton de suppression qu'on vient de créer
    const deleteBtn = modifWork.querySelector(".delete-work");
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await deleteWork(work.id);
    });

    modalGallery.appendChild(modifWork);
  });
}

// Fonction pour envoyer la requête DELETE à l'API
async function deleteWork(id) {
  const token = localStorage.getItem("token")
  if (!token) {
    alert("Vous devez être connecté pour supprimer un projet.")
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      // On filtre notre tableau local pour retirer le projet supprimé
      works = works.filter(work => work.id !== id)
      // On rafraîchit les deux galeries immédiatement
      displayWorks(works)
      displayModal(works)
    } else {
      alert("Impossible de supprimer ce projet.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
  }
}


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

const target3 = document.getElementById('btn-close-modale1')
target3.addEventListener('click', (event)=> {
  if (event.target === target3) {
    target1.style.display = "none"
    console.log("btn fermeture modale cliqué")}
  })

const target4 = document.getElementById('btn-retour-modale')
target4.addEventListener('click', (event)=> {
  if (event.target === target4) {
    target2.style.display = "none"
    target1.style.display = null
    target1.setAttribute('aria-hidden', 'false')
    target1.setAttribute('aria-modal', 'true')
    console.log("btn fermeture modale cliqué")}
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

const target5 = document.getElementById('btn-close-modale2')
target5.addEventListener('click', (event)=> {
  if (event.target === target5) {
    target2.style.display = "none"
    console.log("btn fermeture modale cliqué")}
  })


// APERÇU DE LA PHOTO DANS LA MODALE 2
const inputImage = document.getElementById("image-new-work")
const previewImage = document.getElementById("img-preview")
const uploadButton = document.querySelector(".formulaire button")
const infoText = document.querySelector(".formulaire p")
const defaultImageSrc = "./assets/images/no-picture-yet.png"

// Restreint nativement le choix aux imgs 
if (inputImage) {
  inputImage.setAttribute("accept", "image/png, image/jpeg")
}

if (inputImage && previewImage) {
  inputImage.addEventListener("change", (event) => {
    const file = event.target.files[0]

    if (file) {
      // Validation du format
      const validTypes = ["image/jpeg", "image/png"]
      if (!validTypes.includes(file.type)) {
        alert("Format invalide ! Veuillez choisir une image au format .jpg ou .png.")
        resetFormulaireImage()
        return;
      }

      // Validation de la taille (4 Mo)
      if (file.size > 4 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (4 Mo maximum).")
        resetFormulaireImage()
        return;
      }

      // Lecture et affichage de l'aperçu
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.src = e.target.result
        
        // On cache le bouton et le texte d'information
        if (uploadButton) uploadButton.style.display = "none"
        if (infoText) infoText.style.display = "none"
        
        // On change le curseur sur l'image pour indiquer qu'elle est cliquable
        previewImage.style.cursor = "pointer"
      };
      reader.readAsDataURL(file)
    }
  });

  // Img clickable
  previewImage.addEventListener("click", () => {
    if (previewImage.getAttribute("src") !== defaultImageSrc) {
      inputImage.click();
    }
  });
}

// Tout réinitialiser en cas d'erreur ou d'annulation
function resetFormulaireImage() {
  inputImage.value = ""
  previewImage.src = defaultImageSrc
  previewImage.style.cursor = "default"
  if (uploadButton) uploadButton.style.display = null // Remet le style CSS d'origine
  if (infoText) infoText.style.display = null
}

const submitinput = document.getElementById('submitinput')
const fileinput = document.getElementById('image-new-work')
const titleinput = document.getElementById('title-new-work')

function clickableinput() {
  const imgSrc = previewImage ? previewImage.getAttribute("src") : ""
  const titleValue = titleinput ? titleinput.value.trim() : ""
  const categoryValue = categoryNewWork ? categoryNewWork.value : ""

  if (
    imgSrc !== defaultImageSrc &&
    imgSrc !== "" &&
    titleValue !== "" && 
    categoryValue !== ""
  ) {
    submitinput.classList.remove("no-click-button")
    submitinput.disabled = false
    console.log("On peut valider le formulaire")
  } else {
    // Desactive le btn si on vide un champ
    submitinput.classList.add("no-click-button")
    submitinput.disabled = true
    console.log("formulaire incomplet")
  }
}

const addWorkForm = document.getElementById('post-form')

addWorkForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (!fileinput.files[0] || !titleinput.value.trim() || !categoryNewWork.value) {
    alert("Veuillez remplir tous les champs du formulaire.")
    return
  }
  const formData = new FormData()
  formData.append("image", fileinput.files[0])
  formData.append("title", titleinput.value.trim())
  formData.append("category", Number(categoryNewWork.value))

  const token = localStorage.getItem('token')

  try {
    const reponse = await fetch('http://localhost:5678/api/works', {
      method: 'POST', 
      headers: {'Authorization': `Bearer ${token}`},
      body: formData
    })

    if (reponse.ok) { 
      const newProject = await reponse.json()
      alert("Projet ajouté avec succès :)")
      works.push(newProject)
      displayWorks(works)
      displayModal(works)
      addWorkForm.reset()
      resetFormulaireImage()
      clickableinput(); // Désactive à nouveau le bouton de validation

    } else if (reponse.status === 401) {
      alert ('Veuillez vous connecter')
    } else {
      alert ('Une erreur est survenue.')
    }
  } catch (error) {
    console.error('Erreur de connection au serveur', error)
  }
})


if (inputImage) {
  inputImage.addEventListener("change", clickableinput)
}
if (titleinput) {
  titleinput.addEventListener("input", clickableinput)
}
if (categoryNewWork) {
  categoryNewWork.addEventListener("change", clickableinput)
}

getWorks()
getCategories()
document.addEventListener("DOMContentLoaded", checkAuth)