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

function displayWorks(worksToDisplay) {
  gallery.innerHTML = "";

  worksToDisplay.forEach((work) => {
    const figure = document.createElement("figure")

    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                      <figcaption>${work.title}</figcaption>`

    gallery.appendChild(figure)
  })
}

function displayFilters(categories) {
  filtersBox.innerHTML = ""

  const allButton = createFilterButton("Tous", "all", true)

  filtersBox.appendChild(allButton)

  categories.forEach((category) => {
    const button = createFilterButton(category.name, category.id)

    console.log(button)

    filtersBox.appendChild(button)
  })
}

function createFilterButton(label, categoryId, isActive = false) {
  const button = document.createElement("button")

  button.textContent = label
  button.classList.add("filter") 

  if(isActive) {
    button.classList.add("active")
  }

  button.addEventListener("click",()=> {
    document.querySelectorAll(".filter").forEach((filter) =>{
      filter.classList.remove("active")
    })

  button.classList.add("active")

    if(categoryId = "all"){
      displayWorks(works)
    } else {
      const filteredWorks = works.filter((work) => {
        return work.categoryId === categoryId
      })

      displayWorks(filteredWorks)
    }
  })

  return button
}

getWorks()
getCategories()

console.log(gallery)
console.log(filtersBox)
// /////Fonction d'affichage 
// // function setFigure(data) {
// //   const figure = document.createElement("figure")

// //   gallery.innerHTML = ""

// //   figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
// //                     <figcaption>${data.title}</figcaption>`
  
// //   gallery.appendChild(figure)
// // }

// function setFigure(data) {

//     // console.log("Processing item:", data)
//     // if (!data || !data.imageUrl){
//     //     console.error("This item is missing data! ", data)
//     //     return
//     // }

//   // const figure = document.createElement("figure")

//   gallery.innerHTML = ""
//   // figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
//   //                     <figcaption>${data.title}</figcaption>`

//   // gallery.appendChild(figure)

// }



// /////Récuper les catégories de filtre 


// // AJOUTER LES FILTRES  
// const btnTous = document.querySelector(".tous")

// function setBtnTous() {
//     if (btnTous) {
//         btnTous.addEventListener("click", () => {
//             getWorks(); // affiche tous les travaux
//         });
//     }
// }

// function setFilter(data) {
//     const btn = document.createElement("a");
//     btn.textContent = data.name;
//     btn.classList.add('filter');
    
//     btn.addEventListener("click", () => {
//         // Si id est 0, on passe null pour tout afficher, sinon on passe l'id
//         getWorks(data.id === 0 ? null : data.id);
//         btn.classList.add('filter_active')
//     });

//     filtersBox.appendChild(btn);
// }