//RECUPERER LES DONNEES DANS L'API
/////Récupérer les travaux
async function getWorks(filter) {
  const url = "http://localhost:5678/api/works" //lien de l'API
  try {
    const reponse = await fetch(url)
    if (!reponse.ok) {
      throw new Error(`Statut de réponse : ${reponse.status}`)
    }

    const json = await reponse.json()
    console.log(json)

    for (let index = 0; index < json.length; index++) {
        setFigure(json[index])
    }
  } catch (erreur) {
    console.error(erreur.message)
  }
}
getWorks()

/////Récuper les catégories de filtre 
async function getCategories() {
  const url = "http://localhost:5678/api/categories" //lien de l'API
  try {
    const reponse = await fetch(url)
    if (!reponse.ok) {
      throw new Error(`Statut de réponse : ${reponse.status}`)
    }

    const json = await reponse.json()
    console.log(json)

    for (let index = 0; index < json.length; index++) {
        setFilter(json[index])
    }
    
  clickFilter()
  } catch (erreur) {
    console.error(erreur.message)
  }
}
getCategories()

// AJOUTER LES FILTRES  
const filtersBox = document.querySelector(".filters-container")

function setFilter(data) {
  const filterCreate = document.createElement("div")
  filterCreate.textContent = data.name
  filterCreate.classList.add('filter')
  filtersBox.appendChild(filterCreate)
}

function clickFilter(){
  const filter = document.getElementsByClassName("filter")
  Array.from(filter).forEach(filter => {
    filter.addEventListener("click", () => {
      console.log('test de la clickance');
    });
  });
}

//AJOUTER LES TRAVAUX  
const gallery = document.querySelector(".gallery")

function setFigure(data) {

    // console.log("Processing item:", data)
    // if (!data || !data.imageUrl){
    //     console.error("This item is missing data! ", data)
    //     return
    // }

  const figure = document.createElement("figure")

  figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
                      <figcaption>${data.title}</figcaption>`
  
  gallery.appendChild(figure)
}