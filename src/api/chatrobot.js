/**
 * 智能聊天机器人
 */
import axios from 'axios'

export const getRobotResponse = text => {
  return axios({
    method: 'GET',
    url: 'http://www.liulongbin.top:3006/api/robot/',
    params: {
      spoken: text
    }
  })
}
