# Guion de narración — NovaPOS PRO

Guion en español (México), pensado para el video promocional en `demo-video/`.
El texto exacto que se envía a ElevenLabs vive en `voiceover.json`; este
archivo es la versión legible para revisión humana.

| Escena     | Duración en pantalla | Narración |
|------------|-----------------------|-----------|
| Intro      | 3.5 s                 | NovaPOS PRO. El sistema de punto de venta hecho para tu negocio. |
| Ventas     | 6.5 s                 | Vende y cobra en segundos. Escanea el código de barras y cobra en efectivo, tarjeta, transferencia, fiado o Mercado Pago. |
| Cobrar     | 5.5 s                 | Cinco formas de cobrar, y el cambio se calcula solo. Botones de montos rápidos para no perder tiempo en el mostrador. |
| Caja       | 5.5 s                 | Abre y cierra tu turno sin sorpresas. Saldo, ingresos y egresos, siempre claros y acotados a la caja de hoy. |
| Recargas   | 7.0 s                 | Nuevo: recargas telefónicas. Carga tu saldo, registra cada recarga, y la comisión se suma directo a tu ganancia. |
| Inventario | 5.5 s                 | Tu catálogo, siempre bajo control. Alertas de stock bajo, de productos por vencer, y el valor total de tu inventario en vivo. |
| Reportes   | 5.5 s                 | Ventas, costo y ganancia, al momento. Filtra por período o por empleado y conoce el margen real de tu negocio. |
| Config     | 5.0 s                 | Se adapta a tu negocio. Tu giro, tus datos fiscales, seguridad por NIP, impresora térmica y sincronización con Google Sheets. |
| Pricing    | 8.67 s                | Consigue tu licencia de NovaPOS PRO desde 250 pesos mexicanos. Actívala hoy mismo y lleva tu negocio al siguiente nivel. |
| Outro      | 14.3 s                | Todo tu negocio, en un solo lugar, con asistencia si algo falla. Solicita tu demo y pregunta por todas las apps disponibles de Omnia Technology. Encuéntranos en omnia technology punto com. |

Si al generar el audio alguna narración dura más que la escena, alarga
`durationInFrames` de esa `TransitionSeries.Sequence` en `src/DemoVideo.tsx`
(30 fps) para que no se corte.
