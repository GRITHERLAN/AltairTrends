// ============================================================
// legal.js
// Textos de los documentos legales de AltairTrends (Colombia):
//   - Política de Tratamiento de Datos Personales (Ley 1581 de 2012,
//     Decreto 1377 de 2013, compilado en el Decreto 1074 de 2015).
//   - Términos y Condiciones (Ley 1480 de 2011 - Estatuto del Consumidor,
//     modificada por la Ley 2439 de 2024, y Ley 527 de 1999).
//   - Política de Cookies.
//
// Cada documento es una lista de secciones { titulo, parrafos, lista }.
// La página PaginaLegal.jsx los pinta; el correo y el teléfono del
// Responsable salen de la configuración de Contacto (panel admin).
//
// IMPORTANTE: si cambia el contenido de la Política de privacidad,
// actualiza VERSION_POLITICA y FECHA_VIGENCIA. La versión se guarda con
// cada mensaje de Contacto como prueba de qué texto autorizó la persona.
// ============================================================

// Versión de la Política de privacidad (máx. 20 caracteres) y fecha desde la que rige.
export const VERSION_POLITICA = '2026-10-23';
export const FECHA_VIGENCIA = '23 de octubre de 2026';

// Responsable del tratamiento y proveedor de la tienda (persona natural).
export const RESPONSABLE = {
  nombre: 'Natalia García Ramírez',
  documento: 'Cédula de ciudadanía 1.088.350.511',
  direccion: 'Calle 43 # 7-29',
  ciudad: 'Dosquebradas, Risaralda, Colombia',
  marca: 'AltairTrends',
};

// ---------- Política de Tratamiento de Datos Personales ----------
const PRIVACIDAD = {
  ruta: '/privacidad',
  titulo: 'Política de Tratamiento de Datos Personales',
  resumen:
    'Te explicamos qué datos personales recogemos en AltairTrends, para qué los usamos, cuánto tiempo los guardamos y cómo puedes ejercer tus derechos como titular.',
  secciones: [
    {
      titulo: '1. Marco legal',
      parrafos: [
        'Esta política se rige por el artículo 15 de la Constitución Política de Colombia (derecho al Habeas Data), la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013, compilado en el Decreto Único Reglamentario 1074 de 2015, así como por las instrucciones de la Superintendencia de Industria y Comercio (SIC).',
      ],
    },
    {
      titulo: '2. Definiciones',
      lista: [
        'Titular: la persona natural cuyos datos personales son objeto de tratamiento (por ejemplo, quien nos escribe por el formulario de Contacto).',
        'Dato personal: cualquier información que identifica o puede identificar a una persona natural, como el nombre o el correo electrónico.',
        'Tratamiento: cualquier operación sobre datos personales, como recolectarlos, guardarlos, usarlos, enviarlos o eliminarlos.',
        'Responsable: quien decide sobre la base de datos y el tratamiento (la persona indicada en "Responsable del tratamiento").',
        'Encargado: quien trata datos por cuenta del Responsable (por ejemplo, el proveedor de alojamiento).',
        'Autorización: el consentimiento previo, expreso e informado del Titular para tratar sus datos.',
      ],
    },
    {
      titulo: '3. Datos que recogemos',
      lista: [
        'Formulario de Contacto: nombre, correo electrónico y el contenido de tu mensaje.',
        'Cuentas de acceso (solo para las personas a las que el Responsable crea una cuenta): correo electrónico y nombre. La contraseña nunca se guarda en texto: el proveedor de autenticación solo conserva una huella cifrada e irreversible (hash).',
        'Datos técnicos de seguridad: la dirección IP desde la que se envía un mensaje o se pulsa "Comprar". Se guarda seudonimizada (convertida en un código irreversible) y se borra en un máximo de 24 horas. Solo sirve para frenar envíos automáticos y abusos.',
        'No recogemos datos sensibles (salud, origen étnico, orientación política o religiosa, datos biométricos, etc.) ni datos financieros. En este sitio no se realizan pagos: el botón "Comprar" te lleva al canal externo de venta (por ejemplo, WhatsApp), que tiene sus propias políticas.',
        'El sitio no está dirigido a menores de 18 años y no recogemos sus datos de forma intencional. Si detectamos datos de un menor sin autorización de su representante legal, los eliminamos.',
      ],
    },
    {
      titulo: '4. Finalidades del tratamiento',
      parrafos: ['Usamos tus datos únicamente para:'],
      lista: [
        'Responder tus preguntas, solicitudes, peticiones, quejas o reclamos enviados por el formulario de Contacto.',
        'Gestionar las cuentas de acceso al sitio y su seguridad.',
        'Prevenir fraudes, envíos automáticos (bots) y ataques informáticos.',
        'Elaborar estadísticas internas y agregadas de interés por los productos (cuántas veces se pulsa "Comprar" en cada producto o categoría), sin asociarlas a ninguna persona.',
        'Cumplir las obligaciones legales y atender los requerimientos de las autoridades competentes.',
      ],
    },
    {
      titulo: '5. Autorización',
      parrafos: [
        'Antes de enviar el formulario de Contacto debes marcar la casilla de autorización, que aparece siempre sin marcar. Tu silencio o inacción nunca se entiende como autorización. Guardamos la fecha y la versión de esta política que aceptaste, como prueba de la autorización.',
        'Puedes revocar tu autorización en cualquier momento escribiendo al correo del Responsable, salvo cuando exista un deber legal o contractual de conservar los datos.',
      ],
    },
    {
      titulo: '6. Derechos del Titular',
      parrafos: ['De acuerdo con el artículo 8 de la Ley 1581 de 2012, tienes derecho a:'],
      lista: [
        'Conocer, actualizar y rectificar tus datos personales.',
        'Solicitar prueba de la autorización que nos diste.',
        'Ser informado, previa solicitud, sobre el uso que le hemos dado a tus datos.',
        'Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley, una vez hayas agotado el trámite de consulta o reclamo ante el Responsable.',
        'Revocar la autorización y solicitar la supresión de tus datos cuando no se respeten los principios, derechos y garantías legales.',
        'Acceder de forma gratuita a tus datos personales, al menos una vez cada mes calendario y cada vez que cambie sustancialmente esta política.',
      ],
    },
    {
      titulo: '7. Cómo ejercer tus derechos',
      parrafos: [
        'La atención de consultas y reclamos está a cargo directamente del Responsable. Escribe al correo electrónico indicado en "Responsable del tratamiento" con el asunto "Habeas Data", indicando tu nombre, el correo con el que nos escribiste, lo que solicitas y, si aplica, los documentos que quieras hacer valer.',
      ],
      lista: [
        'Consultas: se responden en un máximo de diez (10) días hábiles desde su recibo. Si no es posible en ese plazo, te informaremos el motivo y la nueva fecha, que no superará cinco (5) días hábiles adicionales (artículo 14 de la Ley 1581 de 2012).',
        'Reclamos (corrección, actualización, supresión o revocatoria): se responden en un máximo de quince (15) días hábiles, prorrogables hasta ocho (8) días hábiles más, informándote el motivo (artículo 15 de la Ley 1581 de 2012).',
        'Si el reclamo está incompleto, te pediremos completarlo dentro de los cinco (5) días siguientes. Si pasan dos (2) meses sin que lo completes, se entenderá que desististe.',
        'Para proteger tus datos, podemos pedirte que confirmes tu identidad antes de entregar o modificar información.',
      ],
    },
    {
      titulo: '8. Encargados y transferencia internacional de datos',
      parrafos: [
        'Para funcionar, el sitio utiliza proveedores tecnológicos que actúan como Encargados del tratamiento y guardan los datos en servidores ubicados en los Estados Unidos de América, país que la SIC reconoce con un nivel adecuado de protección de datos:',
      ],
      lista: [
        'Supabase Inc.: base de datos, autenticación de cuentas y almacenamiento de imágenes de productos.',
        'Vercel Inc.: alojamiento y entrega de la página web.',
        'Cloudflare Inc.: gestión del dominio (DNS) y protección de la red.',
      ],
    },
    {
      titulo: '9. Medidas de seguridad',
      lista: [
        'Toda la comunicación con el sitio viaja cifrada mediante HTTPS (TLS).',
        'Los mensajes del formulario de Contacto se guardan cifrados (AES-256) y solo el Responsable puede leerlos.',
        'El acceso a la base de datos está restringido por reglas de seguridad a nivel de fila: cada persona solo puede ver o modificar lo que le corresponde.',
        'Las contraseñas se almacenan con un algoritmo de hash seguro y existen límites de intentos para frenar ataques automatizados.',
      ],
    },
    {
      titulo: '10. Conservación de los datos',
      lista: [
        'Mensajes de Contacto: doce (12) meses desde su envío; después se eliminan automáticamente.',
        'Cuentas de acceso: mientras la cuenta esté activa.',
        'Datos técnicos de seguridad (IP seudonimizada): máximo 24 horas.',
        'La base de datos estará vigente mientras la tienda AltairTrends esté en funcionamiento.',
      ],
    },
    {
      titulo: '11. Cambios a esta política',
      parrafos: [
        'Cualquier cambio sustancial se publicará en esta misma página con una nueva versión y fecha antes de aplicarse. Si cambian las finalidades del tratamiento, te pediremos una nueva autorización.',
      ],
    },
  ],
};

// ---------- Términos y Condiciones ----------
const TERMINOS = {
  ruta: '/terminos',
  titulo: 'Términos y Condiciones de Uso',
  resumen:
    'Estas son las reglas para usar el catálogo digital de AltairTrends y tus derechos como consumidor de acuerdo con la ley colombiana.',
  secciones: [
    {
      titulo: '1. Aceptación',
      parrafos: [
        'Al navegar por este sitio aceptas estos Términos y Condiciones, la Política de Tratamiento de Datos Personales y la Política de Cookies. Si no estás de acuerdo, te pedimos no utilizar el sitio. Estos términos se rigen por la Ley 1480 de 2011 (Estatuto del Consumidor), la Ley 527 de 1999 (comercio electrónico) y las demás normas colombianas aplicables.',
      ],
    },
    {
      titulo: '2. Qué es este sitio',
      parrafos: [
        'AltairTrends es un catálogo digital que muestra productos, sus características, precios y disponibilidad. El sitio no procesa pagos ni cierra ventas: al pulsar "Comprar" se te redirige al canal de venta configurado para cada producto (por ejemplo, WhatsApp), donde se confirman el precio final, el costo de envío, el medio de pago y la fecha de entrega antes de que pagues.',
      ],
    },
    {
      titulo: '3. Información de los productos y precios',
      lista: [
        'Los precios se expresan en pesos colombianos (COP) e incluyen los impuestos aplicables, salvo que se indique lo contrario. Los costos de envío se informan antes de confirmar la compra.',
        'El stock mostrado es informativo y puede cambiar. La disponibilidad se confirma en el canal de venta.',
        'Las imágenes y videos buscan representar fielmente el producto; pueden existir pequeñas variaciones de color por la pantalla de cada dispositivo.',
        'Si un precio publicado contiene un error evidente, te lo informaremos antes de cerrar la venta para que decidas si continúas.',
      ],
    },
    {
      titulo: '4. Derecho de retracto',
      parrafos: [
        'En las ventas a distancia tienes derecho a retractarte de la compra dentro de los cinco (5) días hábiles siguientes a la entrega del producto (artículo 47 de la Ley 1480 de 2011). Debes devolver el producto por los mismos medios y en las mismas condiciones en que lo recibiste, sin uso. Los costos de transporte de la devolución corren por tu cuenta.',
        'El dinero se reintegra a más tardar dentro de los quince (15) días calendario siguientes a la solicitud, siempre que hayas devuelto el producto y entregado datos correctos para el reembolso (artículo 47, modificado por la Ley 2439 de 2024).',
        'No aplica, entre otros casos previstos en la ley, a productos confeccionados según tus especificaciones o personalizados, a bienes perecederos y a bienes de uso personal.',
      ],
    },
    {
      titulo: '5. Reversión del pago',
      parrafos: [
        'Si pagaste con tarjeta de crédito, débito, PSE u otro instrumento de pago electrónico, puedes solicitar la reversión del pago dentro de los cinco (5) días hábiles siguientes a la fecha en que conociste la situación, cuando hayas sido víctima de fraude, la operación no haya sido solicitada, el producto no se haya recibido, o no corresponda a lo solicitado o sea defectuoso (artículo 51 de la Ley 1480 de 2011). Debes avisarnos y avisar al emisor del medio de pago.',
      ],
    },
    {
      titulo: '6. Garantía legal',
      parrafos: [
        'Todos los productos cuentan con la garantía legal de calidad, idoneidad y seguridad (artículos 7 y 8 de la Ley 1480 de 2011). Si no se indica otro plazo, la garantía de los productos nuevos es de un (1) año desde la entrega. Para hacerla efectiva, escríbenos al correo de contacto describiendo el problema.',
      ],
    },
    {
      titulo: '7. Peticiones, quejas y reclamos (PQR)',
      parrafos: [
        'Puedes presentar PQR por el formulario de Contacto, por correo electrónico o por teléfono. Las responderemos dentro de los quince (15) días hábiles siguientes a su recibo. Si no quedas satisfecho, puedes acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co), autoridad de protección al consumidor.',
      ],
    },
    {
      titulo: '8. Cuentas de acceso',
      parrafos: [
        'Las cuentas son creadas por el Responsable y son personales e intransferibles. Debes mantener tu contraseña en secreto y avisarnos de inmediato si sospechas un uso no autorizado.',
      ],
    },
    {
      titulo: '9. Uso permitido',
      parrafos: ['Al usar el sitio te comprometes a no:'],
      lista: [
        'Intentar acceder sin autorización a cuentas, al panel de administración o a la base de datos.',
        'Enviar mensajes masivos, automatizados (bots) o con contenido ilícito, ofensivo o engañoso.',
        'Copiar de forma masiva el contenido del catálogo (scraping) o interferir con el funcionamiento del sitio.',
        'Suplantar a otra persona o usar datos de terceros sin su autorización.',
      ],
    },
    {
      titulo: '10. Propiedad intelectual',
      parrafos: [
        'La marca AltairTrends, su logotipo, el diseño del sitio, los textos y el código son propiedad de su titular o se usan con autorización, y están protegidos por la Decisión Andina 351 de 1993 y la Ley 23 de 1982 (derecho de autor) y por la Decisión Andina 486 de 2000 (propiedad industrial). No puedes reproducirlos, modificarlos ni usarlos con fines comerciales sin autorización previa y escrita.',
        'Las imágenes y videos de los productos son propiedad de la tienda o de sus fabricantes y se publican con su autorización. Si consideras que algún contenido infringe tus derechos, escríbenos y lo retiraremos mientras lo verificamos.',
      ],
    },
    {
      titulo: '11. Enlaces a terceros',
      parrafos: [
        'El sitio contiene enlaces a servicios de terceros, como WhatsApp (a través de wa.link). Al seguirlos sales de AltairTrends, y esos servicios se rigen por sus propios términos y políticas de privacidad.',
      ],
    },
    {
      titulo: '12. Responsabilidad',
      parrafos: [
        'Trabajamos para que el sitio esté disponible y libre de errores, pero pueden presentarse interrupciones por mantenimiento o causas ajenas a nuestro control. Nada en estos términos limita los derechos que te reconoce la Ley 1480 de 2011 como consumidor.',
      ],
    },
    {
      titulo: '13. Ley aplicable y cambios',
      parrafos: [
        'Estos términos se rigen por las leyes de la República de Colombia. Podemos actualizarlos; la versión vigente y su fecha estarán siempre publicadas en esta página.',
      ],
    },
  ],
};

// ---------- Política de Cookies ----------
const COOKIES = {
  ruta: '/cookies',
  titulo: 'Política de Cookies',
  resumen: 'Te contamos qué información guarda AltairTrends en tu navegador y cómo puedes controlarla.',
  secciones: [
    {
      titulo: '1. ¿Qué son las cookies?',
      parrafos: [
        'Las cookies y tecnologías similares (como el almacenamiento local del navegador, "localStorage") son pequeños archivos o datos que un sitio web guarda en tu dispositivo para recordar información entre visitas.',
      ],
    },
    {
      titulo: '2. Qué usamos',
      parrafos: [
        'AltairTrends NO usa cookies de publicidad, de analítica ni de rastreo, y no comparte información de tu navegación con redes publicitarias.',
        'Solo usamos el siguiente almacenamiento, estrictamente necesario:',
      ],
      lista: [
        'Sesión de usuario (almacenamiento local "sb-…-auth-token"): solo se crea si inicias sesión. Mantiene tu sesión abierta de forma segura y se elimina al pulsar "Cerrar sesión". Sin él no es posible usar las cuentas de acceso.',
      ],
    },
    {
      titulo: '3. Cookies de terceros',
      lista: [
        'Red de entrega: si el dominio funciona a través de la red de Cloudflare, esta puede instalar cookies técnicas de seguridad (por ejemplo, "__cf_bm") para distinguir personas de bots. No se usan para publicidad.',
        'Enlaces externos: al pulsar el botón de WhatsApp o "Comprar" sales del sitio; el servicio de destino puede usar sus propias cookies según su política.',
      ],
    },
    {
      titulo: '4. Autorización',
      parrafos: [
        'Como el almacenamiento que usamos es estrictamente necesario para prestar el servicio que solicitas (iniciar sesión), no requiere autorización previa. Si en el futuro incorporamos cookies no esenciales (por ejemplo, de analítica), te pediremos autorización antes de activarlas mediante un aviso en el sitio.',
      ],
    },
    {
      titulo: '5. Cómo gestionarlas',
      parrafos: [
        'Puedes cerrar sesión en cualquier momento, o borrar las cookies y los datos del sitio desde la configuración de privacidad de tu navegador (Chrome, Firefox, Safari, Edge u otros). Si lo haces, tendrás que volver a iniciar sesión.',
      ],
    },
  ],
};

// Todos los documentos, por nombre de ruta (los usan App.jsx, el pie de página y PaginaLegal).
export const DOCUMENTOS_LEGALES = {
  privacidad: PRIVACIDAD,
  terminos: TERMINOS,
  cookies: COOKIES,
};
