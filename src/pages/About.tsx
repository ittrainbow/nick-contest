import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { useFade } from '../hooks'
import { i18n, LocaleType } from '../locale'
import { selectApp } from '../redux/selectors'
import { Button } from '../UI'

export const About = () => {
  const { tabActive, duration, mobile } = useSelector(selectApp)
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

  const copyright = ` ${String.fromCodePoint(0x00a9)} ${new Date().getFullYear()}`

  return (
    <div
      className="container flexcol animate-fade-in-up"
      ref={containerRef}
      style={{ height: `calc(100% - ${mobile ? '90px' : '122px'})` }}
    >
      <div className="about-paragraph">
        Each week, we will provide a list of upcoming NFL games. Your goal is to predict the winner of each game -
        simply choose either the Home team or the Away team.
      </div>

      <div className="about-button">
        <Button onClick={handleOpen}>{buttonDetailsMsg}</Button>
      </div>
      {open ? (
        <div ref={aboutRef} className="animate-fade-in-up flexcol about-description">
          <div className="about-legend">
            <span className="about-paragraph">
              <span className="bold">The Rules: </span>Just pick the winner of the upcoming game. No spreads. Pretty
              simple.
            </span>
            <span className="about-paragraph">
              <span className="bold">Overtime Counts: </span>The final score, including any points scored in overtime,
              determines the winner.
            </span>
            <span className="about-paragraph">
              <span className="bold">No Ties: </span>In the rare event a game ends in a tie, that matchup will be voided
              for our competition. It will not count as a win or a loss for any player, and it will not count as an
              attempt.
            </span>

            <span className="about-paragraph">
              <span className="bold">Determining the Winner: </span>The overall winner is the player with the most
              correct picks at the end of the NFL regular season.
            </span>
            <span className="about-paragraph">
              <span className="bold">Tiebreaker: </span>If players are tied for the most correct picks, the winner will
              be determined by highest accuracy percentage, or, in other words, less incorrect answers. This means a
              player with fewer attempts will win the tiebreaker over a player with more attempts and the same number of
              correct answers.
            </span>
            <span className="about-paragraph">Good luck.</span>
          </div>
          <div className="about-copyright" style={{ marginBottom: mobile ? '15px' : '' }}>
            <a href="https://t.me/packers_news">Green 19</a>
            {copyright}
          </div>
        </div>
      ) : null}
    </div>
  )
}
