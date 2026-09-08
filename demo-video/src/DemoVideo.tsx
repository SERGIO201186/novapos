import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene } from "./Scene";
import { Intro } from "./Intro";
import { Outro } from "./Outro";

const T = 15; // duración del fundo entre escenas, en frames (0.5s a 30fps)

export const DemoVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={105} name="Intro">
        <Intro />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={195} name="Ventas">
        <Scene
          eyebrow="Ventas"
          title="Vende y cobra en segundos"
          subtitle="Escanea el código de barras y cobra en efectivo, tarjeta, transferencia, fiado o Mercado Pago."
          image="screens/01-ventas.png"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={165} name="Cobrar">
        <Scene
          eyebrow="Cobro"
          title="Cinco formas de cobrar"
          subtitle="El cambio se calcula solo, con botones de montos rápidos para no perder tiempo en el mostrador."
          image="screens/02-cobrar.png"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={165} name="Caja">
        <Scene
          eyebrow="Caja"
          title="Abre y cierra turno sin sorpresas"
          subtitle="Cada turno arranca en limpio: saldo, ingresos y egresos siempre acotados a la caja de hoy."
          image="screens/03-caja.png"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={210} name="Recargas">
        <Scene
          eyebrow="Nuevo · Recargas telefónicas"
          title="Recargas con saldo y comisión separados"
          subtitle="Carga tu saldo, registra cada recarga y la comisión se suma directo a la ganancia del turno."
          image="screens/05-recargas-historial.png"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={165} name="Inventario">
        <Scene
          eyebrow="Inventario"
          title="Tu catálogo, siempre bajo control"
          subtitle="Alertas de stock bajo y por vencer, entradas de mercancía y valor total del inventario en vivo."
          image="screens/06-inventario.png"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={165} name="Reportes">
        <Scene
          eyebrow="Reportes"
          title="Ventas, costo y ganancia al momento"
          subtitle="Filtra por período o empleado y ve el margen real de tu negocio, no solo lo que vendiste."
          image="screens/07-reportes.png"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={150} name="Config">
        <Scene
          eyebrow="Configuración"
          title="Se adapta a tu negocio"
          subtitle="Giro, datos fiscales, seguridad por NIP, impresora térmica y sincronización con Google Sheets."
          image="screens/08-config.png"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={120} name="Outro">
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// Suma de las duraciones de arriba menos el traslape de cada fundo (8
// transiciones × T frames) — usado por Root.tsx para registrar la
// composición con el largo total exacto.
export const TOTAL_DURATION_IN_FRAMES = 105 + 195 + 165 + 165 + 210 + 165 + 165 + 150 + 120 - 8 * T;
