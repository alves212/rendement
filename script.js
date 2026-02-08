let allData = JSON.parse(localStorage.getItem('journees')) || {}
let historiqueVisible = false
let editIndex = null
let currentMonth = getMonthKey(new Date())
let editingMonth = null

const couleurs = ['red', 'yellow', 'green', 'gray', 'blue']
const tableValues = [
  [85, 89, 91, 94, 96.5],
  [50, 50, 50, 50, 50],
  [100, 170, 210, 250, 290],
  [160, 230, 270, 310, 350],
  [220, 290, 330, 370, 410],
  [280, 350, 390, 430, 470],
]

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

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getMonthData(monthKey) {
  return allData[monthKey] || []
}

function saveAllData() {
  localStorage.setItem('journees', JSON.stringify(allData))
}

function ajouterJour() {
  const production = Number(document.getElementById('production').value)
  if (!production) {
    alert('Veuillez entrer la production.')
    return
  }
  const today =
    document.getElementById('editDate').value ||
    new Date().toISOString().slice(0, 10)
  const monthKey = today.slice(0, 7)

  if (!allData[monthKey]) allData[monthKey] = []
  allData[monthKey].unshift({ date: today, production, rebus: 0 })
  saveAllData()

  if (monthKey === currentMonth) renderMonth()
  document.getElementById('production').value = ''
}

function renderMonth() {
  const data = getMonthData(currentMonth)
  const dernier = document.getElementById('dernierJour')
  const historique = document.getElementById('historique')
  dernier.innerHTML = ''
  historique.innerHTML = ''

  let totalProd = 0,
    totalRebus = 0

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

  updateRendement(totalProd, totalRebus)
}

function updateRendement(totalProd, totalRebus) {
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

  const moisIndex = Number(currentMonth.split('-')[1]) - 1
  const nomMois = moisFrancais[moisIndex]

  document.getElementById('resultat').innerHTML = `
    <strong>Total produit :</strong> ${totalProd}<br>
    <strong>Total rebus :</strong> ${totalRebus}<br>
    <strong>Moules conformes :</strong> ${bons}<br>
    <strong>Rendement du ${nomMois} :</strong> ${rendement} %
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
      if (i === 0) bg = `background-color: ${couleurs[j]};`
      else
        bg = `background: linear-gradient(90deg, ${couleurs[i - 1]} 50%, ${couleurs[j]} 50%);`
      tr += `<td style="${bg}" id="p${i}r${j}">${tableValues[i][j]}${i === 0 ? '%' : '€'}</td>`
    }
    tr += '</tr>'
    table.innerHTML += tr
  }
}

function calculerRendement() {
  const data = getMonthData(currentMonth)
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
  editingMonth = currentMonth
  const data = getMonthData(currentMonth)[index]
  document.getElementById('editDate').value = data.date
  document.getElementById('editProd').value = data.production
  document.getElementById('editRebus').value = data.rebus
  document.getElementById('modal').style.display = 'flex'
}

function saveEdit() {
  const newDate = document.getElementById('editDate').value
  const prod = Number(document.getElementById('editProd').value)
  const rebus = Number(document.getElementById('editRebus').value)

  const oldData = getMonthData(editingMonth)
  const jour = oldData.splice(editIndex, 1)[0]
  jour.date = newDate
  jour.production = prod
  jour.rebus = rebus

  const newMonthKey = newDate.slice(0, 7)
  if (!allData[newMonthKey]) allData[newMonthKey] = []
  allData[newMonthKey].unshift(jour)

  saveAllData()
  document.getElementById('modal').style.display = 'none'

  if (editingMonth === currentMonth || newMonthKey === currentMonth)
    renderMonth()
}

function supprimer(index) {
  const data = getMonthData(currentMonth)
  if (confirm('Supprimer cette journée ?')) {
    data.splice(index, 1)
    saveAllData()
    renderMonth()
  }
}

function resetData() {
  if (confirm('Voulez-vous vraiment tout supprimer ?')) {
    if (confirm('Cette action est irréversible. Confirmez encore ?')) {
      const confirmation = prompt("Pour confirmer, tapez 'RESET' :")
      if (confirmation && confirmation.toUpperCase() === 'RESET') {
        allData = {}
        saveAllData()
        renderMonth()
      }
    }
  }
}

// MIGRAÇÃO DOS DADOS ANTIGOS
function migrerProductionAncienne() {
  const oldProduction = localStorage.getItem('production')
  const newJournees = localStorage.getItem('journees')

  if (oldProduction && !newJournees) {
    const oldData = JSON.parse(oldProduction)
    const migrated = {}

    oldData.forEach((j) => {
      let dateObj
      if (j.date.includes('/')) {
        const [d, m, y] = j.date.split('/')
        dateObj = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`)
      } else {
        dateObj = new Date(j.date)
      }

      const isoDate = dateObj.toISOString().slice(0, 10)
      const monthKey = isoDate.slice(0, 7)

      if (!migrated[monthKey]) migrated[monthKey] = []

      const exists = migrated[monthKey].some(
        (e) => e.date === isoDate && e.production === j.production,
      )
      if (!exists) {
        migrated[monthKey].push({
          date: isoDate,
          production: j.production,
          rebus: j.rebus || 0,
        })
      }
    })

    localStorage.setItem('journees', JSON.stringify(migrated))
    localStorage.removeItem('production')
    console.log('Migração concluída, dados antigos preservados!')
  }
}

window.onload = () => {
  migrerProductionAncienne()
  allData = JSON.parse(localStorage.getItem('journees')) || {}
  renderMonth()
  document.getElementById('paiement').style.display = 'block'
  creerTableauPaiement()
  setupSwipe()
}

function creerTableauPaiement() {
  majPaiement(calculerRendement())
}

function setupSwipe() {
  let startX = 0
  const container = document.querySelector('.container')

  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX
  })

  container.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - startX
    if (Math.abs(delta) > 60) delta < 0 ? shiftMonth(1) : shiftMonth(-1)
  })
}

function closeModal() {
  document.getElementById('modal').style.display = 'none'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function shiftMonth(offset) {
  const [y, m] = currentMonth.split('-').map(Number)
  const d = new Date(y, m - 1 + offset, 1)
  const newMonthKey = getMonthKey(d)

  if (!allData[newMonthKey] || allData[newMonthKey].length === 0) return

  currentMonth = newMonthKey
  renderMonth()
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('Service Worker registrado:', reg))
      .catch((err) => console.log('Erro ao registrar SW:', err))
  })
}
