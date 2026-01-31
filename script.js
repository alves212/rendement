let data = JSON.parse(localStorage.getItem('production')) || []

function ajouterJour() {
  const production = Number(document.getElementById('production').value)
  const rebus = Number(document.getElementById('rebus').value)

  if (!production) {
    alert('Veuillez entrer la production.')
    return
  }

  const today = new Date().toLocaleDateString('fr-FR')

  data.push({
    date: today,
    production,
    rebus,
  })

  sauvegarder()
  afficher()

  document.getElementById('production').value = ''
  document.getElementById('rebus').value = ''
}

function afficher() {
  let totalProd = 0
  let totalRebus = 0

  const historique = document.getElementById('historique')
  historique.innerHTML = ''

  data.forEach((jour, index) => {
    totalProd += jour.production
    totalRebus += jour.rebus

    historique.innerHTML += `
      <div class="jour">
        ${jour.date} — ${jour.production} produits — ${jour.rebus} rebus
        <br>
        <button onclick="modifier(${index})">Modifier</button>
      </div>
    `
  })

  const bons = totalProd - totalRebus
  const rendement = totalProd ? ((bons / totalProd) * 100).toFixed(2) : 0

  document.getElementById('resultat').innerHTML = `
    <strong>Total produit :</strong> ${totalProd}<br>
    <strong>Total rebus :</strong> ${totalRebus}<br>
    <strong>Moules conformes :</strong> ${bons}<br>
    <strong>Rendement :</strong> ${rendement} %
  `
}

function modifier(index) {
  const prod = prompt('Nouvelle production :', data[index].production)
  const reb = prompt('Nouveau rebus :', data[index].rebus)

  if (prod !== null && reb !== null) {
    data[index].production = Number(prod)
    data[index].rebus = Number(reb)

    sauvegarder()
    afficher()
  }
}

function sauvegarder() {
  localStorage.setItem('production', JSON.stringify(data))
}

function resetData() {
  if (confirm('Tout supprimer ?')) {
    data = []
    sauvegarder()
    afficher()
  }
}

window.onload = afficher
