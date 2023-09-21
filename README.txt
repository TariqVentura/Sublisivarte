Estandares de JavaScript
- sangria de 4 espacios
- constantes en mayusculas y separadas con '_'
- evitar uso de ';'
- variables, funciones y atributos de objetos en camelCase
- declarar variables locales con let
- dejar un espacio entre la ',' y el valor en un arreglo
- dejar un espacio entre la condicion y el if 
- utilizar funciones de flecha para las API
- espacio entre argumentos de funciones de flecha

Top 10 OWASP

  Ocultar y confirmar contraseña
  - 

  Cifrar contraseña
  - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

  Olvidar y restaurar contraseña
  -https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html#forgot-password-service

  validar contraseña
  -https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

  Desactivar autocompletado (A10)
  -https://owasp.org/Top10/es/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/#desde-la-capa-de-aplicacion

  Controlar errores 403 y 404 A09 
  -https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/#references

  Prevenir inyecciones SQL y XSS.(A03)
  -https://owasp.org/Top10/es/A03_2021-Injection/#como-se-previene

 - Controlar intentos fallidos de autenticación(A07)
  https://owasp.org/Top10/es/A07_2021-Identification_and_Authentication_Failures/#como-se-previene
                      
  - doble autenticacion
  https://owasp.org/www-project-proactive-controls/v3/en/c6-digital-identity

  -Cerrar sesión por inactividad (A07) - Lista de CWEs mapeadas
  CWE-613 Insuficciente session expiration https://cwe.mitre.org/data/definitions/613.html

A01:2021 – Broken Access Control 
    - Utilizacion de CORS en la aplicación ./app.js ln 25 - 33 
      CORS es un mecanismo de seguridad implementado en los navegadores web que controla las solicitudes HTTP entre dominios diferentes para evitar ataques de seguridad como solicitudes cruzadas (cross-site request forgery) y solicitudes cruzadas de origen (cross-site scripting).
    -Los tokens JWT deberían ser preferiblemente de corta duración para minimizar la ventana de oportunidad de ataque api/users ln 168

A07 Fallas de identificacion
    -

Buscar numero de combinación de teclas para programita de desarrollador

No incluya o implemente en su software credenciales por defecto, particularmente para usuarios administradores.0A7

Asegúrese de cifrar todos los datos sensibles en reposo (almacenamiento).0A2


Arreglar stock productos y actualizacion en productos