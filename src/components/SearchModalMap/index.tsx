import React, { useState, FC, useRef, useEffect } from 'react'
import { EnhanceModal, SearchMap } from '@/components'
import { Form, message } from 'antd'
import { mapNameToCode } from '@/utils'

interface IProps {}

let SearchModalMap: FC<IProps> = (props: any) => {
  const [form] = Form.useForm()
  const childSearchMap:any = useRef();

  const { handleSaveMap } = props

  const [visible, setVisible] = useState(false)
  const [mapInitInfo, setMapInitInfo] = useState(props.mapInfo)
  const [mapOriginInfo, setMapOriginInfo] = useState(props.mapInfo)

  useEffect(() => {
    setVisible(props.visible)
    setMapInitInfo(props.mapInfo)
  }, [props.visible])

  // 地图弹框-保存
  const handleSave = () => {
    const { mapInitInfo, markerStatus } = childSearchMap.current.state
    let arr = ['香港特别行政区', '澳门特别行政区', '台湾省']
    if(mapInitInfo.province && arr.includes(mapInitInfo.province)) {
      message.error('暂未开放港澳台地区的蜜源地址')
    } else {
      if(markerStatus) {
        let code = mapNameToCode(mapInitInfo)
        let mapInfo = {
          ...mapInitInfo,
          code
        }
        handleSaveMap(mapInfo)
        setVisible(false)
        form.setFieldsValue({ address: mapInitInfo.address })
      } else {
        message.error('请先选择一个地址')
      }
    }
  }

  // 地图弹框-取消
  const handleCancelMap = () => {
    setVisible(false)
    setMapInitInfo(mapOriginInfo)
  }

  const modalProps = {
    form: '',
    visible,
    width: 640,
    confirmLoading: false,
    title: '选择地址',
    onOk: handleSave,
    onCancel: handleCancelMap
  }

  const { lng, lat, address, province, city, county } = mapInitInfo
  const mapInfo = {
    lng,
    lat,
    lngLat: `${lng},${lat}`,
    address,
    province,
    city,
    county,
  }

  return (
    <EnhanceModal {...modalProps}>
      <SearchMap mapInitInfo={mapInfo} ref={childSearchMap} />
    </EnhanceModal>
  )
}

export default SearchModalMap
