// test/citaService.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { crearCitaService } = require('../src/aplicacion/citaService');

function crearServicioParaPrueba(ocupado = false) {
  let guardadas = 0;
  let consultasDisponibilidad = 0;
  const servicio = crearCitaService({
    citaRepository: {
      listarTodas: async () => [],
      existeEnHorario: async () => {
        consultasDisponibilidad++;
        return ocupado;
      },
      guardar: async () => {
        guardadas++;
        return 7;
      }
    },
    profesionalRepository: { listarTodos: async () => [] },
    reloj: () => new Date('2026-10-01T00:00:00Z')
  });
  return {
    servicio,
    guardadas: () => guardadas,
    consultasDisponibilidad: () => consultasDisponibilidad
  };
}

test('1. reserva permitida', async () => {
  const x = crearServicioParaPrueba();
  const respuesta = await x.servicio.reservarCita({
    paciente: 'Ana',
    profesional_id: 1,
    fecha_hora: '2026-11-15T10:00:00Z'
  });
  assert.equal(respuesta.id, 7);
  assert.equal(x.guardadas(), 1);
});

test('2. agenda ocupada no genera escritura', async () => {
  const x = crearServicioParaPrueba(true);
  await assert.rejects(
    () =>
      x.servicio.reservarCita({
        paciente: 'Ana',
        profesional_id: 1,
        fecha_hora: '2026-11-15T10:00:00Z'
      }),
    { codigo: 'AGENDA_OCUPADA' }
  );
  assert.equal(x.guardadas(), 0);
});

test('3. fecha pasada se rechaza sin consultar PostgreSQL', async () => {
  const x = crearServicioParaPrueba();
  await assert.rejects(
    () =>
      x.servicio.reservarCita({
        paciente: 'Ana',
        profesional_id: 1,
        fecha_hora: '2026-09-01T10:00:00Z'
      }),
    { codigo: 'FECHA_PASADA' }
  );
  assert.equal(x.guardadas(), 0);
  assert.equal(x.consultasDisponibilidad(), 0);
});

// CUARTA PRUEBA DEL EQUIPO:
test('4. rechaza ensamblaje si citaRepository incumple el contrato (falta guardar)', () => {
  const repositorioIncompleto = {
    listarTodas: async () => [],
    existeEnHorario: async () => false
    // Falta el método guardar() deliberadamente
  };
  const profesionalRepoValido = {
    listarTodos: async () => []
  };

  assert.throws(
    () =>
      crearCitaService({
        citaRepository: repositorioIncompleto,
        profesionalRepository: profesionalRepoValido
      }),
    {
      name: 'TypeError',
      message: /citaRepository debe implementar.*guardar/i
    }
  );
});
