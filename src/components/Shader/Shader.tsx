import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

export default function Shader() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <ShaderGradientCanvas>
        <ShaderGradient
        animate="on"
        brightness={1}
        cAzimuthAngle={180}
        cDistance={3.6}
        cPolarAngle={90}
        cameraZoom={1}
        color1="#5d0000"
        color2="#400000"
        color3="#8f3000"
        envPreset="dawn"
        grain="off"
        lightType="3d"
        positionX={-1.4}
        positionY={0}
        positionZ={0}
        range="disabled"
        rangeEnd={40}
        rangeStart={0}
        reflection={0.1}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
        shader="defaults"
        type="plane"
        uAmplitude={1}
        uDensity={1.3}
        uFrequency={5.5}
        uSpeed={0.2}
        uStrength={4}
        uTime={0}
        wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  )
}
