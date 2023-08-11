import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectAbout, selectApp } from '../redux/selectors'
import { icon1, icon2, icon3 } from '../helpers/icons'
import { i18n, LocaleType } from '../locale'
import { useFade } from '../hooks'
import { Button } from '../UI'

export const About = () => {
  const { tabActive, duration } = useSelector(selectApp)
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
  const { aboutAwayMsg, aboutTieMsg, aboutHomeMsg, aboutLegend } = i18n('about') as LocaleType

  const legend = [
    { icon: icon1, text: aboutAwayMsg },
    { icon: icon2, text: aboutTieMsg },
    { icon: icon3, text: aboutHomeMsg }
  ]

  const description = Object.values(about['en'])

  const copyright = ` ${String.fromCodePoint(0x00a9)} ${new Date().getFullYear()}`

  return (
    <div className="container animate-fade-in-up" ref={containerRef}>
      <div className="about__paragraph">{description[0]}</div>
      <Button onClick={handleOpen}>{buttonDetailsMsg}</Button>
      {open ? (
        <div ref={aboutRef} className="animate-fade-in-up">
          {description.map((el, index) => {
            const classes = `about__paragraph` + (index === 8 ? ' bold' : '')

            return (
              <div key={index} className={classes}>
                {!index ? null : el}
              </div>
            )
          })}
          <div className="about__paragraph">
            <div>{aboutLegend}</div>
          </div>
          {legend.map(({ icon, text }, index) => (
            <div className="legend">
              <div className="legend__icon">{icon}</div>
              <div key={index} className="legend__description">
                {text}
              </div>
            </div>
          ))}
          <hr />
          <div className="about__paragraph copyright">
            <a href="https://t.me/packersnews">Green 19</a>
            {copyright}
          </div>
        </div>
      ) : null}
    </div>
  )
}
