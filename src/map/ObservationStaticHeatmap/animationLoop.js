
import {
  clear,
  AnimationLoop,
  Framebuffer,
  loadTextures,
  ClipSpaceQuad,
  setParameters
} from 'luma.gl'
import ramp from './ramp_plasma.png'
import fragmentShader from './fragmentShader.glsl'
import blurV from './blurV.glsl'

const animationLoop = new AnimationLoop({
  onInitialize({ gl }) {
    setParameters(gl, {
      depthTest: false,
      antialias: false
    })
    return loadTextures(gl, {
      urls: [
        'http://nodeyoda.westeurope.cloudapp.azure.com/map/gebco_skyggerelieff2_grey.png',
        `http://nodeyoda.westeurope.cloudapp.azure.com/observation/${this.taxonId}.png`,
        ramp
      ],
    }).then(textures => ({
      blurV: new ClipSpaceQuad(gl, {
        fs: blurV,
        uniforms: {
          iChannel0: textures[1]
        }
      }),
      square: new ClipSpaceQuad(gl, {
        fs: fragmentShader,
        uniforms: {
          uSamplerBaseMap: textures[0],
          uSamplerColorRamp: textures[2]
        }
      }),
      fbShadow: new Framebuffer(gl, {id: 'shadowmap', width: 1024, height: 1024}),
    }))
  },
  onRender({ gl, fbShadow, blurV, square }) {
    gl.viewport(0, 0, 1024, 1024);
    clear(gl, {framebuffer: fbShadow, color: [1, 1, 1, 1], depth: false});

    blurV.setUniforms({
      iResolution: [1024,1024],
    })
    .draw({
      framebuffer: fbShadow
    })
    fbShadow.unbind()

    if(true)
    square.setUniforms({
      uSamplerObservations: fbShadow.texture
    })
      .draw({
      })
    }
})

export default animationLoop
