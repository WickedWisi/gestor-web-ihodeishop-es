document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("estado").textContent = "ID no especificado.";
    return;
  }

  const listaCaracteristicas = document.getElementById("lista-caracteristicas");
  const modal = document.getElementById("modalCaracteristica");
  const inputModal = document.getElementById("inputCaracteristica");
  let caracteristicas = [];
  let editandoIndex = null;

  function renderizarCaracteristicas() {
    listaCaracteristicas.innerHTML = "";
    caracteristicas.forEach((texto, index) => {
      const div = document.createElement("div");
      div.className = "item-producto"; // reutilizamos tu clase que ya da hover azul

      const spanTexto = document.createElement("span");
      spanTexto.textContent = texto;
      spanTexto.style.flexGrow = "1";
      spanTexto.addEventListener("dblclick", () => {
        editandoIndex = index;
        inputModal.value = texto;
        modal.style.display = "flex";
      });

      const spanEliminar = document.createElement("span");
      spanEliminar.textContent = "✖";
      spanEliminar.style.color = "#f44336";
      spanEliminar.style.fontWeight = "bold";
      spanEliminar.style.cursor = "pointer";
      spanEliminar.style.marginLeft = "10px";
      spanEliminar.addEventListener("click", () => {
        caracteristicas.splice(index, 1);
        renderizarCaracteristicas();
      });

      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "space-between";

      div.appendChild(spanTexto);
      div.appendChild(spanEliminar);
      listaCaracteristicas.appendChild(div);
    });
  }

  document
    .getElementById("agregarCaracteristica")
    .addEventListener("click", () => {
      inputModal.value = "";
      editandoIndex = null;
      modal.style.display = "flex";
    });

  document.getElementById("cancelarModal").addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.getElementById("guardarModal").addEventListener("click", () => {
    const valor = inputModal.value.trim();
    if (!valor) return;

    if (editandoIndex !== null) {
      caracteristicas[editandoIndex] = valor;
    } else {
      caracteristicas.push(valor);
    }

    renderizarCaracteristicas();
    modal.style.display = "none";
  });

  // Cargar categorías
  try {
    const catRes = await fetch(
      "https://ihodeishop.es/php/obtenerCategorias.php"
    );
    const categorias = await catRes.json();
    if (Array.isArray(categorias)) {
      const datalist = document.getElementById("lista-categorias");
      datalist.innerHTML = "";
      categorias.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        datalist.appendChild(option);
      });
    }
  } catch (e) {
    console.warn("No se pudieron cargar las categorías:", e);
  }

  // Cargar producto
  try {
    const res = await fetch("https://ihodeishop.es/php/obtenerBonos.php");
    const productos = await res.json();
    const producto = productos.find((p) => p.id == id);
    if (!producto) {
      document.getElementById("estado").textContent = "Producto no encontrado.";
      return;
    }

    document.getElementById("nombre").value = producto.nombre || "";
    document.getElementById("categoria").value = producto.categoria || "";
    document.getElementById("descCorta").value = producto.desCorta || "";
    document.getElementById("precio").value = producto.precio || "";
    document.getElementById("descripcion").value = producto.descripcion || "";
    document.getElementById("imagen").value = producto.imagen || "";

    caracteristicas = Array.isArray(producto.caracteristicas)
      ? producto.caracteristicas.map((c) => c.trim())
      : [];

    renderizarCaracteristicas();
  } catch (e) {
    document.getElementById("estado").textContent =
      "Error al cargar el producto.";
    console.error(e);
  }

  // Guardar cambios
  document.getElementById("guardar").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value.trim();

    if (!nombre || isNaN(precio) || !categoria) {
      document.getElementById("estado").textContent =
        "Completa nombre, precio y categoría.";
      return;
    }

    let imagen = document.getElementById("imagen").value;
    const archivo = document.getElementById("imagenArchivo").files[0];
    if (archivo) {
      try {
        const formData = new FormData();
        formData.append("imagen", archivo);
        const uploadRes = await fetch(
          "https://ihodeishop.es/php/subirImagen.php",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadRes.json();
        if (uploadData.ok) {
          imagen = uploadData.nombre;
          document.getElementById("imagen").value = imagen;
        } else {
          document.getElementById("estado").textContent =
            "Error subiendo imagen.";
          return;
        }
      } catch (err) {
        console.error(err);
        document.getElementById("estado").textContent =
          "Error subiendo imagen.";
        return;
      }
    }

    const desCorta = document.getElementById("descCorta").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    const productoModificado = {
      id,
      nombre,
      categoria,
      desCorta,
      precio,
      descripcion,
      caracteristicas,
      imagen,
    };

    try {
      const res = await fetch(
        "https://iHodeiShop.es/php/actualizarProducto.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoModificado),
        }
      );

      const data = await res.json();
      document.getElementById("estado").textContent =
        data.message || "Producto actualizado.";
    } catch (e) {
      console.error("Error actualizando:", e);
      document.getElementById("estado").textContent =
        "Error actualizando el producto.";
    }
  });
});
