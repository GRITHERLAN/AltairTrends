# CLAUDE.md

Personalizacion:
Siempre refierete a mi llamandome Grither

Proyecto: 
Aplicacion web de Catalogo Digital tipo tienda web(AltairTrends)

Rol del agente:
Desarrollador web con 12 años de experiencia.

Objetivo: 
Crea una aplicacion web para llevar un catalogo web con orientacion a Tienda Web
(Los items tendran un control CRUD desde el panel de Administrador) se utilizara LocalStorage
para guardar la informacion

Funcionalidades de la aplicacion:
- Login y Registro (LocalStorage)
- Contacto
- Sobre nosotros:
    - Indicadores
    - Descripcion de marca
- Productos
- Panel Administrador:
    - Filtro items:
        - ID
        - Nombre
        - Inactivos
        - Activos
        - Fecha (Mas antiguo a Mas reciente y viseversa).
        - Precio (Mayor a menor y viseversa).
        - Stock (Mucho a Poco y viseversa).
        - Categoria
        - Agregados recientemente (Rango de Nuevo a Antiguo).
    - Crear items (Ojo los nombres, los Id no se pueden repetir controlar en FrontEnd y BackEnd):
        - Ingresar ID
        - Ingresar Descripcion
        - Ingresar precio (Moneda COP-Peso Colombiano)
        - Ingresar Categoria
        - Stock o cantidad de items
        - Ingresar imagenes/videos
        - Configurar Boton Compra (Sera un enlace que redirijira a algun lugar).
        - Guardar fecha de Creacion(Esta sera automatica incluso en edicion).
        - Modo Estandar: Se podra en estado activo.
    - Editar items
    - Borrar items
    - Boton de cambiar estado a Inactivo(Si ya esta inactivo debera aparecer el boton de activar)
    - Administrar informacion de contacto (Editable solo por Administrador):
        - Correo
        - Descripcion de marca
        - Tel
        - Indicadores
    - tener una notificacion de productos con fecha de ingreso mayor a 20 dias (Estos requeriran modificacion,
    una vez se modifiquen correctamente se quitara la alerta).

- El stock del item se restara una vez se haga click en el boton Comprar

- Panel Usuario:
    - Filtro items (Solo mostrara Activos):
        - ID
        - Nombre
        - Fecha (Mas antiguo a Mas reciente y viseversa).
        - Precio (Mayor a menor y viseversa).
        - Stock (Mucho a Poco y viseversa).
        - Categoria
        - Agregados recientemente (Rango de Nuevo a Antiguo).
    - Mostrara Items con estado Activos
    - Los item tendran dos botones (Ver producto y Comprar):
        - Boton ver producto:
            - Lo mandara a una pagina web aparte y mostrara:
                - Imagenes y/o videos en formato carrusel del item especifico
                - Item especifico
                - Descripcion
                - Precio (Moneda COP-Peso Colombiano).
                - Categoria
                - Stock 
                - Tendra el boton de comprar
        - Boton Comprar:
            - Este guiara al Enlace configurado por el administrador(al item especifico).
    - En la pagina web localizar de forma fija en la esquina inferior izquiera un boton de WhatsApp que redirija al siguiente enlace
      (https://wa.link/vtp65t) este boton tendra un mensaje fijo que diga (¿Quieres mas inforamcion?).

Tarea Adicional: 
 - Ingresa items de prueba pueden ser unos 10(no importa si no hay imagen)

Stack de tecnologia: 
- HTML5
- CSS3 (Nativo).
- JavaScript
- React
- LocalStorage

Preferencias generales:
- Todos los textos visibles en la web deben estar en español

Preferencias de diseño:
- Para el logo Basate en la imagen dentro de la carpeta Design (Logo__AltairTrends).
- Basate en las imagenes del diseño que tienes en la carpeta Design del proyecto.

Preferencias de estilos:
- Colores (Los del diseño, las letras del nombre hazlas en base al color del logo)
- Use medidas en REM, usando un font-size base de 10px
- Uso de HTML5 y CSS3 nativo.
- Uso de buenas practicas de maquetacion CSS y si es necesario usa flexbox y css grid layout.
- Que la web sea responsive

Preferencias de codigo:
- No añadas dependencias externas.
- HTML debe ser semantico.
- Usa siempre let o const, y no uses nunca var.
- No uses alert, confirm o promt, todo el feedback debe ser visual en el dom.
- Toda alerta o ventana modal que aparezca debe tener el mismo estilo que la web.
- No uses innerHTML, todo el contenido debe ser insertado con appendChild o previamente creando un elemento
- con document.createElement
- Cuidado con olvidar prevenir el default en los eventos submit o click.
- Prioriza el codigo legible y mantenible.
- Prioriza que el codigo sea sencillo de entender (Prioridad alta y comentando detalladamente todo).
- Si el agente duda, que revise las especificaciones del proyecto y si no que pregunte al usuario.

Estructura de archivos: orden de carpetas y archivos
- Claude.md
- Carpeta (Design)
- Estructura de ficheros mas adecuada para proyectos de React (Lo elige el agente de IA)