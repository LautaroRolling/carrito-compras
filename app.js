let productos = ["Remera Negra", "Remera Blanca", "Pantalón Negro", "Pantalón Azul"];
let precios = [35000, 30000, 60000, 55000];
let carrito = [];

function agregarProducto() {
    let opcion = prompt("Ingrese el número del producto:\n1. Remera Negra ($35000)\n2. Remera Blanca ($30000)\n3. Pantalón Negro ($60000)\n4. Pantalón Azul ($55000)");
    let index = parseInt(opcion) - 1;

    if (index >= 0 && index < productos.length) {
        carrito.push(precios[index]);
        alert(`${productos[index]} agregado al carrito.`);
    } else {
        alert("Opción no válida.");
    }
}

function calcularTotal() {
    let total = carrito.reduce((acc, precio) => acc + precio, 0);
    alert(`Total a pagar: $${total}`);
}

let opcion;
do {
    opcion = prompt("Elige una opción:\n1. Agregar producto\n2. Calcular total\n3. Salir");

    if (opcion === "1") {
        agregarProducto();
    } else if (opcion === "2") {
        calcularTotal();
    } else if (opcion !== "3") {
        alert("Opción no válida.");
    }

} while (opcion !== "3");

alert("Gracias por tu compra.");