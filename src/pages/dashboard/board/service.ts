import { request } from '@/utils';
import { api } from '@/config';

const {
  dashboard: { boardCount, boardSwarm, boardFriendSource, boardFriendPhone, boardFriendSwarm },
} = api;

const fetch = {
  boardCount: (data = {}) => {
    return request({
      url: boardCount,
      data,
    })
  },

  boardSwarm: (data = {}) => {
    return request({
      url: boardSwarm,
      data,
    }, {
      formatResponse: false,
    })
  },

  boardFriendSource: (data = {}) => {
    return request({
      url: boardFriendSource,
      data,
    }, {
      formatResponse: false,
    })
  },

  boardFriendPhone: (data = {}) => {
    return request({
      url: boardFriendPhone,
      data,
    }, {
      formatResponse: false,
    })
  },

  boardFriendSwarm: (data = {}) => {
    return request({
      url: boardFriendSwarm,
      data,
    })
  },
}

export default fetch;