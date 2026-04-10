# Import libraries
import sys
import http.server
import socketserver

# Creating handle
HandlerClass = http.server.SimpleHTTPRequestHandler

# Creating Server
ServerClass  = http.server.HTTPServer

# Defining protocol
Protocol     = "HTTP/1.0"

# Setting TCP Address
if sys.argv[1:]:
    port = int(sys.argv[1])
else:
    port = 8080
server_address = ('127.0.0.1', port)

# invoking server
HandlerClass.protocol_version = Protocol
http = ServerClass(server_address, HandlerClass)

# Getting logs
sa = http.socket.getsockname()
print("Serving HTTP on", sa[0], "port", sa[1], "...")
http.serve_forever()