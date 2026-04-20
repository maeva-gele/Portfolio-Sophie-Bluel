//RECUPERER LES DONNEES DANS L'API

async function getWorks() {
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
  } catch (erreur) {
    console.error(erreur.message)
  }
}  
getCategories()

// CREER LES FILTRES 
const filters = document.querySelector(".filters")

function setFilter(data) {

  const filter = document.createElement("div")

  filter.innerHTML = data.name

  filters.appendChild(filter)
}


//CREER LES <figure> DANS LE HTML 
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