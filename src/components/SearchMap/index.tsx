import React, { Component } from 'react'
import reqwest from 'reqwest';
import _ from 'lodash'
import { source } from '@/config';
import { Input, Tabs, message, Checkbox } from 'antd'
import styles from './index.less'

const { TabPane } = Tabs

declare let AMap: any

let map: any;
let marker: any;
let placeSearch: any
let satellite: any

// 创建标记
function createMarker(_this: any, lng: number, lat: number) {
  if (marker) {
    marker.setMap(null);
    marker = null;
  }
  marker = new AMap.Marker({
    position: [lng, lat],
    map: map,
    draggable: true,
    cursor: 'move',
    offset: new AMap.Pixel(-13, -42),
    icon: new AMap.Icon({
      image: source.markerIcon,
      size: new AMap.Size(27, 42),
      imageSize: new AMap.Size(27, 42)
    }),
  });
  AMap.event.addListener(marker, 'dragstart', (e: any) => {
    map.clearInfoWindow()
  })
  AMap.event.addListener(marker, 'dragend', (e: any) => {
    let lng = marker.getPosition().lng,
        lat = marker.getPosition().lat;
    reqwest({
      url: `https://restapi.amap.com/v3/geocode/regeo?location=${lng},${lat}&key=08d2763bfc969de1a53b1e5eb29874aa`,
      type: 'jsonp',
      method: 'GET',
      success: (res: any) => {
        if (res.info === 'OK') {
          const { province, city, district} = res.regeocode.addressComponent
          const { mapInitInfo } = _this.state
          let c = city.length ? city : province
          _this.setState({
            mapInitInfo: {
              ...mapInitInfo,
              lng,
              lat,
              province,
              city: c,
              county: district,
              lngLat: `${lng},${lat}`,
              address: res.regeocode.formatted_address
            }
          })
        }
      },
      error: (err: any) => {
        console.log('err', err);
        message.error('经纬度获取地址失败');
      },
    })
  })
  map.panTo([lng, lat]);
  // map.setCenter([lng, lat])
}

// 定位当前位置
function locationGeo() {
  let geolocation = new AMap.Geolocation({
    enableHighAccuracy: false,// 是否使用高精度定位，默认：true
    convert: true,
    showMarker: true,
    panToLocation: true,
    timeout: 10000
  });

  geolocation.getCurrentPosition();
  map.addControl(geolocation);

  AMap.event.addListener(geolocation, 'complete', onComplete)

  AMap.event.addListener(geolocation, 'error', onError)

  function onComplete(data: any) {}

  function onError(data: any) {
    reqwest({
      url: 'https://api.map.baidu.com/location/ip?ak=HQi0eHpVOLlRuIFlsTZNGlYvqLO56un3&coor=bd09ll',
      type: 'jsonp',
      method: 'post',
      success: function (res: any) {
        const { point } = res.content;
        map.setCenter([point.x, point.y])
      },
      error: (err: any) => {
        message.error('获取定位失败');
      },
    })
  }
}

interface IProps {
  lng?: number,
  lat?: number,
  address?: string,
  mapWidth?: string,
  mapHeight?: string,
  mapInitInfo?: any,
  ref?: any
}

interface IState {
  location: number[],
  address?: string,
  satelliteStatus: boolean,
  map: any,

  mapInitInfo?: any,
  markerStatus?: any
}

export default class SearchMap extends Component<IProps, IState> {
  state: IState = {
    location: [], // 选中的经纬度
    address: '', // 选中的地址
    map: null,
    mapInitInfo: this.props.mapInitInfo,
    satelliteStatus: false
  }

  componentDidMount() {
    const { mapInitInfo } = this.state
    map = new AMap.Map("searchMap", {
      zoom: 10,
      resizeEnable: true,
      expandZoomRange: true,
      zooms: [3,20],
    });

    satellite = new AMap.TileLayer({
      getTileUrl: '//mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile',
      errorUrl: ''
    });

    map.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geolocation'], () => {
      // 搜索
      let auto = new AMap.Autocomplete({
        city: '',
        input: "tipinput",
        // output: "panel"
      });
      placeSearch = new AMap.PlaceSearch({
        map: map,
        pageSize: 5, //单页显示结果条数
        pageIndex: 1, // 页码
        panel: "panel",
        autoFitView: true
      });
      const selectPoi = (e: any) => {
        const { mapInitInfo } = this.state
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
        if(marker) {
          marker.setMap(null);
          marker = null;
        }
        this.setState({
          mapInitInfo: {
            ...mapInitInfo,
            address: e.poi.name
          }
        })
      }
      // 点击搜索列表
      AMap.event.addListener(auto, "select", selectPoi);

      // 点击 poi 列表
      AMap.event.addListener(placeSearch, "listElementClick", (e: any) => {
        const { data } = e
        const { pname, cityname, adname, name } = data
        let address = `${pname === cityname ? '' : pname}${cityname}${adname}${name}`
        const { mapInitInfo } = this.state
        this.setState({
          location: [data.location.lng, data.location.lat],
          address,
          mapInitInfo: {
            ...mapInitInfo,
            lng: data.location.lng,
            lat: data.location.lat,
            province: pname,
            city: cityname,
            county: adname,
            lngLat: `${data.location.lng},${data.location.lat}`,
            address
          }
        })

        createMarker(this, data.location.lng, data.location.lat)
        this.setState({
          markerStatus: marker
        })
      })

      if(!mapInitInfo.lng || !mapInitInfo.lat) {
        locationGeo()
      }
    })

    if(mapInitInfo.lng && mapInitInfo.lat) {
      createMarker(this, mapInitInfo.lng || '', mapInitInfo.lat || '')
      this.setState({ markerStatus: marker })
    }
  }

  UNSAFE_componentWillReceiveProps(newProps: any, oldProps: any) {
    let _this = this
    const { mapInitInfo } = newProps
    if(this.props.mapInitInfo.lng || this.props.mapInitInfo.lat) {
      if(JSON.stringify(this.props.mapInitInfo) !== JSON.stringify(mapInitInfo)) {
        createMarker(_this, mapInitInfo.lng, mapInitInfo.lat)
      }
    }
  }

  handleChangeInput = (e: any) => {
    if(marker) {
      marker.setMap(null);
      marker = null;
    }
    const address = e.target.value
    const { mapInitInfo } = this.state
    this.setState({
      mapInitInfo: {
        ...mapInitInfo,
        address,
        lngLat: ''
      },
      markerStatus: marker
    })
  }

  handleChangeTitude = (e: any) => {
    const lngLat = e.target.value
    const { mapInitInfo } = this.state
    this.setState({
      mapInitInfo: {
        ...mapInitInfo,
        lngLat
      },
    })
  }

  handleChangeTab = () => {
    placeSearch.clear()
  }

  // 经纬度回车搜索
  handleTitude = (e: any) => {
    let _this = this
    if (e.keyCode === 13) {
      let v = e.target.value
      let value = v.split(',')
      if(value.length === 1 || Number(value[0]) < Number(value[1])) {
        message.error('格式为"经度,纬度", 如：104.076927,30.683526');
        return false;
      }
      if (value.length === 2) {
        reqwest({
          url: `https://restapi.amap.com/v3/geocode/regeo?location=${value[0]},${value[1]}&key=08d2763bfc969de1a53b1e5eb29874aa`,
          type: 'jsonp',
          method: 'GET',
          success: (res: any) => {
            if (res.info === 'OK') {
              const { province, city, district } = res.regeocode.addressComponent
              const { mapInitInfo } = _this.state
              let c = city.length ? city : province
              if (marker) {
                marker.setMap(null);
                marker = null;
              }
              marker = new AMap.Marker({
                position: [value[0], value[1]],
                map: map,
                draggable: true,
                cursor: 'move',
                offset: new AMap.Pixel(-13, -42),
                icon: new AMap.Icon({
                  image: source.markerIcon,
                  size: new AMap.Size(50, 50),
                  imageSize: new AMap.Size(27, 42)
                }),
              });
              _this.setState({
                markerStatus: marker,
                mapInitInfo: {
                  ...mapInitInfo,
                  lng: value[0],
                  lat: value[1],
                  province,
                  city: c,
                  county: district,
                  lngLat: `${value[0]},${value[1]}`,
                  address: res.regeocode.formatted_address
                }
              })
              AMap.event.addListener(marker, 'dragend', (e: any) => {
                let lng = marker.getPosition().lng,
                    lat = marker.getPosition().lat;
                reqwest({
                  url: `https://restapi.amap.com/v3/geocode/regeo?location=${lng},${lat}&key=08d2763bfc969de1a53b1e5eb29874aa`,
                  type: 'jsonp',
                  method: 'GET',
                  success: (res: any) => {
                    if (res.info === 'OK') {
                      const { province, city, district } = res.regeocode.addressComponent
                      const { mapInitInfo } = _this.state
                      let c = city.length ? city : province
                      _this.setState({
                        markerStatus: marker,
                        mapInitInfo: {
                          ...mapInitInfo,
                          lng: value[0],
                          lat: value[1],
                          province,
                          city: c,
                          county: district,
                          lngLat: `${value[0]},${value[1]}`,
                          address: res.regeocode.formatted_address
                        }
                      })
                    }
                  },
                  error: (err: any) => {
                    console.log('err', err);
                    message.error('经纬度获取地址失败');
                  },
                })
              })
              map.panTo([value[0], value[1]]);
            }
          },
          error: (err: any) => {
            console.log('err', err);
            message.error('经纬度获取地址失败');
          },
        })
      }
    }
  }

  // 地址回车
  handleKeyupAddr = (e: any) => {
    const { mapInitInfo } = this.state
    placeSearch.search(mapInitInfo.address)
    if (e.keyCode === 13) {
      const { mapInitInfo } = this.state
      placeSearch.search(mapInitInfo.address)
    }
  }

  // 显隐卫星图层
  handleSatelliteChange = () => {
    const { satelliteStatus } = this.state
    if(!satelliteStatus) {
      map.add(satellite)
      satellite.show()
    } else {
      satellite.hide();
    }
    this.setState({ satelliteStatus: !satelliteStatus })
  }

  render() {
    const {
      mapWidth = '100%',
      mapHeight = '300px',
      // mapInitInfo
    } = this.props

    const { mapInitInfo, satelliteStatus } = this.state

    return (
      <>
        <div className={styles.mapSearchBox}>
          <div className={styles.search}>
            <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
              <TabPane tab="按地址搜索" key="1">
                <Input
                  id="tipinput"
                  placeholder="请输入名称"
                  onChange={this.handleChangeInput}
                  value={mapInitInfo.address}
                  autoComplete="off" 
                  onFocus={this.handleKeyupAddr}
                />
                <div id="panel" className={styles.panel}></div>
              </TabPane>
              <TabPane tab="按经纬度搜索" key="2">
                <Input placeholder="请输入经纬度后回车" value={mapInitInfo.lngLat} onChange={this.handleChangeTitude} onKeyUp={this.handleTitude}/>
              </TabPane>
            </Tabs>
          </div>
          <div id="searchMap" className={styles.searchMap} style={{ width: mapWidth, height: mapHeight }}>
            <div className={styles.roadChecked}>
              <Checkbox checked={satelliteStatus} onChange={this.handleSatelliteChange}>卫星图</Checkbox>
            </div>
          </div>
        </div>
      </>
    )
  }
}
