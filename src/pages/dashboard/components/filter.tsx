import React, { FC, useState } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { Radio, DatePicker, Form, message } from 'antd'
import styles from './index.less'

const { Group, Button } = Radio
const { RangePicker } = DatePicker;

interface IFilterProps {
  handleClickRadio: ({ }) => void,
  handleResetForm: ({ }) => void
}

const defaultMoment = [moment().subtract('days', 6), moment()]

const CensusFilter: FC<IFilterProps> = (props: any) => {

  let [form] = Form.useForm();

  const [dates, setDates] = useState(_.cloneDeep(defaultMoment));
  const [checkedVal, setCheckedVal] = useState(1)

  const { name, type, handleClickRadio, handleDateChange, handleResetForm } = props

  const disabledDate = (current: any) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  const handleRadio = (e: any) => {
    const value = Number(e.target.value)
    setCheckedVal(value)
    let timeArr: any = []
    switch (value) {
      case 1:
        timeArr = [moment().subtract('days', 6), moment()]
        break;
      case 2:
        timeArr = [moment().subtract('days', 14), moment()]
        break
      case 3:
        timeArr = [moment().subtract('days', 29), moment()]
        break
      default:
        timeArr = []
        break
    }
    setDates(_.cloneDeep(timeArr))

    if (handleClickRadio) {
      handleClickRadio && handleClickRadio(timeArr)
    } else {
      handleRadio(e)
    }
  }

  const handleChangePicker = (v: any) => {
    // if (!moment(v[1]).isBefore(moment(v[0]).add(30, 'days'))) {
    //   message.error('日期范围不能超过30天');
    //   return
    // }

    setDates(_.cloneDeep(v))
    setCheckedVal(4)
    if (handleDateChange) {
      handleDateChange && handleDateChange(v)
    } else {
      handleChangePicker(v)
    }
  }

  const handleReset = () => {
    setCheckedVal(1)
    setDates(_.cloneDeep(defaultMoment))
    if (handleResetForm) {
      handleResetForm && handleResetForm()
    } else {
      handleReset()
    }
  }

  const groupButtonList = [
    {
      label: '最近7天',
      value: 1,
    },
    {
      label: '最近15天',
      value: 2,
    },
    {
      label: '最近30天',
      value: 3,
    }
  ]

  const pickerProps = {
    value: dates,
    allowClear: false,
    onChange: (v: [any, any], type: string) => {
      handleChangePicker(v)
    }
  }

  return (
    <div className={styles.filters}>
      <Form>
        <Group name={name} value={checkedVal}>
          {
            groupButtonList.map((item: any) => {
              let btnProps = {
                key: item.value,
                value: item.value,
                onClick: (e: any) => {
                  handleRadio(e)
                },
                // checked: checkedVal === item.value ? true : false
              }
              return (
                <Button {...btnProps}>{item.label}</Button>
              )
            })
          }
          <Button value={4} onClick={(e) => handleRadio(e)} checked={checkedVal === 4 ? true : false} style={{display: 'none'}}>最近30天</Button>
        </Group>
        <RangePicker {...pickerProps} />
        <Button className={styles.btnReset} onClick={() => handleReset()}>重置</Button>
      </Form>
    </div>
  )
}

export default CensusFilter