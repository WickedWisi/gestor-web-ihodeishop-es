let productoSeleccionado = null;

document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-productos");
  const botonEditar = document.getElementById("editar-btn");
  const estado = document.getElementById("estado");

  try {
    const res = await fetch("https://ihodeishop.es/php/obtenerBonos.php");
    const productos = await res.json();

    productos.forEach((p) => {
      const div = document.createElement("div");
      div.className = "item-producto";
      div.textContent = `${p.id} - ${p.nombre}`;
      div.dataset.id = p.id;

      // Selección por clic
      div.addEventListener("click", () => {
        document
          .querySelectorAll(".item-producto")
          .forEach((el) => el.classList.remove("selected"));
        div.classList.add("selected");
        productoSeleccionado = p.id;
        botonEditar.disabled = false;
      });

      // Redirección por doble clic
      div.addEventListener("dblclick", () => {
        window.location.href = `modificar.html?id=${p.id}`;
      });

      lista.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    estado.textContent = "Error al cargar productos.";
  }

  // Botón Editar
  botonEditar.addEventListener("click", () => {
    if (productoSeleccionado) {
      window.location.href = `modificar.html?id=${productoSeleccionado}`;
    }
  });
});
