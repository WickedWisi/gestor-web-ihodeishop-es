document.addEventListener("DOMContentLoaded", async () => {
  const listaCaracteristicas = document.getElementById("lista-caracteristicas");
  const modal = document.getElementById("modal-caracteristica");
  const inputModal = document.getElementById("input-caracteristica");
  const cancelarModal = document.getElementById("cancelar-modal");
  const confirmarModal = document.getElementById("confirmar-modal");
  let caracteristicas = [];
  let indiceEdicion = null;

  // Actualizar la lista visual
  function actualizarLista() {
    listaCaracteristicas.innerHTML = "";
    caracteristicas.forEach((texto, index) => {
      const div = document.createElement("div");
      div.className = "item-producto"; // Usa tus clases

      const spanTexto = document.createElement("span");
      spanTexto.textContent = texto;
      spanTexto.style.flexGrow = "1";
      spanTexto.addEventListener("dblclick", () => {
        indiceEdicion = index;
        inputModal.value = texto;
        modal.style.display = "flex";
      });

      const spanEliminar = document.createElement("span");
      spanEliminar.textContent = "✖";
      spanEliminar.style.color = "#f44336";
      spanEliminar.style.cursor = "pointer";
      spanEliminar.style.fontWeight = "bold";
      spanEliminar.style.marginLeft = "10px";
      spanEliminar.addEventListener("click", () => {
        caracteristicas.splice(index, 1);
        actualizarLista();
      });

      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "space-between";

      div.appendChild(spanTexto);
      div.appendChild(spanEliminar);
      listaCaracteristicas.appendChild(div);
    });
  }

  // Mostrar modal para agregar nueva característica
  document
    .getElementById("agregar-caracteristica")
    .addEventListener("click", () => {
      indiceEdicion = null;
      inputModal.value = "";
      modal.style.display = "flex";
    });

  cancelarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  confirmarModal.addEventListener("click", () => {
    const texto = inputModal.value.trim();
    if (!texto) return;
    if (indiceEdicion === null) {
      caracteristicas.push(texto);
    } else {
      caracteristicas[indiceEdicion] = texto;
    }
    modal.style.display = "none";
    actualizarLista();
  });

  // Cargar categorías
  try {
    const res = await fetch("https://ihodeishop.es/php/obtenerCategorias.php");
    const categorias = await res.json();
    if (Array.isArray(categorias)) {
      const datalist = document.getElementById("lista-categorias");
      categorias.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        datalist.appendChild(option);
      });
    }
  } catch (error) {
    console.warn("No se pudieron cargar las categorías:", error);
  }

  // Guardar producto
  document.getElementById("guardar").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value.trim();

    if (!nombre || isNaN(precio) || !categoria) {
      document.getElementById("estado").textContent =
        "Completa nombre, precio y categoría.";
      return;
    }

    try {
      const archivo = document.getElementById("imagenArchivo").files[0];
      if (!archivo) {
        document.getElementById("estado").textContent =
          "Selecciona una imagen.";
        return;
      }

      const formData = new FormData();
      formData.append("imagen", archivo);
      const uploadRes = await fetch(
        "https://ihodeishop.es/php/subirImagen.php",
        { method: "POST", body: formData }
      );
      const uploadData = await uploadRes.json();
      if (!uploadData.ok) {
        document.getElementById("estado").textContent =
          "Error subiendo imagen.";
        return;
      }

      const imagen = uploadData.nombre;

      const linkRes = await fetch(
        "https://ihodeishop.es/php/generarEnlaceStripe.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio }),
        }
      );
      const linkData = await linkRes.json();
      const linkCompra = linkData.link;

      const desCorta = document.getElementById("descCorta").value.trim();
      const descripcion = document.getElementById("descripcion").value.trim();

      const producto = {
        nombre,
        categoria,
        desCorta,
        precio,
        descripcion,
        caracteristicas,
        imagen,
        linkCompra,
      };

      const guardarRes = await fetch(
        "https://ihodeishop.es/php/guardarProd.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto),
        }
      );

      const guardarData = await guardarRes.json();
      document.getElementById("estado").textContent =
        guardarData.message || "Producto guardado.";

      [
        "nombre",
        "categoria",
        "descCorta",
        "precio",
        "descripcion",
        "imagenArchivo",
      ].forEach((id) => {
        const el = document.getElementById(id);
        if (el.type === "file") el.value = null;
        else el.value = "";
      });

      caracteristicas = [];
      actualizarLista();
    } catch (error) {
      console.error("Error guardando producto:", error);
      document.getElementById("estado").textContent =
        "Error al guardar el producto.";
    }
  });
});
