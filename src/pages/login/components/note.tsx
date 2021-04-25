import React, { useState, FC } from 'react'
import { Form, Input, Button } from 'antd'
import { reg } from '@/utils'
import styles from './../style.less'
import classnames from 'classnames'

interface LoginProps {
  onLogin: (values: any) => void
  loginLoading: boolean
  onSendCode: (payload: any, success: any, error: any) => void
}

const layout = {
  wrapperCol: { span: 24 },
};

const userNameProps = {
  name: 'mobile',
  validateTrigger: [],
  rules: [{ required: true, pattern: reg.phone, message: '手机号格式错误，请重新输入' }],
  style: {
    marginBottom: 28
  }
}
const userNameInputProps: any = {
  placeholder: '手机号',
  size: "large",
  maxLength: 11,
  autoComplete: 'off',
}
const codeProps = {
  name: 'verifyCode',
  validateTrigger: [],
  rules: [{ required: true, pattern: /^\d{4}$/, message: '验证码格式不正确，请重新输入' }],
  style: {
    marginBottom: 57
  }
}

const Note: FC<LoginProps> = (props) => {
  const { onLogin, loginLoading, onSendCode } = props;
  const [form] = Form.useForm();
  const { getFieldValue, validateFields } = form;

  const [sendCode, setSendCode] = useState(false);
  const [fetchTips, setFetchTips] = useState('获取验证码');

  const onFinish = (values: any) => {
    onLogin(values)
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const formProps = {
    ...layout,
    name: 'basic',
    onFinish,
    onFinishFailed,
    form,
  }

  let sendCodeTime: any = null;
  let clearTime = () => {
    clearInterval(sendCodeTime);
    setFetchTips('获取验证码');
    setSendCode(false);
  }

  const hanleTime = () => {
    let time = 60;
    sendCodeTime = setInterval(() => {
      time--;
      if (time === 0) {
        clearTime();
        return false;
      }
      setFetchTips(`${time}秒后再试`);
    }, 1000)
  }

  const handleSendCode = () => {
    validateFields(['mobile']).then(() => {
      const mobileValue = getFieldValue('mobile');
      if (!mobileValue || sendCode) {
        return false;
      }
      setSendCode(true);

      onSendCode({
        mobile: mobileValue,
      }, () => {
        hanleTime();
      }, () => {
        clearTime();
      })
    })
  }

  const codeInputProps: any = {
    size: "large",
    placeholder: '请填写验证码',
    maxLength: 4,
    autoComplete: 'off',
    addonAfter: (
      <div className={classnames(styles.sendCode, {
        [styles.sendActiveCode]: sendCode
      })} onClick={handleSendCode}>
        <span>{fetchTips}</span>
      </div>
    ),
  }

  return (
    <>
      <Form {...formProps}>
        <Form.Item {...userNameProps}>
          <Input {...userNameInputProps} />
        </Form.Item>

        <Form.Item {...codeProps}>
          <Input {...codeInputProps} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" loading={loginLoading} size="large" block htmlType="submit">登录</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Note;