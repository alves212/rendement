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

const couleurs = ['red', 'yellow', 'green', 'gray', 'blue']
const tableValues = [
  [85, 89, 91, 94, 96.5], // primeira linha: rendimento %
  [50, 50, 50, 50, 50],
  [100, 170, 210, 250, 290],
  [160, 230, 270, 310, 350],
  [220, 290, 330, 370, 410],
  [280, 350, 390, 430, 470],
]

function ajouterJour() {
  const production = Number(document.getElementById('production').value)
  if (!production) {
    alert('Veuillez entrer la production.')
    return
  }
  const today = new Date().toLocaleDateString('fr-FR')
  data.unshift({ date: today, production, rebus: 0 })
  sauvegarder()
  afficher()
  document.getElementById('production').value = ''
}

function afficher() {
  let totalProd = 0,
    totalRebus = 0
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
  const body = document.body
  body.className = ''
  if (rendement < 85) body.classList.add('bg-normal')
  else if (rendement < 89) body.classList.add('bg-rouge')
  else if (rendement < 91) body.classList.add('bg-jaune')
  else if (rendement < 94) body.classList.add('bg-vert')
  else if (rendement < 96.5) body.classList.add('bg-gris')
  else if (rendement < 100) body.classList.add('bg-bleu')
  else body.classList.add('bg-100')

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

  majPaiement(rendement)
}

function toggleHistorique() {
  historiqueVisible = !historiqueVisible
  const hist = document.getElementById('historique')
  const btn = document.querySelector('.button-group button:not(.reset)')
  const paiement = document.getElementById('paiement')

  if (historiqueVisible) {
    hist.style.display = 'block'
    paiement.style.display = 'none'
    btn.textContent = '▲ Fermer ▲'
  } else {
    hist.style.display = 'none'
    paiement.style.display = 'block'
    btn.textContent = '▼Afficher ▼'
    majPaiement(calculerRendement())
  }
}

function majPaiement(rendement) {
  const table = document.querySelector('#paiement table')
  table.innerHTML = ''

  for (let i = 0; i < tableValues.length; i++) {
    let tr = '<tr>'
    for (let j = 0; j < tableValues[i].length; j++) {
      let bg = ''
      if (i === 0) {
        bg = `background-color: ${couleurs[j]};`
      } else {
        bg = `background: linear-gradient(90deg, ${couleurs[i - 1]} 50%, ${couleurs[j]} 50%);`
      }
      tr += `<td style="${bg}" id="p${i}r${j}">${tableValues[i][j]}${i === 0 ? '%' : '€'}</td>`
    }
    tr += '</tr>'
    table.innerHTML += tr
  }
}

function calculerRendement() {
  let totalProd = 0,
    totalRebus = 0
  data.forEach((j) => {
    totalProd += j.production
    totalRebus += j.rebus
  })
  return totalProd ? ((totalProd - totalRebus) / totalProd) * 100 : 0
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
  if (confirm('Voulez-vous vraiment tout supprimer ?')) {
    if (confirm('Cette action est irréversible. Confirmez encore ?')) {
      const confirmation = prompt("Pour confirmer, tapez 'RESET' :")
      if (confirmation && confirmation.toUpperCase() === 'RESET') {
        data = []
        sauvegarder()
        afficher()
      }
    }
  }
}

window.onload = () => {
  afficher()
  document.getElementById('paiement').style.display = 'block'
  creerTableauPaiement()
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('Service Worker registrado:', reg))
      .catch((err) => console.log('Erro ao registrar SW:', err))
  })
}

// Função para criar a tabela inicialmente
function creerTableauPaiement() {
  const table = document.querySelector('#paiement table')
  if (!table) return
  majPaiement(calculerRendement())
}
