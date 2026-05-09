/* * JSON TYPES and UTILS * */
import {  numeric,regexp,zodHelpers,jsonLooseCodec,dateUtils, PlainObject,dayjs}from '@snailicid3/utils'
export type HelloWorld = string | number
export const  helloThere: string ="i am new"
export const sampleFunc = (value: HelloWorld): HelloWorld => {
  const __firs=  dayjs('10-31-2004').isValid()
    const _result =dateUtils.isValidDate('10-31-2004','MM-DD-YYYY') // tg.isNotNilOrEmpty('')
    const semver =numeric.isNumeric('1',)
    console.log('sampleFunc:: ', value,semver,_result,__firs)
    return value
}

sampleFunc('herp derp')