document.addEventListener("DOMContentLoaded", () => {
  const horas = document.getElementById("horas");
  const precio = document.getElementById("precio");
  const estado = document.getElementById("estado");
  const btnGuardar = document.getElementById("guardarPaquete");

  btnGuardar.addEventListener("click", async () => {
    const horasValor = parseInt(horas.value);
    const precioValor = parseFloat(precio.value);

    if (
      isNaN(horasValor) ||
      horasValor <= 0 ||
      isNaN(precioValor) ||
      precioValor < 0
    ) {
      estado.textContent = "⚠️ Introduce horas y precio válidos.";
      return;
    }

    // 1. Generar enlace de Stripe
    try {
      const linkRes = await fetch(
        "https://ihodeishop.es/php/generarEnlaceStripe.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: `${horasValor} horas de asesoramiento`,
            precio: precioValor,
          }),
        }
      );
      const linkData = await linkRes.json();

      if (!linkData.link) {
        estado.textContent = "❌ Error generando el enlace de pago.";
        return;
      }

      const linkCompra = linkData.link;

      // 2. Enviar el paquete con el link
      const paquete = {
        horas: horasValor,
        precio: precioValor,
        linkCompra,
      };

      const res = await fetch("https://ihodeishop.es/php/guardarPaquete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paquete),
      });

      const data = await res.json();

      if (data.status === "ok") {
        estado.textContent = "✅ Paquete guardado correctamente.";
        horas.value = "";
        precio.value = "";
      } else {
        estado.textContent = "❌ Error al guardar el paquete.";
      }
    } catch (err) {
      console.error("Error guardando paquete:", err);
      estado.textContent = "❌ Error al conectar con el servidor.";
    }
  });
});
