import React, { FC, useState, useEffect } from 'react'
import { EnhanceModal } from '@/components'

import MapInfo from './MapInfo'

/**
 * import组件 MapSiteShow 后
 * <MapSiteShow {...mapProps} />
 * const mapProps = {
 *   visible，
 *   mapInfo： {
 *     lng，
 *     lat
 *   }
 * }
 * **/

interface IProps {
  visible?: boolean,
}

let ModalMapSite: FC<IProps> = (props: any) => {

  const [visible, setVisible] = useState(false)
  const [ mapInfo, setMapInfo ] = useState(props.mapInfo)

  useEffect(() => {
    setVisible(props.visible)
    setMapInfo(props.mapInfo)
  }, [props.visible])

  const modalProps = {
    form: '',
    visible,
    width: 640,
    confirmLoading: false,
    title: '查看地址',
    footer: null,
    bodyStyle: {
      padding: '5px',
      marginTop: '-20px'
    }
  }

  const mapInfoProps = {
    ...mapInfo
  }

  return (
    <EnhanceModal {...modalProps}>
      <MapInfo { ...mapInfoProps } />
    </EnhanceModal>
  )
}

export default ModalMapSite