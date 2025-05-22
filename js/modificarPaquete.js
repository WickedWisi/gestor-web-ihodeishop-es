document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const horasInput = document.getElementById("horas");
  const precioInput = document.getElementById("precio");
  const estado = document.getElementById("estado");

  if (!id) {
    estado.textContent = "❌ ID no especificado.";
    return;
  }

  try {
    const res = await fetch("https://ihodeishop.es/php/getHoras.php");
    const paquetes = await res.json();
    const paquete = paquetes.find((p) => p.id == id);

    if (!paquete) {
      estado.textContent = "❌ Paquete no encontrado.";
      return;
    }

    horasInput.value = paquete.horas;
    precioInput.value = paquete.precio;
  } catch (e) {
    console.error(e);
    estado.textContent = "❌ Error al cargar paquete.";
  }

  document.getElementById("guardar").addEventListener("click", async () => {
    const horas = parseInt(horasInput.value.trim(), 10);
    const precio = parseFloat(precioInput.value.trim());

    if (
      Number.isNaN(horas) ||
      horas <= 0 ||
      Number.isNaN(precio) ||
      precio < 0
    ) {
      estado.textContent = "⚠️ Horas y precio válidos requeridos.";
      return;
    }

    const datos = { id, horas, precio };

    try {
      const res = await fetch(
        "https://ihodeishop.es/php/actualizarPaquete.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );

      const data = await res.json();

      estado.textContent = data.success
        ? "✅ Paquete actualizado correctamente."
        : `❌ ${data.message || "Error al actualizar."}`;
    } catch (err) {
      console.error("Error al guardar:", err);
      estado.textContent = "❌ Error al conectar con el servidor.";
    }
  });
});
