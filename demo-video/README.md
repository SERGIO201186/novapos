# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Narración con ElevenLabs

El video incluye narración en off por escena. El guion vive en
`voiceover/voiceover.json` (versión legible en `voiceover/guion.md`).

Para generar (o regenerar) los audios:

```console
ELEVENLABS_API_KEY=tu_api_key npm run voiceover
```

Esto crea un `.mp3` por escena en `public/audio/`. Si un archivo aún no
existe, esa escena simplemente se reproduce sin sonido (no rompe el preview
ni el render). Variables opcionales:

- `ELEVENLABS_VOICE_ID`: ID de la voz de ElevenLabs a usar (por defecto una
  voz multilingüe que funciona bien en español).
- `ELEVENLABS_MODEL_ID`: modelo de TTS (por defecto `eleven_multilingual_v2`).

Si alguna narración generada dura más que su escena, alarga el
`durationInFrames` correspondiente en `src/DemoVideo.tsx` (30 fps).

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
