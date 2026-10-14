
const test = require('node:test');
const assert = require('node:assert/strict');

const { crearCitaService } = require('../src/aplicacion/citaService');
const { ErrorDeNegocio } = require('../src/dominio/reglasDeAgenda');
const {
  validarCitaRepository
} = require('../src/aplicacion/contratos/repositorios');

function crearRepositoriosSimulados() {
  const citaRepository = {
    listarTodas: async () => [],
    existeEnHorario: async () => false,
    guardar: async () => 123
  };

  const profesionalRepository = {
    listarTodos: async () => [
      { id: 1, nombre: 'Profesional de prueba', especialidad: 'General' }
    ]
  };

  return { citaRepository, profesionalRepository };
}

test('1. Reserva una cita cuando el horario está libre', async () => {
  const { citaRepository, profesionalRepository } =
    crearRepositoriosSimulados();

  const service = crearCitaService({
    citaRepository,
    profesionalRepository
  });

  const resultado = await service.reservarCita({
    paciente: 'Paciente de prueba',
    profesional_id: 1,
    fecha_hora: '2099-12-31T10:00:00.000Z'
  });

  assert.deepEqual(resultado, {
    mensaje: 'Cita creada',
    id: 123
  });
});

test('2. Rechaza una cita cuando el horario está ocupado', async () => {
  const { citaRepository, profesionalRepository } =
    crearRepositoriosSimulados();

  citaRepository.existeEnHorario = async () => true;

  const service = crearCitaService({
    citaRepository,
    profesionalRepository
  });

  await assert.rejects(
    service.reservarCita({
      paciente: 'Paciente de prueba',
      profesional_id: 1,
      fecha_hora: '2099-12-31T10:00:00.000Z'
    }),
    error =>
      error instanceof ErrorDeNegocio &&
      error.codigo === 'AGENDA_OCUPADA'
  );
});

test('3. Rechaza una cita con fecha pasada sin consultar disponibilidad', async () => {
  const { citaRepository, profesionalRepository } =
    crearRepositoriosSimulados();

  let consultas = 0;

  citaRepository.existeEnHorario = async () => {
    consultas++;
    return false;
  };

  const service = crearCitaService({
    citaRepository,
    profesionalRepository
  });

  await assert.rejects(
    service.reservarCita({
      paciente: 'Paciente de prueba',
      profesional_id: 1,
      fecha_hora: '2000-01-01T10:00:00.000Z'
    }),
    error =>
      error instanceof ErrorDeNegocio &&
      error.codigo === 'FECHA_PASADA'
  );

  assert.equal(consultas, 0);
});

test('4. Rechaza un repositorio que no cumple el contrato', () => {
  const repositorioIncompleto = {
    listarTodas: async () => []
  };

  assert.throws(
    () => validarCitaRepository(repositorioIncompleto),
    /existeEnHorario/
  );
});

