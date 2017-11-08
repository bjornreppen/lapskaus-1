import React from 'react'
import renderer from 'react-test-renderer'
import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'

import ObservationStaticHeatmap from './ObservationStaticHeatmap'

storiesOf('Map observations static ', module)
  .add('alt', () => {
    return <Map taxonId="0" />
  })
  .add('dekkfrøete', () => <Map taxonId="1281" />)
  .add('fjellbjørk', () => <Map taxonId="138955" amplifyFactor={550} />)

const Map = props => {
  return (
    <ObservationStaticHeatmap
    key={props.taxonId}
      taxonId={props.taxonId}
      width={1237}
      height={1552}
      amplifyFactor={props.amplifyFactor}
    />
  )
}
