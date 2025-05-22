document.addEventListener("DOMContentLoaded", async () => {
  const activos = document.getElementById("activos");
  const desactivados = document.getElementById("desactivados");
  const guardarBtn = document.getElementById("guardar-cambios");
  const estado = document.getElementById("estado");

  try {
    // Cargar paquetes ACTIVOS
    const resActivos = await fetch("https://iHodeiShop.es/php/getHoras.php");
    const activosData = await resActivos.json();

    activosData.forEach((p) => {
      const div = crearElemento(p);
      activos.appendChild(div);
    });

    // Cargar paquetes DESACTIVADOS
    const resDesactivados = await fetch(
      "https://iHodeiShop.es/php/obtenerPaquetesDesactivados.php"
    );
    const desactivosData = await resDesactivados.json();

    desactivosData.forEach((p) => {
      const div = crearElemento(p);
      desactivados.appendChild(div);
    });
  } catch (err) {
    console.error("Error al cargar paquetes:", err);
    estado.textContent = "Error al cargar paquetes.";
  }

  function crearElemento(p) {
    const div = document.createElement("div");
    div.className = "item-producto";
    div.textContent = `${p.id} - ${p.horas} horas - ${parseFloat(
      p.precio
    ).toFixed(2)} €`;
    div.setAttribute("draggable", true);
    div.dataset.id = p.id;

    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", div.dataset.id);
    });

    return div;
  }

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
        "https://ihodeishop.es/php/actualizarEstadoPaquetes.php",
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
});
