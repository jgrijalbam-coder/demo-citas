function validarContrato(nombre, repositorio, metodos) {
  for (const metodo of metodos) {
    if (typeof repositorio?.[metodo] !== 'function') {
      throw new TypeError(
        `${nombre} debe implementar el método ${metodo}()`
      );
    }
  }
}

function validarCitaRepository(repositorio) {
  validarContrato('citaRepository', repositorio, [
    'listarTodas',
    'existeEnHorario',
    'guardar'
  ]);
}

function validarProfesionalRepository(repositorio) {
  validarContrato('profesionalRepository', repositorio, [
    'listarTodos'
  ]);
}

// --- LO NUEVO DE LA GUÍA DE LA SEMANA 9 ---
function exigirMetodos(objeto, metodos, nombre) {
  validarContrato(nombre, objeto, metodos);
}

function verificarRepositorios({ citaRepository, profesionalRepository }) {
  validarCitaRepository(citaRepository);
  validarProfesionalRepository(profesionalRepository);
}

module.exports = {
  validarCitaRepository,
  validarProfesionalRepository,
  exigirMetodos,
  verificarRepositorios
};
