import { selectAccommodationD, selectActiveMode, selectNetLensD, useLens } from '@/state/store'
import { blurPxFromDefocus, defocusAt, pupilDiameterMm } from '@/optics/engine'
import type { SceneLayer } from '@/optics/types'

/**
 * The placeholder world: stacked DOM layers, each blurred by a CSS filter whose
 * radius comes from the optics model at that layer's real distance. This is the
 * WebGL seam — replace the *internals* here with a panorama + depth post-pass.
 */
export default function Scene() {
  const mode = useLens(selectActiveMode)
  const eye = useLens((s) => s.eye)
  const lighting = useLens((s) => s.lighting)
  const net = useLens(selectNetLensD)
  const acc = useLens(selectAccommodationD)

  if (!mode) return null
  const pupil = pupilDiameterMm(lighting)
  const blurFor = (d: number) => blurPxFromDefocus(defocusAt(d, eye, net, acc), pupil)

  return (
    <div className={`scene ${lighting}`}>
      {mode.scene.layers.map((layer) => (
        <Layer key={layer.id} layer={layer} blur={blurFor(layer.distanceM)} />
      ))}
      <div className="scene-vignette" />
    </div>
  )
}

function Layer({ layer, blur }: { layer: SceneLayer; blur: number }) {
  const style = { filter: blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none' }

  switch (layer.kind) {
    case 'sky':
      return <div className="layer layer-sky" style={style} />
    case 'backdrop':
      return <div className="layer layer-treeline" style={style} />
    case 'sign':
      return (
        <div className="layer layer-sign" style={style}>
          <div className="park-sign">
            <div className="sign-title">LAKESIDE PARK</div>
            <div className="sign-sub">trail this way →</div>
          </div>
          <div className="sign-post" />
        </div>
      )
    case 'prop':
      return (
        <div className="layer layer-bench" style={style}>
          <div className="bench" />
        </div>
      )
  }
}
