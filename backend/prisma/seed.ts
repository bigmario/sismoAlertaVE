import { PrismaClient, EstadoPersona, RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el sembrado de datos (Seeding)...');

  // 1. Limpiar base de datos
  await prisma.historialEstado.deleteMany({});
  await prisma.personaAfectada.deleteMany({});
  await prisma.reportante.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.apiKey.deleteMany({});

  // 2. Crear Usuarios (Administradores y Rescatistas)
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordRescatista = await bcrypt.hash('VE2026', 10);

  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Administrador Central',
      email: 'admin@sismoalerta.ve',
      password_hash: passwordAdmin,
      rol: RolUsuario.SUPERADMIN,
    },
  });

  const bombero = await prisma.usuario.create({
    data: {
      nombre: 'Sgto. José Valero',
      email: 'bombero@sismoalerta.ve',
      password_hash: passwordRescatista,
      rol: RolUsuario.RESCATISTA,
    },
  });

  const pc = await prisma.usuario.create({
    data: {
      nombre: 'Lic. Yusmary Lugo',
      email: 'pc@sismoalerta.ve',
      password_hash: passwordRescatista,
      rol: RolUsuario.RESCATISTA,
    },
  });

  console.log('✔ Usuarios registrados con éxito.');

  // 3. Crear una API Key de prueba (Organización aliada: Cruz Roja)
  // Llave cruda: sa_ve_cruz_roja_demo_key
  // Hash SHA-256 de la llave cruda:
  const rawKey = 'sa_ve_cruz_roja_demo_key';
  const keyHash = require('crypto').createHash('sha256').update(rawKey).digest('hex');

  await prisma.apiKey.create({
    data: {
      key_hash: keyHash,
      nombre_organizacion: 'Cruz Roja Venezolana',
      limite_rate: 5000,
    },
  });

  console.log(`✔ API Key de prueba creada. Key cruda: "${rawKey}"`);

  // 4. Crear Reportantes y Casos de Personas Afectadas

  // Caso 1: Desaparecido
  const rep1 = await prisma.reportante.create({
    data: {
      nombre: 'Ana Gómez',
      telefono: '04125554321',
      parentesco: 'Familiar',
    },
  });

  const per1 = await prisma.personaAfectada.create({
    data: {
      cedula: 'V-18234567',
      nombre: 'Luis',
      apellido: 'Gómez',
      edad: 28,
      ultimo_avistamiento_lat: 10.4891,
      ultimo_avistamiento_lng: -66.8682,
      ultimo_avistamiento_direccion: 'Avenida Francisco de Miranda, Altamira (cerca de la plaza)',
      estado: EstadoPersona.DESAPARECIDO,
      descripcion_salud: 'Ileso al momento del sismo. Vestía camisa azul y jean.',
      reportante_id: rep1.id,
    },
  });

  await prisma.historialEstado.create({
    data: {
      persona_id: per1.id,
      estado_anterior: null,
      estado_nuevo: EstadoPersona.DESAPARECIDO,
      fuente: 'Formulario Ciudadano de Reporte',
      motivo: 'Registro inicial del caso por su hermana Ana Gómez.',
      autor_nombre: 'Ana Gómez',
    },
  });

  // Caso 2: Rescatado
  const rep2 = await prisma.reportante.create({
    data: {
      nombre: 'Carlos Rodríguez',
      telefono: '04149998877',
      parentesco: 'Amigo',
    },
  });

  const per2 = await prisma.personaAfectada.create({
    data: {
      cedula: 'V-12999888',
      nombre: 'María',
      apellido: 'Rodríguez',
      edad: 45,
      ultimo_avistamiento_lat: 10.4912,
      ultimo_avistamiento_lng: -66.8532,
      ultimo_avistamiento_direccion: 'Urb. Los Palos Grandes, Edificio Los Pinos, Piso 3',
      estado: EstadoPersona.RESCATADO,
      descripcion_salud: 'Rescatada de los escombros. Deshidratada y con raspones leves en las piernas.',
      reportante_id: rep2.id,
    },
  });

  await prisma.historialEstado.createMany({
    data: [
      {
        persona_id: per2.id,
        estado_anterior: null,
        estado_nuevo: EstadoPersona.DESAPARECIDO,
        fuente: 'Formulario Ciudadano de Reporte',
        motivo: 'Reportado inicialmente por su amigo Carlos.',
        autor_nombre: 'Carlos Rodríguez',
        created_at: new Date(Date.now() - 3600000 * 3), // Hace 3 horas
      },
      {
        persona_id: per2.id,
        estado_anterior: EstadoPersona.DESAPARECIDO,
        estado_nuevo: EstadoPersona.RESCATADO,
        fuente: 'Bomberos de Distrito Capital',
        motivo: 'Localizada y evacuada con éxito por la unidad especial de rescate urbano.',
        autor_id: bombero.id,
        autor_nombre: bombero.nombre,
        created_at: new Date(Date.now() - 600000), // Hace 10 min
      },
    ],
  });

  // Caso 3: Ubicado
  const rep3 = await prisma.reportante.create({
    data: {
      nombre: 'Sofía Hernández',
      telefono: '04163332211',
      parentesco: 'Madre',
    },
  });

  const per3 = await prisma.personaAfectada.create({
    data: {
      cedula: null,
      nombre: 'Alejandro',
      apellido: 'Hernández',
      edad: 12,
      ultimo_avistamiento_lat: 10.4806,
      ultimo_avistamiento_lng: -66.9036,
      ultimo_avistamiento_direccion: 'Colegio en Chacao',
      estado: EstadoPersona.UBICADO,
      descripcion_salud: 'Ubicado sano e ileso en el refugio temporal del Polideportivo Chacao.',
      reportante_id: rep3.id,
    },
  });

  await prisma.historialEstado.createMany({
    data: [
      {
        persona_id: per3.id,
        estado_anterior: null,
        estado_nuevo: EstadoPersona.DESAPARECIDO,
        fuente: 'Formulario Ciudadano de Reporte',
        motivo: 'Reportado por su madre tras perder contacto en el colegio.',
        autor_nombre: 'Sofía Hernández',
        created_at: new Date(Date.now() - 3600000 * 5),
      },
      {
        persona_id: per3.id,
        estado_anterior: EstadoPersona.DESAPARECIDO,
        estado_nuevo: EstadoPersona.UBICADO,
        fuente: 'Protección Civil Nacional',
        motivo: 'Trasladado al refugio temporal del Polideportivo, reunificado con su madre.',
        autor_id: pc.id,
        autor_nombre: pc.nombre,
        created_at: new Date(Date.now() - 3600000 * 2),
      },
    ],
  });

  console.log('✔ Personas afectadas y registros de auditoría sembrados.');
  console.log('Sembrado de datos finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error durante el sembrado de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
