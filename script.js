const PRODUCTION_JOUR = 54

const joursInput = document.getElementById('jours')
const erreursInput = document.getElementById('erreurs')
const resultatDiv = document.getElementById('resultat')
const btn = document.getElementById('btnCalculer')

// Charger données sauvegardées
window.onload = () => {
  const jours = localStorage.getItem('jours')
  const erreurs = localStorage.getItem('erreurs')
  const resultat = localStorage.getItem('resultat')

  if (jours) joursInput.value = jours
  if (erreurs) erreursInput.value = erreurs
  if (resultat) resultatDiv.innerHTML = resultat
}

btn.addEventListener('click', calculer)

function calculer() {
  const jours = Number(joursInput.value)
  const erreurs = Number(erreursInput.value)

  if (!jours) {
    alert('Veuillez entrer le nombre de jours ouvrés.')
    return
  }

  const totalFabrique = jours * PRODUCTION_JOUR
  const moulesBons = totalFabrique - erreurs
  const pourcentage = ((moulesBons / totalFabrique) * 100).toFixed(2)

  const html = `
    <strong>Total fabriqué :</strong> ${totalFabrique}<br>
    <strong>Moules conformes :</strong> ${moulesBons}<br>
    <strong>Rendement :</strong> ${pourcentage} %
  `

  resultatDiv.innerHTML = html

  // Sauvegarde locale
  localStorage.setItem('jours', jours)
  localStorage.setItem('erreurs', erreurs)
  localStorage.setItem('resultat', html)
}
