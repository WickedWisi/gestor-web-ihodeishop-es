let cenaSeleccionada = null;

document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-cenas");
  const botonEditar = document.getElementById("editar-btn");
  const estado = document.getElementById("estado");

  try {
    const res = await fetch("https://ihodeishop.es/php/getCena.php");
    const cenas = await res.json();

    cenas.forEach((c) => {
      const div = document.createElement("div");
      div.className = "item-producto";
      div.textContent = `${c.id} - ${c.fecha} ${c.hora} / ${c.lugar}`;
      div.dataset.id = c.id;

      div.addEventListener("click", () => {
        document
          .querySelectorAll(".item-producto")
          .forEach((el) => el.classList.remove("selected"));
        div.classList.add("selected");
        cenaSeleccionada = c.id;
        botonEditar.disabled = false;
      });

      div.addEventListener("dblclick", () => {
        window.location.href = `modificar.html?id=${c.id}`;
      });

      lista.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar cenas:", error);
    estado.textContent = "Error al cargar cenas.";
  }

  botonEditar.addEventListener("click", () => {
    if (cenaSeleccionada) {
      window.location.href = `modificar.html?id=${cenaSeleccionada}`;
    }
  });
});
