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
  button.classList.add(categoryId) 

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
        return work.categoryId === categoryId
      })

      displayWorks(filteredWorks)
    }

    console.log(categoryId)
  })

  return button
}

getWorks()
getCategories()