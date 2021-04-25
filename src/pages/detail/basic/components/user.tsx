import React, { useState, FC, useEffect } from 'react';
import _ from 'lodash'
import { Descriptions, Tag, Typography, Tooltip, Button, Form } from 'antd';
import { CardModule, DescriptionsBox, PhotoGallery } from '@/components';
import { ItemUtils, customSizeImg } from '@/utils'
import styles from './../style.less'

interface UserProps {

}

const User: FC<UserProps> = (props: any) => {
  const { purchaseGoodsDetail: { userInfoConfig, detailInfo } }: any = props;

  let imgList = [
    'https://dnkj-world-farm-prd.oss-ap-southeast-1.aliyuncs.com/data/fc-bee/attach/1590103889283.jpeg',
    'http://zyp-farm-2.oss-ap-southeast-1.aliyuncs.com/data/fc-bee/attach/1592207000621.jpg'
  ]

  // 预览图片
  const [previewVisible, setPreviewVisible]: any = useState(false)
  const [previewIndex, setPreviewIndex]: any = useState(0)
  const goodsImgs = detailInfo.pics || imgList
  let previewImages: any = []
  goodsImgs.map((url: string) => {
    previewImages.push({
      url,
    })
  })
  const previewProps = {
    imgData: previewImages,
    showVisible: previewVisible,
    showIndex: previewIndex
  }
  const handleClickImg = (showIndex: number) => {
    setPreviewIndex(showIndex)
    setPreviewVisible(Symbol())
  }

  userInfoConfig.map((item: any) => {
    switch (item.key) {
      case 'idCardNo':
        item.render = (text: any) => {
          let url = 'https://dnkj-world-farm-prd.oss-ap-southeast-1.aliyuncs.com/data/fc-bee/attach/1590103889283.jpeg'
          return (
            <>
              <span className="linkBtn" onClick={() => {
                handleClickImg(0)
              }}>查看</span>
            </>
          )
        }
        break;
      default:
        break;
    }
  })

  const userListProps = {
    itemList: userInfoConfig,
  }

  

  return (
    <>
      <PhotoGallery {...previewProps} />
      <CardModule title="模块标题">
        <DescriptionsBox {...userListProps} />

        <div className={styles.qualification}>
          <div className={styles.nameLabel}>图片缩略：</div>
          <div className={styles.qualificationImg}>
            {
              _.isEmpty(imgList) ? '-' : (
                imgList.map((url: string, index: number) => {
                  return (
                    <div className={styles.imgItem} key={index}
                      onClick={() => {
                        handleClickImg(index)
                      }}
                      style={{ backgroundImage: `url(${customSizeImg(url, 'w_130')})` }}></div>
                  )
                })
              )
            }
          </div>
        </div>
      </CardModule>
    </>
  );
};

export default User;