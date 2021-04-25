import { message } from 'antd';
message.config({
  maxCount: 1,
});
export const dva = {
  config: {
    onError(e: any) {
      e.preventDefault();
      console.error(e);
      if(e.message !== "") {
        message.error(e.message);
      }
    },
  },
};
