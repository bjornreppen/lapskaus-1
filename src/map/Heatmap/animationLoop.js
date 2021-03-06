import {
  clear,
  AnimationLoop,
  Framebuffer,
  loadTextures,
  ClipSpaceQuad,
  setParameters
} from 'luma.gl'
import ramp from '../colorramp/ramp_plasma.png'
import fragmentShader from './fragmentShader.glsl'
import blurV from './blurV.glsl'
import blurH from './blurH.glsl'



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
      ]
    }).then(textures => ({
      blurV: new ClipSpaceQuad(gl, {
        fs: blurV,
        uniforms: {
          iChannel0: textures[1],
        }
      }),
      blurH: new ClipSpaceQuad(gl, {
        fs: blurH
      }),
      square: new ClipSpaceQuad(gl, {
        fs: fragmentShader,
        uniforms: {
          uSamplerBaseMap: textures[0],
          uSamplerColorRamp: textures[2]
        }
      }),
      fbShadow: new Framebuffer(gl, {
        id: 'shadowmap',
        format: gl.LUMINANCE,
        type: gl.FLOAT,
        width: this.width,
        height: this.height
      }),
      fbShadow2: new Framebuffer(gl, {
        id: 'shadowmap2',
 //       color: false,
        format: gl.LUMINANCE,
       type: gl.FLOAT,
        width: this.width,
        height: this.height
      })
    }))
  },
  onRender({ gl, fbShadow, fbShadow2, blurH, blurV, square }) {
    gl.viewport(0, 0, this.width, this.height)
    clear(gl, { framebuffer: fbShadow, color: [0, 0, 0, 1], depth: false })

    blurV
      .setUniforms({
        iResolution: [this.width, this.height],
        amplifyFactor: this.amplifyFactor
      })
      .draw({
        framebuffer: fbShadow
      })
    //    fbShadow.unbind()

    blurH
      .setUniforms({
        iResolution: [this.width, this.height],
        iChannel0: fbShadow.texture
      })
      .draw({
        framebuffer: fbShadow2
      })

    if (true)
      square
        .setUniforms({
          uSamplerObservations: fbShadow2.texture
        })
        .draw({})
  }
})

export default animationLoop
