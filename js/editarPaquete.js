let paqueteSeleccionado = null;

document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-paquetes");
  const botonEditar = document.getElementById("editar-btn");
  const estado = document.getElementById("estado");

  try {
    const res = await fetch("https://ihodeishop.es/php/getHoras.php");
    const paquetes = await res.json();

    paquetes.forEach((p) => {
      const div = document.createElement("div");
      div.className = "item-producto";
      div.textContent = `${p.id} - ${p.horas}h / ${p.precio} €`;
      div.dataset.id = p.id;

      div.addEventListener("click", () => {
        document
          .querySelectorAll(".item-producto")
          .forEach((el) => el.classList.remove("selected"));
        div.classList.add("selected");
        paqueteSeleccionado = p.id;
        botonEditar.disabled = false;
      });

      div.addEventListener("dblclick", () => {
        window.location.href = `modificar.html?id=${p.id}`;
      });

      lista.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar paquetes:", error);
    estado.textContent = "Error al cargar paquetes.";
  }

  botonEditar.addEventListener("click", () => {
    if (paqueteSeleccionado) {
      window.location.href = `modificar.html?id=${paqueteSeleccionado}`;
    }
  });
});
