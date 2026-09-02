const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Opcional, si quieres servir estáticos desde aqui

const DATA_FILE = path.join(__dirname, '../data/products.json');

// Helper para leer datos
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o está vacío, retornamos arreglo vacío
        return [];
    }
}

// Helper para escribir datos
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// --- RUTAS CRUD ---

// GET: Obtener todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const products = await readData();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos' });
    }
});

// GET: Obtener producto por ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const products = await readData();
        const product = products.find(p => p.id === parseInt(req.params.id));
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// POST: Crear nuevo producto
app.post('/api/products', async (req, res) => {
    try {
        const { nombre, descripcion, imagen, categoria, destacado } = req.body;
        
        // Validación básica
        if (!nombre || !descripcion || !categoria) {
            return res.status(400).json({ error: 'Faltan campos requeridos (nombre, descripcion, categoria)' });
        }

        const products = await readData();
        
        // Generar nuevo ID (puede mejorarse)
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

        const newProduct = {
            id: newId,
            nombre,
            descripcion,
            imagen: imagen || '',
            categoria,
            destacado: destacado || false // Default a false si no se envia
        };

        products.push(newProduct);
        await writeData(products);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// PUT: Actualizar producto existente
app.put('/api/products/:id', async (req, res) => {
    try {
        const products = await readData();
        const index = products.findIndex(p => p.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const { nombre, descripcion, imagen, categoria, destacado } = req.body;
        
        // Actualizamos solo los campos que vienen en el body (partial update podría ser PATCH, pero aquí usamos PUT general)
        const updatedProduct = {
            ...products[index],
            nombre: nombre !== undefined ? nombre : products[index].nombre,
            descripcion: descripcion !== undefined ? descripcion : products[index].descripcion,
            imagen: imagen !== undefined ? imagen : products[index].imagen,
            categoria: categoria !== undefined ? categoria : products[index].categoria,
            destacado: destacado !== undefined ? destacado : products[index].destacado
        };

        products[index] = updatedProduct;
        await writeData(products);

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// DELETE: Eliminar producto
app.delete('/api/products/:id', async (req, res) => {
    try {
        let products = await readData();
        const productExists = products.some(p => p.id === parseInt(req.params.id));

        if (!productExists) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        products = products.filter(p => p.id !== parseInt(req.params.id));
        await writeData(products);

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
