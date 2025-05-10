class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    addItem(producto, cantidad = 1) {
        const itemExistente = this.items.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({ ...producto, cantidad });
        }
        this.saveToLocalStorage();
    }

    removeItem(productoId) {
        this.items = this.items.filter(item => item.id !== productoId);
        this.saveToLocalStorage();
    }

    clear() {
        this.items = [];
        this.saveToLocalStorage();
    }

    getTotal() {
        return this.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    }

    saveToLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    getItems() {
        return this.items;
    }
}

const carrito = new Carrito();
const productosContainer = document.getElementById('lista-productos');
const carritoContainer = document.getElementById('carrito-container');
const btnVerTotal = document.getElementById('ver-total');
const btnBorrarCarrito = document.getElementById('borrar-carrito');
const btnFinalizarCompra = document.getElementById('finalizar-compra');

async function renderizarProductos() {
    try {
        const response = await fetch('./data/productos.json'); 
        if (!response.ok) {
            throw new Error(`Error al cargar los productos: ${response.statusText}`);
        }
        const productos = await response.json();
        
        productosContainer.innerHTML = '';

        productos.forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.className = 'producto-card';
            productoCard.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio.toFixed(2)}</p>
                <p>Stock: ${producto.stock}</p>
                ${producto.talla ? `<p>Tallas: ${producto.talla.join(', ')}</p>` : ''}
                ${producto.color ? `<p>Colores: ${producto.color.join(', ')}</p>` : ''}
                <button class="btn-agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
            `;
            productosContainer.appendChild(productoCard);
        });

        productosContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar-carrito')) {
                const id = parseInt(e.target.dataset.id);
                const productoSeleccionado = productos.find(p => p.id === id);
                if (productoSeleccionado) {
                    carrito.addItem(productoSeleccionado);
                    renderizarCarrito();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        icon: 'success',
                        title: `${productoSeleccionado.nombre} agregado`
                    });
                }
            }
        });

    } catch (error) {
        console.error("Error al cargar o renderizar productos:", error);
        productosContainer.innerHTML = '<p>No se pudieron cargar los productos en este momento. Intente de nuevo más tarde.</p>';
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar los productos.',
        });
    }
}

function renderizarCarrito() {
    const itemsEnCarrito = carrito.getItems();
    carritoContainer.innerHTML = '';

    if (itemsEnCarrito.length === 0) {
        carritoContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }

    itemsEnCarrito.forEach(item => {
        const itemElement = document.createElement('p');
        itemElement.textContent = `${item.nombre} x ${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
        carritoContainer.appendChild(itemElement);
    });
}

btnVerTotal.addEventListener('click', () => {
    const total = carrito.getTotal();
    Swal.fire({
        title: 'Total del Carrito',
        text: `El total de tu compra es: $${total.toFixed(2)}`,
        icon: 'info',
        confirmButtonText: 'Entendido'
    });
});

btnBorrarCarrito.addEventListener('click', () => {
    if (carrito.getItems().length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito Vacío',
            text: 'No hay ítems en el carrito para borrar.',
            confirmButtonText: 'Ok'
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción vaciará completamente tu carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, vaciarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.clear();
            renderizarCarrito();
            Swal.fire(
                '¡Vaciado!',
                'Tu carrito ha sido vaciado con éxito.',
                'success'
            );
        }
    });
});

btnFinalizarCompra.addEventListener('click', () => {
    if (carrito.getItems().length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito Vacío',
            text: 'Agrega productos al carrito antes de finalizar la compra.',
            confirmButtonText: 'Ok'
        });
        return;
    }

    const total = carrito.getTotal();
    Swal.fire({
        title: 'Confirmar Compra',
        html: `Estás a punto de finalizar tu compra.<br>Total a pagar: <b>$${total.toFixed(2)}</b>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar Compra',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.clear();
            renderizarCarrito();
            Swal.fire(
                '¡Compra Realizada!',
                'Gracias por tu compra. ¡Tu pedido está en camino!',
                'success'
            );
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    renderizarCarrito();
});