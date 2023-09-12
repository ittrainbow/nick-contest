import { i18n, LocaleType } from '../../locale'

export const StandingsHeader = () => {
  const { tableNameMsg, tableAnswersMsg } = i18n('standings') as LocaleType
  return (
    <div className="standings__header">
      <div className="col-zero">#</div>
      <div className="col-one"></div>
      <div className="col-two">{tableNameMsg}</div>
      <div className="col-three bold">{tableAnswersMsg}</div>
      <div className="col-four">%</div>
      {/* <div className="col-five">95%</div> */}
    </div>
  )
}
