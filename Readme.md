## Pre-Challenge de Backend

### Consigna:

Endpoints a incluir

-Product

**/POST/** `/api/products` para crear un producto (sólo admin o usuario premium). :heavy_check_mark:

**/GET/** `/api/products` para ver todos los productos paginados (debe incluir queries de filtro). :heavy_check_mark:

**/PUT/** `/api/products/:id` para actualizar un producto (sólo admin o usuario premium). :heavy_check_mark:

**/DELETE/** `/api/products/:id` para eliminar un producto (sólo admin o usuario premium). :heavy_check_mark:

-Cart

**/POST/** `/api/carts` para crear un carrito (usuario “común/premium). :heavy_check_mark:

**/GET/** `/api/carts` para ver todos los productos del carrito del usuario logueado paginados (usuario “común/premium). :white_check_mark: Pendiente agregar paginado

**/PUT/** `/api/carts`/:id para actualizar un producto del carrito (usuario “común/premium). :heavy_check_mark:

**/DELETE/** `/api/carts`/:id para eliminar un producto del carrito  (usuario “común/premium). :heavy_check_mark:

-Ticket (AMBOS SE REALIZAN CON OTRO METODO, USANDO LA RUTA API/CARTS/:CID/PURCHASE Y EL JS EN PUBLUC CARTPURCHASE.JS)

**/POST/** `/api/tickets` para crear un documento ticket con los datos de la compra (usuario “común/premium). :white_check_mark: 

**/GET/** `/api/tickets` para calcular el total a pagar (usuario “común/premium). :white_check_mark:

-User

**/POST/** `/api/auth/register` para registrarse en la app :heavy_check_mark:

**/POST/** `/api/auth/login` para iniciar sesión en la app :heavy_check_mark:

**/POST/** `/api/auth/github `para registrarse o iniciar sesión en la app con github :heavy_check_mark:

**/POST/** `/api/auth/signout` para cerrar sesión en la app :heavy_check_mark:

**/PUT/** `/api/auth`para actualizar la contraseña del usuario logueado (no olvidar el endpoint para el envío del correo de recuperación). :heavy_check_mark:

**/PUT/** `/api/auth/prem` para actualizar el rol a premium :white_check_mark: (En vez de una ruta PUT se uso GET)

-Vistas a incluir (hbs,js,react)

Usuario no logueado

Index: página de bienvenida. :heavy_check_mark: (HOME commun)

Products: página con los productos de la base de datos (no puede agregar productos al carrito). :heavy_check_mark: (HOME loggeado)

Register: página para registrarse. :heavy_check_mark:

Login: página para iniciar sesión (debe incluir el botón para dirigir a la página de Recuperación y recuperar la contraseña). :heavy_check_mark:

La barra de navegación sólo debe dejarme ver estas páginas. :heavy_check_mark: 

-Usuario “común” logueado

Index: página de bienvenida.  :heavy_check_mark: (HOME commun)

Products: página con los productos de la base de datos (puede agregar los productos al carrito). :heavy_check_mark: (HOME commun)

Cart: página para gestionar las compras (debe incluir el total y el botón necesario para generar el ticket cuando finalice la compra). :heavy_check_mark: 

Premium: página para convertirse en usuario premium. :heavy_check_mark: (ROLE CAMBIADO)

La barra de navegación sólo debe dejarme ver estas páginas e incluir un botón para cerrar sesión y redirigir hacia Index. :heavy_check_mark: 

Usuario “premium” logueado

Index: página de bienvenida. :heavy_check_mark: (HOME commun)

Products: página con los productos de la base de datos (puede agregar los productos que no sean suyos al carrito). :heavy_check_mark: (HOME)

Cart: página para gestionar las compras (debe incluir el total y el botón necesario para generar el ticket cuando finalice la compra).  :heavy_check_mark: 

New: página para crear un producto.  :heavy_check_mark: (REAL TIME PRODUCTS)

Update: página para actualizar un producto (sus productos). :heavy_check_mark: (REAL TIME PRODUCTS)

La barra de navegación sólo debe dejarme ver estas páginas e incluir un botón para cerrar sesión y redirigir hacia Index. :heavy_check_mark: 

Usuario “admin” logueado

Index: página de bienvenida.  :heavy_check_mark: (HOME)

Products: página con los productos de la base de datos (no puede agregar productos al carrito).  :heavy_check_mark: (HOME)

New: página para crear un producto.  :heavy_check_mark: (REAL TIME PRODUCTS)

Update: página para actualizar un producto (cualquier producto).  :heavy_check_mark: (REAL TIME PRODUCTS)

La barra de navegación sólo debe dejarme ver estas páginas e incluir un botón para cerrar sesión y redirigir hacia Index. :heavy_check_mark: 

-Documentación y Testing (funcional):

Products

POST /api/products :heavy_check_mark:

GET /api/products :heavy_check_mark:

PUT /api/products/:id :heavy_check_mark:

DELETE /api/products/:id :heavy_check_mark:

Carts (Pendiente)

POST /api/carts

GET /api/carts

PUT /api/carts/:id

DELETE /api/carts/:id

Tickets :white_check_mark: (otro metodo)

POST /api/tickets  :white_check_mark:
GET /api/tickets :white_check_mark:

Documentación y Testing (funcional):

Users (:white_check_mark: falto el de recupero de contraseña u cambio de role, tiene funcionalidad pero hay problematicas con el testeo ya que habria que restructurar proyecto)

POST /api/auth/register para registrarse en la app :heavy_check_mark:

POST /api/auth/login para iniciar sesión en la app :heavy_check_mark:

POST /api/auth/signout para cerrar sesión en la app :heavy_check_mark:

PUT /api/auth para actualizar la contraseña del usuario logueado (no olvidar el endpoint para el envío del correo de recuperación).   :white_check_mark:

PUT /api/auth/prem para actualizar el rol a premium :white_check_mark:

-Testing performance (Pendiente-)

Estresar el servidor con el siguiente flujo de operaciones:

inicio de sesión de un administrador

creación de producto

eliminación de producto

cierre de sesión

-Autenticación

Manejo de autenticación con alguna de las siguientes opciones:

middlewares personalizados + JWT :heavy_check_mark:

passport + JWT :heavy_check_mark: 

políticas :heavy_check_mark:

Loggers :heavy_check_mark:

Ambiente de desarrollo :heavy_check_mark:

registrar en consola.
HTTP, INFO y ERROR.

Ambiente de producción :heavy_check_mark:

registrar en consola HTTP, INFO.
registrar en archivo ERROR.

- Errors :heavy_check_mark:

Manejo de errores.  :heavy_check_mark:

Diccionario de errores frecuentes. :heavy_check_mark:

Error personalizado para cada capa. :heavy_check_mark:

-Nodos :heavy_check_mark:

Generar 4 nodos optimizados con brotli. :heavy_check_mark:

-Persistencia y sesiones (:heavy_check_mark: , se pudo hacer la configuracion pero no se pudo aplicar ya que no sea usa repository)

Debe funcionar todo para mongoDB, pero debe tener aplicado el patrón correspondiente para poder realizar el cambio fácilmente (escalabilidad). 


Entregable
Link de github (back y front si está separado).
Archivo .env o variables de entorno correspondientes.
