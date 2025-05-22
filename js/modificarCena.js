document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const fecha = document.getElementById("fecha");
  const hora = document.getElementById("hora");
  const lugar = document.getElementById("lugar");
  const stock = document.getElementById("stock");
  const precio = document.getElementById("precio");
  const imagenEntrada = document.getElementById("imagenEntrada");
  const estado = document.getElementById("estado");
  const btnGuardar = document.getElementById("guardarCena");

  if (!id) {
    estado.textContent = "❌ ID no especificado.";
    return;
  }

  try {
    const res = await fetch("https://ihodeishop.es/php/getCena.php");
    const cenas = await res.json();
    const cena = cenas.find((c) => c.id == id);

    if (!cena) {
      estado.textContent = "❌ Cena no encontrada.";
      return;
    }

    fecha.value = cena.fecha;
    hora.value = cena.hora;
    lugar.value = cena.lugar;
    stock.value = cena.stock;
    precio.value = cena.precio;
  } catch (e) {
    console.error(e);
    estado.textContent = "❌ Error al cargar la cena.";
  }

  btnGuardar.addEventListener("click", async () => {
    if (!lugar.value || lugar.value.length < 10 || !lugar.value.includes(",")) {
      estado.textContent =
        "⚠️ Introduce una dirección completa (Ej: Calle, ciudad, país)";
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("fecha", fecha.value);
    formData.append("hora", hora.value);
    formData.append("lugar", lugar.value);
    formData.append("stock", stock.value);
    formData.append("precio", precio.value);

    if (imagenEntrada.files.length > 0) {
      formData.append("imagenEntrada", imagenEntrada.files[0]);
    }

    try {
      const res = await fetch("https://ihodeishop.es/php/actualizarCena.php", {
        method: "POST",
        body: formData,
      });

      const texto = await res.text();
      console.log("Respuesta del servidor:", texto);

      try {
        const result = JSON.parse(texto);
        estado.textContent = result.success
          ? "✅ Cena actualizada correctamente."
          : `❌ ${result.error || "Error al actualizar."}`;
      } catch (e) {
        estado.textContent = "❌ Error del servidor: mira consola";
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      estado.textContent = "❌ Error al conectar con el servidor.";
    }
  });
});
