import * as NFL from 'react-nfl-logos'

export const getLogo = (value: string) => {
  const team = value.trim().toLowerCase()

  switch (team) {
    case 'arizona':
    case 'cardinals':
      return <NFL.ARI size={42} />

    case 'atlanta':
    case 'falcons':
      return <NFL.ATL size={42} />

    case 'baltimore':
    case 'ravens':
      return <NFL.BAL size={42} />

    case 'buffalo':
    case 'bills':
      return <NFL.BUF size={42} />

    case 'carolina':
    case 'panthers':
      return <NFL.CAR size={42} />

    case 'chicago':
    case 'bears':
      return <NFL.CHI size={42} />

    case 'cincinnati':
    case 'bengals':
      return <NFL.CIN size={42} />

    case 'cleveland':
    case 'browns':
      return <NFL.CLE size={38} />

    case 'dallas':
    case 'cowboys':
      return <NFL.DAL size={42} />

    case 'denver':
    case 'broncos':
      return <NFL.DEN size={38} />

    case 'detroit':
    case 'lions':
      return <NFL.DET size={50} />

    case 'green bay':
    case 'packers':
      return <NFL.GB size={42} />

    case 'houston':
    case 'texans':
      return <NFL.HOU size={42} />

    case 'indianapolis':
    case 'colts':
      return <NFL.IND size={40} />

    case 'jacksonville':
    case 'jaguars':
      return <NFL.JAX size={42} />

    case 'kansas city':
    case 'chiefs':
      return <NFL.KC size={38} />

    case 'las vegas':
    case 'raiders':
      return <NFL.LV size={42} />

    case 'los angeles chargers':
    case 'chargers':
      return <NFL.LAC size={38} />

    case 'los angeles rams':
    case 'rams':
      return <NFL.LAR size={46} />

    case 'miami':
    case 'dolphins':
      return <NFL.MIA size={60} />

    case 'minnesota':
    case 'vikings':
      return <NFL.MIN size={42} />

    case 'new england':
    case 'patriots':
      return <NFL.NE size={46} />

    case 'new orleans':
    case 'saints':
      return <NFL.NO size={42} />

    case 'new york giants':
    case 'giants':
      return <NFL.NYG size={42} />

    case 'new york jets':
    case 'jets':
      return <NFL.NYJ size={42} />

    case 'philadelphia':
    case 'eagles':
      return <NFL.PHI size={42} />

    case 'pittsburgh':
    case 'steelers':
      return <NFL.PIT size={36} />

    case 'san francisco':
    case '49ers':
      return <NFL.SF size={42} />

    case 'seattle':
    case 'seahawks':
      return <NFL.SEA size={42} />

    case 'tampa bay':
    case 'buccaneers':
      return <NFL.TB size={42} />

    case 'tennessee':
    case 'titans':
      return <NFL.TEN size={46} />

    case 'washington':
    case 'commanders':
      return <NFL.WAS size={42} />

    default:
      break
  }
}
