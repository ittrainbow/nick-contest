import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectAbout, selectApp } from '../redux/selectors'
import { i18n, LocaleType } from '../locale'
import { useFade } from '../hooks'
import { Button } from '../UI'

export const About = () => {
  const { tabActive, duration, mobile } = useSelector(selectApp)
  const about = useSelector(selectAbout)
  const containerRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  // container fade animations

  const { triggerFade } = useFade({ ref: containerRef })

  useEffect(() => {
    tabActive !== 0 && triggerFade()
  }, [tabActive, triggerFade])

  // action handlers

  const handleOpen = () => {
    const list = aboutRef.current?.classList
    if (!open) {
      setOpen(!open)
      setTimeout(() => list?.remove('animate-fade-out-down'), duration / 10)
    } else {
      list?.add('animate-fade-out-down')
      setTimeout(() => setOpen(!open), duration)
    }
  }

  // render styles and locales

  const { buttonDetailsMsg } = i18n('buttons') as LocaleType
  const description = Object.values(about['en'])

  const copyright = ` ${String.fromCodePoint(0x00a9)} ${new Date().getFullYear()}`

  return (
    <div
      className="container flexcol animate-fade-in-up"
      ref={containerRef}
      style={{ height: `calc(100% - ${mobile ? '60px' : '92px'})` }}
    >
      <div className="about-paragraph">{description[0]}</div>
      <div className="about-button">
        <Button onClick={handleOpen}>{buttonDetailsMsg}</Button>
      </div>
      {open ? (
        <div ref={aboutRef} className="animate-fade-in-up flexcol about-description">
          <div className="about-legend">
            {description.map((el, index) => {
              return index > 0 ? (
                <div key={index} className="about-paragraph">
                  {el}
                </div>
              ) : (
                ''
              )
            })}
          </div>
          <div className="about-copyright">
            <a href="https://t.me/packersnews">Green 19</a>
            {copyright}
          </div>
        </div>
      ) : null}
    </div>
  )
}
