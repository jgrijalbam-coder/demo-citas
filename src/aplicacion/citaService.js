const reglas = require('../dominio/reglasDeAgenda');

const {
  validarCitaRepository,
  validarProfesionalRepository
} = require('./contratos/repositorios');

function crearCitaService({
  citaRepository,
  profesionalRepository,
  reloj = () => new Date()
}) {
  validarCitaRepository(citaRepository);
  validarProfesionalRepository(profesionalRepository);

  async function consultarCitas() {
    return citaRepository.listarTodas();
  }

  async function consultarProfesionales() {
    return profesionalRepository.listarTodos();
  }

  async function reservarCita(datos) {
    reglas.validarDatosCompletos(datos);
    reglas.validarFechaFutura(datos.fecha_hora, reloj());

    const ocupado = await citaRepository.existeEnHorario(
      datos.profesional_id,
      datos.fecha_hora
    );

    reglas.validarAgendaLibre(ocupado);

    const id = await citaRepository.guardar(datos);

    return { mensaje: 'Cita creada', id };
  }

  return {
    consultarCitas,
    consultarProfesionales,
    reservarCita
  };
}

module.exports = { crearCitaService };
