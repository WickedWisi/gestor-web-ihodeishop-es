document.addEventListener("DOMContentLoaded", async () => {
  const activos = document.getElementById("activos");
  const desactivados = document.getElementById("desactivados");
  const guardarBtn = document.getElementById("guardar-cambios");
  const estado = document.getElementById("estado");

  let productos = [];

  // 1. Cargar bonos ACTIVOS
  try {
    const res = await fetch("https://ihodeishop.es/php/obtenerBonos.php");
    productos = await res.json();

    productos.forEach((p) => {
      const div = crearElementoProducto(p);
      activos.appendChild(div);
    });
  } catch (err) {
    console.error("Error al cargar bonos activos:", err);
    estado.textContent = "Error al cargar bonos activos.";
  }

  // 2. Cargar bonos DESACTIVADOS
  try {
    const res = await fetch(
      "https://ihodeishop.es/php/obtenerBonosDesactivados.php"
    );
    const desactivos = await res.json();

    desactivos.forEach((p) => {
      const div = crearElementoProducto(p);
      desactivados.appendChild(div);
    });
  } catch (err) {
    console.error("Error al cargar bonos desactivados:", err);
    estado.textContent = "Error al cargar bonos desactivados.";
  }

  // 3. Preparar zonas de arrastre
  document.querySelectorAll(".zona-drop").forEach((area) => {
    area.addEventListener("dragover", (e) => e.preventDefault());
    area.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const item = document.querySelector(`.item-producto[data-id="${id}"]`);
      if (item && e.currentTarget !== item.parentNode) {
        e.currentTarget.appendChild(item);
      }
    });
  });

  // 4. Guardar cambios
  guardarBtn.addEventListener("click", async () => {
    const actualizaciones = [];

    document.querySelectorAll("#activos .item-producto").forEach((item) => {
      actualizaciones.push({ id: item.dataset.id, activo: 1 });
    });

    document
      .querySelectorAll("#desactivados .item-producto")
      .forEach((item) => {
        actualizaciones.push({ id: item.dataset.id, activo: 0 });
      });

    try {
      const res = await fetch(
        "https://ihodeishop.es/php/actualizarEstadoBonos.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(actualizaciones),
        }
      );

      const data = await res.json();
      estado.textContent = data.message || "Cambios guardados correctamente.";
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      estado.textContent = "Error al guardar cambios.";
    }
  });

  // Utilidad para crear el bloque HTML de cada bono
  function crearElementoProducto(p) {
    const div = document.createElement("div");
    div.className = "item-producto";
    div.textContent = `${p.id} - ${p.nombre}`;
    div.setAttribute("draggable", true);
    div.dataset.id = p.id;

    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", div.dataset.id);
    });

    return div;
  }
});
