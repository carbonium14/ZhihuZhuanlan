import { ColumnProps, imageProps, userProps } from '../store'
export function generateFitUrl (data: imageProps, width: number, height: number, format = ['m_pad']):void {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}
export function addColumnAvatar (data: ColumnProps | userProps, width: number, height: number):void {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}
interface checkCondition {
  format?: string[];
  size?: number;
}
type ErroeType = 'size' | 'format' | null
export function beforeUploadCheck (file: File, condition: checkCondition):any {
  const { format, size } = condition
  const isVaildFormat = format ? format.includes(file.type) : true
  const isVaildSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErroeType = null
  if (!isVaildFormat) {
    error = 'format'
  }
  if (!isVaildSize) {
    error = 'size'
  }
  return {
    passed: isVaildFormat && isVaildSize,
    error
  }
}
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>):any => {
  return arr.reduce((pre, cur) => {
    if (cur._id) {
      pre[cur._id] = cur
    }
    return pre
  }, {} as { [key: string]: T })
}
export const objToArr = <T>(obj: {[key: string]: T}):any => {
  return Object.keys(obj).map(key => obj[key])
}
