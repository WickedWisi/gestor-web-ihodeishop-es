document.addEventListener("DOMContentLoaded", () => {
  const fecha = document.getElementById("fecha");
  const hora = document.getElementById("hora");
  const lugar = document.getElementById("lugar");
  const stock = document.getElementById("stock");
  const precio = document.getElementById("precio");
  const imagenEntrada = document.getElementById("imagenEntrada");
  const estado = document.getElementById("estado");
  const btnGuardar = document.getElementById("guardarCena");

  btnGuardar.addEventListener("click", async () => {
    // Validación básica
    if (
      !fecha.value ||
      !hora.value ||
      !lugar.value ||
      lugar.value.length < 10 ||
      !lugar.value.includes(",") ||
      !stock.value ||
      !precio.value ||
      !imagenEntrada.files.length
    ) {
      estado.textContent = "⚠️ Rellena todos los campos y sube la imagen.";
      return;
    }

    const formData = new FormData();
    formData.append("fecha", fecha.value);
    formData.append("hora", hora.value);
    formData.append("lugar", lugar.value);
    formData.append("stock", stock.value);
    formData.append("precio", precio.value);
    formData.append("imagenEntrada", imagenEntrada.files[0]);
    formData.append("activado", 1);

    try {
      const res = await fetch("https://ihodeishop.es/php/guardarCena.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        estado.textContent = "✅ Cena añadida correctamente.";
        fecha.value = "";
        hora.value = "";
        lugar.value = "";
        stock.value = "";
        precio.value = "";
        imagenEntrada.value = "";
      } else {
        estado.textContent = "❌ Error al guardar la cena.";
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      estado.textContent = "❌ Error de conexión con el servidor.";
    }
  });
});
