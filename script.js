let data = JSON.parse(localStorage.getItem('production')) || []

let historiqueVisible = false

let editIndex = null

const moisFrancais = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

function ajouterJour() {
  const production = Number(document.getElementById('production').value)

  if (!production) {
    alert('Veuillez entrer la production.')
    return
  }

  const today = new Date().toLocaleDateString('fr-FR')

  data.unshift({
    date: today,
    production,
    rebus: 0,
  })

  sauvegarder()
  afficher()

  document.getElementById('production').value = ''
}

function afficher() {
  let totalProd = 0
  let totalRebus = 0

  const dernier = document.getElementById('dernierJour')
  const historique = document.getElementById('historique')

  dernier.innerHTML = ''
  historique.innerHTML = ''

  data.forEach((jour, index) => {
    totalProd += jour.production
    totalRebus += jour.rebus

    const ligne = `
      <div class="jour">
        ${jour.date} — ${jour.production} produits — ${jour.rebus} rebus
        <div class="actions">
          <button class="edit" onclick="modifier(${index})">Modifier</button>
          <button class="delete" onclick="supprimer(${index})">Supprimer</button>
        </div>
      </div>
    `

    if (index < 2) dernier.innerHTML += ligne
    else historique.innerHTML += ligne
  })

  const bons = totalProd - totalRebus
  const rendement = totalProd ? ((bons / totalProd) * 100).toFixed(2) : 0

  // couleur fond
  const body = document.body
  body.className = ''

  if (rendement <= 88) body.classList.add('bg-normal')
  else if (rendement <= 91) body.classList.add('bg-jaune')
  else if (rendement <= 93) body.classList.add('bg-rouge')
  else if (rendement <= 96) body.classList.add('bg-gris')
  else if (rendement <= 99.99) body.classList.add('bg-bleu')
  else body.classList.add('bg-vert')

  let mois = ''
  if (data.length > 0) {
    const firstDate = new Date(
      data[data.length - 1].date.split('/').reverse().join('/'),
    )
    mois = moisFrancais[firstDate.getMonth()]
  }

  document.getElementById('resultat').innerHTML = `
  <strong>Total produit :</strong> ${totalProd}<br>
  <strong>Total rebus :</strong> ${totalRebus}<br>
  <strong>Moules conformes :</strong> ${bons}<br>
  <strong>Rendement du ${mois} :</strong> ${rendement} %
`
}

function toggleHistorique() {
  historiqueVisible = !historiqueVisible
  const hist = document.getElementById('historique')

  hist.style.display = historiqueVisible ? 'block' : 'none'
}

function modifier(index) {
  editIndex = index

  document.getElementById('editDate').value = data[index].date
  document.getElementById('editProd').value = data[index].production
  document.getElementById('editRebus').value = data[index].rebus

  document.getElementById('modal').style.display = 'flex'
}

function supprimer(index) {
  if (confirm('Supprimer cette journée ?')) {
    data.splice(index, 1)
    sauvegarder()
    afficher()
  }
}

function sauvegarder() {
  localStorage.setItem('production', JSON.stringify(data))
}

function closeModal() {
  document.getElementById('modal').style.display = 'none'

  // Garante que o container volte ao topo da tela
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // suave, opcional
  })
}

function saveEdit() {
  data[editIndex].date = document.getElementById('editDate').value
  data[editIndex].production = Number(document.getElementById('editProd').value)
  data[editIndex].rebus = Number(document.getElementById('editRebus').value)

  sauvegarder()
  afficher()
  closeModal()
}

function resetData() {
  // Primeiro alerta
  if (confirm('Voulez-vous vraiment tout supprimer ?')) {
    // Segundo alerta reforçando a irreversibilidade
    if (confirm('Cette action est irréversible. Confirmez encore ?')) {
      // Prompt para digitar 'RESET', ignorando maiúsculas/minúsculas
      const confirmation = prompt("Pour confirmer, tapez 'RESET' :")
      if (confirmation && confirmation.toUpperCase() === 'RESET') {
        data = []
        sauvegarder()
        afficher()
      }
      // Se não digitar RESET, nada acontece (silencioso)
    }
  }
}

window.onload = afficher

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('Service Worker registrado:', reg))
      .catch((err) => console.log('Erro ao registrar SW:', err))
  })
}
