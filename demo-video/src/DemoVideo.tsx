import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene } from "./Scene";
import { Intro } from "./Intro";
import { Outro } from "./Outro";
import { Narration } from "./Narration";

const T = 15; // duración del fundo entre escenas, en frames (0.5s a 30fps)

export const DemoVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={135} name="Intro">
        <Intro />
        <Narration id="intro" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={260} name="Ventas">
        <Scene
          eyebrow="Ventas"
          title="Vende y cobra en segundos"
          subtitle="Escanea el código de barras y cobra en efectivo, tarjeta, transferencia, fiado o Mercado Pago."
          image="screens/01-ventas.png"
        />
        <Narration id="ventas" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={225} name="Cobrar">
        <Scene
          eyebrow="Cobro"
          title="Cinco formas de cobrar"
          subtitle="El cambio se calcula solo, con botones de montos rápidos para no perder tiempo en el mostrador."
          image="screens/02-cobrar.png"
        />
        <Narration id="cobrar" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={230} name="Caja">
        <Scene
          eyebrow="Caja"
          title="Abre y cierra turno sin sorpresas"
          subtitle="Cada turno arranca en limpio: saldo, ingresos y egresos siempre acotados a la caja de hoy."
          image="screens/03-caja.png"
        />
        <Narration id="caja" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={245} name="Recargas">
        <Scene
          eyebrow="Nuevo · Recargas telefónicas"
          title="Recargas con saldo y comisión separados"
          subtitle="Carga tu saldo, registra cada recarga y la comisión se suma directo a la ganancia del turno."
          image="screens/05-recargas-historial.png"
        />
        <Narration id="recargas" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={290} name="Inventario">
        <Scene
          eyebrow="Inventario"
          title="Tu catálogo, siempre bajo control"
          subtitle="Alertas de stock bajo y por vencer, entradas de mercancía y valor total del inventario en vivo."
          image="screens/06-inventario.png"
        />
        <Narration id="inventario" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={260} name="Reportes">
        <Scene
          eyebrow="Reportes"
          title="Ventas, costo y ganancia al momento"
          subtitle="Filtra por período o empleado y ve el margen real de tu negocio, no solo lo que vendiste."
          image="screens/07-reportes.png"
        />
        <Narration id="reportes" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={290} name="Config">
        <Scene
          eyebrow="Configuración"
          title="Se adapta a tu negocio"
          subtitle="Giro, datos fiscales, seguridad por NIP, impresora térmica y sincronización con Google Sheets."
          image="screens/08-config.png"
        />
        <Narration id="config" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={170} name="Outro">
        <Outro />
        <Narration id="outro" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// Suma de las duraciones de arriba menos el traslape de cada fundo (8
// transiciones × T frames) — usado por Root.tsx para registrar la
// composición con el largo total exacto. Las duraciones se ajustaron para
// que cada escena dure al menos lo que su narración en voz (ver
// voiceover/guion.md).
export const TOTAL_DURATION_IN_FRAMES = 135 + 260 + 225 + 230 + 245 + 290 + 260 + 290 + 170 - 8 * T;
