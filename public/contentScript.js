let miElemento = document.getElementById('wrapper')

if (miElemento) {
  let nuevoElemento = document.createElement('div')
  nuevoElemento.textContent = 'Este es un nuevo elemento agregado por mi extensión de Chrome.'
  miElemento.appendChild(nuevoElemento)
}