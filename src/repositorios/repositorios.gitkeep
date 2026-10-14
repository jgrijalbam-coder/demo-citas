
function validarContrato(nombre, repositorio, metodos) {
  for (const metodo of metodos) {
    if (typeof repositorio[metodo] !== 'function') {
      throw new Error(
        `${nombre} debe implementar el método ${metodo}`
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

module.exports = {
  validarCitaRepository,
  validarProfesionalRepository
};

