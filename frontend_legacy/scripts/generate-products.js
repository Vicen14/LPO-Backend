const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const JS_DIR = path.join(ROOT_DIR, 'js');
const OUTPUT_DIR = path.join(ROOT_DIR, 'productos');
const TEMPLATE_PATH = path.join(__dirname, 'template-producto.html');


// Archivos de datos a procesar
const dataFiles = [
    'jabones.js',
    'geles.js',
    'cremasDucha.js',
    'shampoos.js',
    'acondicionadores.js',
    'desenredantes.js',
    'mascarasCapilares.js',
    'cremasPeinar.js',
    'jabonBebe.js',
    'desodorantes.js',
    'aguaMicelar.js'
];

function slugify(text) {
    return text
        .toString()
        .normalize('NFD')                   // Eliminar acentos
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')               // Espacios por guiones bajos (según petición)
        .replace(/[^\w-]+/g, '')            // Eliminar caracteres no válidos
        .replace(/--+/g, '_');              // Eliminar guiones bajos repetidos
}

function extractArray(content) {
    // Buscar el contenido entre [ y ]
    const match = content.match(/=\s*(\[[\s\S]*\])/);
    if (!match) return null;
    
    try {
        // Usar un truco para evaluar el string como un objeto real
        // Reemplazamos export por nada para que sea válido
        const sanitized = content.replace(/export\s+/g, '');
        return eval(sanitized.split('=')[1]);
    } catch (e) {
        console.error('Error parseando contenido:', e);
        return null;
    }
}

function generateThumbnails(producto) {
    if (!producto.imagen2) return '';
    
    return `
    <div class="d-flex justify-content-center gap-2 mt-3">
        <img src="../${producto.imagen}" alt="${producto.nombre}" class="img-thumbnail rounded" style="width: 80px; height: 80px; object-fit: contain; cursor: pointer;" onclick="changeImage(this.src)">
        <img src="../${producto.imagen2}" alt="${producto.nombre} alternativa" class="img-thumbnail rounded" style="width: 80px; height: 80px; object-fit: contain; cursor: pointer;" onclick="changeImage(this.src)">
    </div>
    `;
}


function main() {
    // Crear el directorio de salida si no existe
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    let allProducts = [];


    dataFiles.forEach(file => {
        const filePath = path.join(JS_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`Archivo no encontrado: ${file}`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const products = extractArray(content);
        
        if (products) {
            products.forEach(producto => {
                const slug = slugify(producto.nombre);
                const fileName = `${slug}.html`;
                
                // Definir subcarpeta según el tipo de producto
                const productDir = path.join(OUTPUT_DIR, producto.tipo);
                if (!fs.existsSync(productDir)) {
                    fs.mkdirSync(productDir, { recursive: true });
                }
                
                const filePath = path.join(productDir, fileName);
                
                let html = template
                    .replace(/{{NOMBRE}}/g, producto.nombre)
                    .replace(/{{DESCRIPCION}}/g, producto.descripcion)
                    .replace(/{{BENEFICIOS}}/g, producto.beneficios || 'Nuestros productos están formulados con ingredientes de origen natural para brindar los mejores beneficios a tu piel y cabello, respetando siempre el equilibrio natural de tu cuerpo.')
                    .replace(/{{IMAGEN}}/g, producto.imagen)
                    .replace(/{{TIPO}}/g, producto.tipo)
                    .replace(/{{CANTIDAD}}/g, producto.cantidad || '')
                    .replace(/{{META_DESCRIPTION}}/g, producto.descripcion.substring(0, 160))
                    .replace(/{{THUMBNAILS}}/g, generateThumbnails(producto));
                
                // Ajustar rutas relativas porque las páginas ahora están un nivel más abajo (productos/Tipo/nombre.html)
                html = html.replace(/href="\.\.\//g, 'href="../../');
                html = html.replace(/src="\.\.\//g, 'src="../../');
                html = html.replace(/href='\.\.\//g, "href='../../");
                html = html.replace(/src='\.\.\//g, "src='../../");
                
                fs.writeFileSync(filePath, html);
                console.log(`Generado: ${producto.tipo}/${fileName}`);
                
                allProducts.push({ id: producto.id, nombre: producto.nombre, slug: slug });
            });
        }
    });

    console.log(`Total productos procesados: ${allProducts.length}`);
}

main();
