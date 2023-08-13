import * as NFL from 'react-nfl-logos'

export const getLogo = (value: string) => {
  const team = value.trim().toLowerCase()

  switch (team) {
    case 'arizona':
    case 'cardinals':
      return <NFL.ARI size={36} />

    case 'atlanta':
    case 'falcons':
      return <NFL.ATL size={36} />

    case 'baltimore':
    case 'ravens':
      return <NFL.BAL size={36} />

    case 'buffalo':
    case 'bills':
      return <NFL.BUF size={36} />

    case 'carolina':
    case 'panthers':
      return <NFL.CAR size={36} />

    case 'chicago':
    case 'bears':
      return <NFL.CHI size={36} />

    case 'cincinnati':
    case 'bengals':
      return <NFL.CIN size={36} />

    case 'cleveland':
    case 'browns':
      return <NFL.CLE size={36} />

    case 'dallas':
    case 'cowboys':
      return <NFL.DAL size={36} />

    case 'denver':
    case 'broncos':
      return <NFL.DEN size={36} />

    case 'detroit':
    case 'lions':
      return <NFL.DET size={36} />

    case 'green bay':
    case 'packers':
      return <NFL.GB size={36} />

    case 'houston':
    case 'texans':
      return <NFL.HOU size={36} />

    case 'indianapolis':
    case 'colts':
      return <NFL.IND size={36} />

    case 'jacksonville':
    case 'jaguars':
      return <NFL.JAX size={36} />

    case 'kansas city':
    case 'chiefs':
      return <NFL.KC size={36} />

    case 'las vegas':
    case 'raiders':
      return <NFL.LV size={36} />

    case 'los angeles chargers':
    case 'chargers':
      return <NFL.LAC size={36} />

    case 'los angeles rams':
    case 'rams':
      return <NFL.LAR size={36} />

    case 'miami':
    case 'dolphins':
      return <NFL.MIA size={36} />

    case 'minnesota':
    case 'vikings':
      return <NFL.MIN size={36} />

    case 'new england':
    case 'patriots':
      return <NFL.NE size={36} />

    case 'new orleans':
    case 'saints':
      return <NFL.NO size={36} />

    case 'new york giants':
    case 'giants':
      return <NFL.NYG size={36} />

    case 'new york jets':
    case 'jets':
      return <NFL.NYJ size={36} />

    case 'philadelphia':
    case 'eagles':
      return <NFL.PHI size={36} />

    case 'pittsburgh':
    case 'steelers':
      return <NFL.PIT size={36} />

    case 'san francisco':
    case '49ers':
      return <NFL.SF size={36} />

    case 'seattle':
    case 'seahawks':
      return <NFL.SEA size={36} />

    case 'tampa bay':
    case 'buccaneers':
      return <NFL.TB size={36} />

    case 'tennessee':
    case 'titans':
      return <NFL.TEN size={36} />

    case 'washington':
    case 'commanders':
      return <NFL.WAS size={36} />

    default:
      break
  }
}
