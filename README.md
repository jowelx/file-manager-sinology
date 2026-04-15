# File Manager Sinology

Servidor base de Node.js con Express y TypeScript para gestionar archivos y carpetas dentro de una raíz de storage controlada, siguiendo arquitectura hexagonal.

## Scripts

```bash
npm run dev
npm run build
npm start
```

## Variables de entorno

```env
PORT=3000
STORAGE_ROOT=storage
```

Al iniciar, el servidor intenta crear automáticamente la carpeta configurada en `STORAGE_ROOT`.

## Estructura

```text
src/
├─ domain/
├─ application/
├─ infrastructure/
├─ interfaces/http/
├─ shared/
├─ app.ts
└─ server.ts
```

## Endpoints

### Listar contenido

```http
GET /api/files?path=clientes/proyecto-a
```

### Crear carpeta

```http
POST /api/files/folder
Content-Type: application/json

{
  "targetPath": "clientes",
  "folderName": "proyecto-a"
}
```

### Subir archivo

```http
POST /api/files/upload
Content-Type: multipart/form-data
```

Campos esperados:

- `file`
- `targetDir`

### Renombrar

```http
PATCH /api/files/rename
Content-Type: application/json

{
  "targetPath": "clientes/proyecto-a/documento.pdf",
  "newName": "contrato.pdf"
}
```

### Mover

```http
PATCH /api/files/move
Content-Type: application/json

{
  "sourcePath": "clientes/proyecto-a/documento.pdf",
  "destinationDir": "clientes/proyecto-b"
}
```

### Borrar

```http
DELETE /api/files
Content-Type: application/json

{
  "targetPath": "clientes/proyecto-b/contrato.pdf"
}
```

## Respuestas

Éxito:

```json
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "item": {
      "name": "proyecto-a",
      "relativePath": "clientes/proyecto-a",
      "type": "directory",
      "size": null,
      "modifiedAt": "2026-04-15T12:00:00.000Z"
    }
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Item already exists"
}
```

## Reglas del MVP

- Todas las rutas se interpretan como relativas a `STORAGE_ROOT`.
- Se bloquean intentos de path traversal como `../`.
- Upload y move fallan si el directorio destino no existe.
- No se sobreescriben archivos o carpetas existentes.
- El borrado de carpetas es recursivo.
- Los errores se responden al cliente sin detener el proceso del servidor.