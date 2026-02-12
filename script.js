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
  if (!allData[monthKey]) allData[monthKey] = []
  return allData[monthKey]
}

function saveAllData() {
  localStorage.setItem('journees', JSON.stringify(allData))
}

function enforceMonthLimit() {
  const months = Object.keys(allData).sort()
  if (months.length > 13) {
    delete allData[months[0]]
  }
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
  const data = getMonthData(monthKey)

  // ✅ Limite real de 28 dias
  if (data.length >= 28) {
    alert("Impossible d'ajouter ce jour : le mois contient déjà 28 jours.")
    return
  }

  data.push({ date: today, production, rebus: 0 })

  enforceMonthLimit()
  saveAllData()

  if (monthKey === currentMonth) renderMonth()
  document.getElementById('production').value = ''
}

function renderMonth() {
  const data = getMonthData(currentMonth)

  // ✅ Ordena array REAL
  data.sort((a, b) => new Date(b.date) - new Date(a.date))

  const dernier = document.getElementById('dernierJour')
  const historique = document.getElementById('historique')
  dernier.innerHTML = ''
  historique.innerHTML = ''

  let totalProd = 0
  let totalRebus = 0

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

  document.body.className = ''

  if (rendement < 85) document.body.classList.add('bg-normal')
  else if (rendement < 89) document.body.classList.add('bg-rouge')
  else if (rendement < 91) document.body.classList.add('bg-jaune')
  else if (rendement < 94) document.body.classList.add('bg-vert')
  else if (rendement < 96.5) document.body.classList.add('bg-gris')
  else if (rendement < 100) document.body.classList.add('bg-bleu')
  else document.body.classList.add('bg-100')

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

function calculerRendement() {
  const data = getMonthData(currentMonth)
  let totalProd = 0
  let totalRebus = 0

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
  const newMonthData = getMonthData(newMonthKey)

  // Limite de 28 dias por mês
  if (newMonthKey !== editingMonth && newMonthData.length >= 28) {
    alert('Impossible de déplacer : le mois cible contient déjà 28 jours.')
    oldData.splice(editIndex, 0, jour) // volta o item no array antigo
    return
  }

  newMonthData.push(jour) // adiciona
  // 🔹 Ordena o array do mês novo por data (mais recente primeiro)
  newMonthData.sort((a, b) => new Date(b.date) - new Date(a.date))

  enforceMonthLimit()
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

function majPaiement() {
  const table = document.querySelector('#paiement table')
  table.innerHTML = ''

  for (let i = 0; i < tableValues.length; i++) {
    let tr = '<tr>'
    for (let j = 0; j < tableValues[i].length; j++) {
      let bg = ''
      if (i === 0) bg = `background-color:${couleurs[j]};`
      else
        bg = `background:linear-gradient(90deg,${couleurs[i - 1]} 50%,${couleurs[j]} 50%);`

      tr += `<td style="${bg}">
        ${tableValues[i][j]}${i === 0 ? '%' : '€'}
      </td>`
    }
    tr += '</tr>'
    table.innerHTML += tr
  }
}

function shiftMonth(offset) {
  const [y, m] = currentMonth.split('-').map(Number)
  const d = new Date(y, m - 1 + offset, 1)
  const newMonthKey = getMonthKey(d)

  if (!allData[newMonthKey] || allData[newMonthKey].length === 0) return

  currentMonth = newMonthKey
  renderMonth()
}

function closeModal() {
  document.getElementById('modal').style.display = 'none'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetData() {
  if (confirm('Voulez-vous vraiment tout supprimer ?')) {
    const confirmReset = prompt("Tapez 'RESET' pour confirmer :")
    if (confirmReset && confirmReset.toUpperCase() === 'RESET') {
      allData = {}
      saveAllData()
      renderMonth()
    }
  }
}

window.onload = () => {
  renderMonth()
  document.getElementById('paiement').style.display = 'block'
}
