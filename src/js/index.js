// common imports
import 'lazysizes'
import 'virtual:svg-icons-register'

import { remSelect } from '../pug/shared/_ui-rem/rem-select/rem-select'
import '../styles/style.scss'
import { validateFormInit } from './components/custom-validator'
import config from './config'
import { barbaUi } from './libs/barba/barba'
import cssDebug from './libs/css-debug/css-debug'
import { lenisInit } from './libs/lenis/lenis'
import { scrollBarWidth } from './utils/scrollbarWidth'
import { initSlideFunction } from './utils/slideFunction'

window.addEventListener('load', scrollBarWidth, false)
window.addEventListener('resize', scrollBarWidth, false)

document.addEventListener('DOMContentLoaded', function () {
  barbaUi()
})

export const commonFunction = () => {
  // libs config
  config()
  cssDebug(true)
  initSlideFunction()

  // libs
  setTimeout(() => {
    lenisInit()
  }, 1200)

  // console.log(1)

  //Form
  validateFormInit()
}
