import React, { Component } from 'react'
import { EnhanceModal, SearchMap } from '@/components'
import { Form, message } from 'antd'
import { source } from '@/config'

interface IProps {
  visible?: boolean,
  lng?: any,
  lat?: any
}
interface IState {}

declare let AMap: any
let mapView: any
let marker: any;

function createMarker(_this: any, lng: number, lat: number) {
  if (marker) {
    marker.setMap(null);
    marker = null;
  }

  marker = new AMap.Marker({
    position: [lng, lat],
    map: mapView,
    offset: new AMap.Pixel(-13, -42),
    icon: new AMap.Icon({
      image: source.markerIcon,
      size: new AMap.Size(27, 42),
      imageSize: new AMap.Size(27, 42)
    }),
  });
  mapView.panTo([lng, lat]);
}

class MapInfo extends Component<IProps, IState> {
  componentDidMount() {
    mapView = new AMap.Map("viewMapSite", {
      zoom: 10,
      resizeEnable: true,
      expandZoomRange: true,
      zooms: [3,20],
    });
    createMarker(this, this.props.lng, this.props.lat)
  }

  render() {
    return (
      <div id="viewMapSite" style={{ width: '100%', height: '500px' }}></div>
    )
  }
}

export default MapInfo