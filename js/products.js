import { jabones } from './jabones.js';
import { geles } from './geles.js';
import { cremasDucha } from './cremasDucha.js';
import { shampoos } from './shampoos.js';
import { acondicionadores } from './acondicionadores.js';
import { desenredantes } from './desenredantes.js';
import { mascarasCapilares } from './mascarasCapilares.js';
import { cremasPeinar } from './cremasPeinar.js';
import { jabonBebe } from './jabonBebe.js';
import { desodorantes } from './desodorantes.js';
import { aguaMicelar } from './aguaMicelar.js';
import { balsamosLabiales } from './balsamosLabiales.js';
import { balsamosNoche } from './balsamoNoche.js';
import { cremasFaciales } from './cremasFaciales.js';
import { serum } from './serum.js';
import { desmaquillantes } from './desmaquillantes.js';
import { espumasLimpiadoras } from './espumasLimpiadoras.js';
import { exfoliantesFaciales } from './exfoliantesFaciales.js';
import { cremasManos } from './cremasManos.js';
import { cremasCorporales } from './cremasCorporales.js';
// Función para generar nombres de archivo válidos (igual a la del script generador)
function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '_');
}


// Definir categorías personalizadas
const productosLimpiezaCorporal = [
    ...jabones,
    ...geles,
    ...jabonBebe,
    ...cremasDucha,
    ...desodorantes
];
const productosCapilar = [
    ...shampoos,
    ...acondicionadores,
    ...desenredantes,
    ...mascarasCapilares,
    ...cremasPeinar
];
const productosCuidadoFacial = [
    ...aguaMicelar,
    ...balsamosLabiales,
    ...balsamosNoche,
    ...cremasFaciales,
    ...serum,
    ...desmaquillantes,
    ...espumasLimpiadoras,
    ...exfoliantesFaciales,
    ...cremasManos,
    ...cremasCorporales
];

const todosLosProductos = [
    ...productosLimpiezaCorporal,
    ...productosCapilar,
    ...productosCuidadoFacial
];

const PRODUCTOS_POR_PAGINA = 12;
let paginaActual = 1;
let productosFiltrados = [...todosLosProductos];

document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la página de inicio, cargar destacados
    if (document.getElementById('featured-products-grid')) {
        cargarProductosDestacados();
    }

    // Solo ejecutar en la página de productos
    if (!document.querySelector('.products-page')) return;



    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('categoria');

    let defaultCategory = 'limpieza-corporal';
    productosFiltrados = [...productosLimpiezaCorporal];

    if (categoryParam === 'capilar') {
        defaultCategory = 'capilar';
        productosFiltrados = [...productosCapilar];
    } else if (categoryParam === 'cuidado-facial') {
        defaultCategory = 'cuidado-facial';
        productosFiltrados = [...productosCuidadoFacial];
    } else if (categoryParam === 'all') {
        defaultCategory = 'all';
        productosFiltrados = [...todosLosProductos];
    }

    generarSubfiltros(defaultCategory);
    cargarTodosLosProductos();
    configurarFiltros();



    // Hacer funcional el botón "Todos los productos"
    const btnTodosProductos = document.querySelector('button[data-filter="all"]');
    if (btnTodosProductos) {
        btnTodosProductos.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
});

// Cargar productos destacados
function cargarProductosDestacados() {
    const container = document.getElementById('featured-products-grid');
    if (!container) return;
    
    const productosDestacados = todosLosProductos.filter(p => p.destacado);
    
    container.innerHTML = productosDestacados.map(producto => `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="product-card fade-in">
                <a href="productos/${producto.tipo}/${producto.url || slugify(producto.nombre)}.html" class="text-decoration-none">
                    <div class="position-relative">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                        ${producto.nuevo ? 
                            '<span class="badge bg-success position-absolute top-0 start-0 m-3">Nuevo</span>' : 
                            ''}
                    </div>
                </a>
                <div class="product-info">
                    <a href="productos/${producto.tipo}/${producto.url || slugify(producto.nombre)}.html" class="text-decoration-none">
                        <h5 class="product-title mb-2">${producto.nombre} <small class="text-muted d-block fs-6 mt-1">${producto.cantidad}</small></h5>
                    </a>
                    <p class="product-description small text-muted mb-3" data-id="${producto.id}">${producto.descripcion}</p>
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="btn-group">
                            <a href="productos/${producto.tipo}/${producto.url || slugify(producto.nombre)}.html" class="btn btn-sm btn-outline-primary" 
                                    data-bs-toggle="tooltip" 
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Cargar todos los productos
function cargarTodosLosProductos() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    // Calcular productos para la página actual
    const startIndex = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const endIndex = startIndex + PRODUCTOS_POR_PAGINA;
    const productosMostrar = productosFiltrados.slice(startIndex, endIndex);
    
    container.innerHTML = productosMostrar.map(producto => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4 product-item" data-tipo="${producto.tipo}" data-necesidad="${producto.necesidad}" data-linea="${producto.linea}">
            <div class="product-card fade-in">
                <a href="productos/${producto.tipo}/${producto.url || slugify(producto.nombre)}.html" class="text-decoration-none">
                    <div class="position-relative">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                        ${producto.nuevo ? 
                            '<span class="badge bg-success position-absolute top-0 start-0 m-3">Nuevo</span>' : 
                            ''}
                    </div>
                </a>
                <div class="product-info">
                    <a href="productos/${producto.tipo}/${producto.url || slugify(producto.nombre)}.html" class="text-decoration-none">
                        <h5 class="product-title mb-2">${producto.nombre} <small class="text-muted d-block fs-6 mt-1">${producto.cantidad}</small></h5>
                    </a>
                    <p class="product-description small text-muted mb-3">${producto.descripcion}</p>
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="btn-group">
                            <a href="productos/${producto.tipo}/${producto.url || slugify(producto.nombre)}.html" class="btn btn-sm btn-outline-primary" 
                                    data-bs-toggle="tooltip" 
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    
    renderizarPaginacion();
}

// Renderizar la paginación de productos
function renderizarPaginacion() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
    let html = '';

    if (totalPaginas <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    // Botón Anterior
    html += `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${paginaActual - 1}">Anterior</a>
        </li>
    `;

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <li class="page-item ${paginaActual === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    // Botón Siguiente
    html += `
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${paginaActual + 1}">Siguiente</a>
        </li>
    `;

    paginationContainer.innerHTML = html;

    // Eventos a los enlaces de paginación
    paginationContainer.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            if (parent.classList.contains('disabled') || parent.classList.contains('active')) {
                return;
            }

            paginaActual = parseInt(this.getAttribute('data-page'));
            cargarTodosLosProductos();
            
            // Hacer scroll hacia el título
            const titleElement = document.querySelector('.products-page main h1');
            if (titleElement) {
                titleElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Configurar filtros de productos
function configurarFiltros() {
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Funcionalidad para los botones principales (Limpieza Corporal, Capilar)
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de botones de categoría
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Cambiar productosFiltrados según la categoría
            const target = this.getAttribute('data-target');
            if (target === 'limpieza-corporal') {
                productosFiltrados = [...productosLimpiezaCorporal];
            } else if (target === 'capilar') {
                productosFiltrados = [...productosCapilar];
            } else if (target === 'cuidado-facial') {
                productosFiltrados = [...productosCuidadoFacial];
            } else {
                productosFiltrados = [...todosLosProductos];
            }
            paginaActual = 1;
            cargarTodosLosProductos();

            // Generar subfiltros dinámicamente según la categoría
            generarSubfiltros(target);
        });
    });
}

// Generar subfiltros dinámicamente según la propiedad "tipo"
function generarSubfiltros(categoria) {
    let productosBase = [];
    if (categoria === 'limpieza-corporal') {
        productosBase = productosLimpiezaCorporal;
    } else if (categoria === 'capilar') {
        productosBase = productosCapilar;
    } else if (categoria === 'cuidado-facial') {
        productosBase = productosCuidadoFacial;
    } else {
        productosBase = todosLosProductos;
    }

    // Obtener tipos únicos y ordenarlos
    let tiposUnicos = [...new Set(productosBase.map(p => p.tipo))];
    
    if (categoria === 'capilar') {
        const ordenCapilar = [
            "Shampoo",
            "Acondicionador",
            "Máscara Capilar",
            "Desenredante",
            "Crema de Peinar"
        ];
        
        tiposUnicos.sort((a, b) => {
            const indexA = ordenCapilar.indexOf(a);
            const indexB = ordenCapilar.indexOf(b);
            
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b, 'es', { sensitivity: 'base' });
        });
    } else {
        tiposUnicos.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    }

    // Contenedor de subfiltros
    let subFiltrosContainer = document.getElementById('subfiltros-dinamicos');
    if (!subFiltrosContainer) {
        // Si no existe, crearlo
        const row = document.querySelector('#collapseFiltros .row:last-child .col-12');
        subFiltrosContainer = document.createElement('div');
        subFiltrosContainer.className = 'd-flex flex-wrap gap-2 sub-filters';
        subFiltrosContainer.id = 'subfiltros-dinamicos';
        row.appendChild(subFiltrosContainer);
    }
    subFiltrosContainer.innerHTML = '';

    // Crear botón para "Todos"
    const btnTodos = document.createElement('button');
    btnTodos.className = 'btn filter-btn';
    btnTodos.textContent = 'Todos';
    btnTodos.setAttribute('data-filter', 'all');
    subFiltrosContainer.appendChild(btnTodos);

    // Crear botones para cada tipo
    tiposUnicos.forEach(tipo => {
        const btn = document.createElement('button');
        btn.className = 'btn filter-btn';
        btn.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1).replace('-', ' ');
        btn.setAttribute('data-filter', tipo);
        subFiltrosContainer.appendChild(btn);
    });

    // Asignar eventos a los nuevos botones
    const filterButtons = subFiltrosContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');
            let productosBase = [];
            if (categoria === 'limpieza-corporal') productosBase = productosLimpiezaCorporal;
            else if (categoria === 'capilar') productosBase = productosCapilar;
            else if (categoria === 'cuidado-facial') productosBase = productosCuidadoFacial;
            else productosBase = todosLosProductos;

            if (filterValue === 'all') {
                productosFiltrados = productosBase;
            } else {
                productosFiltrados = productosBase.filter(producto => producto.tipo === filterValue);
            }
            paginaActual = 1;
            cargarTodosLosProductos();
        });
    });
}