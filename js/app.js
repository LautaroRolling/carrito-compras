document.addEventListener("DOMContentLoaded", function () {
    const productos = [
        { nombre: "Remera Negra", precio: 3000 },
        { nombre: "Remera Blanca", precio: 3000 },
        { nombre: "Pantalón Negro", precio: 5000 },
        { nombre: "Pantalón Azul", precio: 5000 },
    ];

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function renderProductos() {
        const contenedor = document.getElementById("productos");
        contenedor.innerHTML = "";

        productos.forEach((producto, index) => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p>${producto.nombre} - $${producto.precio}</p>
                <button onclick="agregarAlCarrito(${index})">Agregar</button>
            `;
            contenedor.appendChild(div);
        });
    }

    window.agregarAlCarrito = function(index) {
        const producto = productos[index];
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
    }

    function renderCarrito() {
        const contenedor = document.getElementById("carrito");
        contenedor.innerHTML = "";

        carrito.forEach((prod) => {
            const li = document.createElement("li");
            li.textContent = `${prod.nombre} - $${prod.precio}`;
            contenedor.appendChild(li);
        });
    }

    function mostrarTotal() {
        const total = document.getElementById("total");
        let suma = 0;
        carrito.forEach((prod) => {
            suma += prod.precio;
        });
        total.textContent = `Total: $${suma}`;
    }

    function borrarCarrito() {
        carrito = [];
        localStorage.removeItem("carrito");
        renderCarrito();
        document.getElementById("total").textContent = "Total: $0";
    }

    document.getElementById("verTotal").addEventListener("click", mostrarTotal);
    document.getElementById("borrarCarrito").addEventListener("click", borrarCarrito);

    renderProductos();
    renderCarrito();
}); 

