import http.server
import ssl

# Configuracion del puerto y direccion
server_address = ('0.0.0.0', 443)

# Crear el servidor HTTP estandar
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# Crear el contexto SSL/TLS seguro
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
# Carga tu archivo combinado (cert.pem)
context.load_cert_chain(certfile='cert.pem')

# Envolver el servidor con el contexto SSL
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Servidor HTTPS ejecutándose de forma segura en https://localhost:8100")
httpd.serve_forever()