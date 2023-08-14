export type LocaleType = { [key: string]: string }

export const i18n = (component: string): LocaleType | undefined => {
  const tab0msg = 'About'
  const tab1msg = 'Profile'
  const tab2msg = 'Week'
  const tab3msg = 'Season'
  const tab4msg = 'Standings'
  const tab5msg = 'Editor'
  const tab6msg = 'Create'

  const dashboardEnterMsg = 'You logged in as'
  const dashboardAdminMsg = 'You are admin'
  const profileHeaderMsg = 'Change profile'
  const profileNameMsg = 'Change username'
  const loginIntro = 'Signed up?'
  const loginMsg = 'Login'
  const regIntro = 'Not signed up yet?'
  const regMsg = 'SignUp'
  const forgotMsg = 'Forget password?'
  const regNameMsg = 'Username'
  const regNameAlert = 'Check username'
  const regEmailAlert = 'Check email'
  const regPasswordAlert = 'Password is too short'
  const emailMsg = 'E-mail'
  const passwordMsg = 'Password'
  const emailExistsMsg = 'Email already in use'
  const emailWrongMsg = 'Check email'
  const passwordWrongMsg = 'Check password'

  const buttonChangesMsg = 'No changes'
  const buttonCancelMsg = 'Cancel'
  const buttonSaveMsg = 'Save'
  const buttonLogoutMsg = 'Logout'
  const buttonProfileMsg = 'Edit profile'
  const buttonDetailsMsg = 'Detailed'
  const buttonDeleteWeekMsg = 'Delete'
  const buttonRegisterMsg = 'Signup'
  const buttonRegisterGoogleMsg = 'Google signup'
  const buttonLoginMsg = 'Login'
  const buttonLoginGoogleMsg = 'Googel Login'
  const buttonRecoverMsg = 'Send recovery email'
  const buttonDeleteYesMsg = 'Yes'
  const buttonDeleteNoMsg = 'No'

  const countdownMsg = 'Kickoff in'
  const gameStartedMsg = 'Game already started'
  const fiveDaysMsg = 'days'
  const twoDaysMsg = 'days'
  const oneDayMsg = 'day'
  const fiveHoursMsg = 'hrs'
  const twoHoursMsg = 'hrs'
  const oneHourMsg = 'hr'
  const minutesMsg = 'min'
  const secondsMsg = 'sec'

  const playerMsg = 'Player'
  const adminMsg = 'Admin'
  const successMsg = 'Save success'
  const failureMsg = 'Save failure'

  const tableNameMsg = 'Player'
  const tableAllMsg = 'Total'
  const tableCorrectMsg = 'Correct'
  const tableBuddiesMsg = 'Favorites'
  const tableAllUsersMsg = 'All players'
  const tableOnlyWeekMsg = 'Last week'
  const tableAllSeasonMsg = 'Season'
  const tablePSOne = 'Standings will be renewed after specifying the results'
  const tablePSTwo = 'Pick a player to see his answers'
  const tableClearBtn = 'Clear'
  const tableSearchMsg = 'Find player'
  const tableHeaderhMsg = 'after '
  const tableNoGamesMsg = 'Standings'
  const tableAnswersMsg = 'Answers'

  const weekNameMsg = 'Week name'
  const weekQuestionMsg = 'Game'
  const weekTotalMsg = 'Total'
  const weekActivityMsg = 'Active'
  const weekDeleteMsg = 'Delete week'
  const weekAwayMsg = 'Away team'
  const weekHomeMsg = 'Home team'

  const otherUser1msg = 'Press this pad to go back to your profile'
  const otherUser2msg = `You're now looking at profile of `
  const otherUser3msg = 'Answers for the games that not started yet are hidden'

  switch (component) {
    case 'about':
      return

    case 'header':
      return { tab0msg, tab1msg, tab2msg, tab3msg, tab4msg, tab5msg, tab6msg }

    case 'editor': {
      return { weekNameMsg, weekQuestionMsg, weekTotalMsg, weekActivityMsg, weekDeleteMsg, weekAwayMsg, weekHomeMsg }
    }

    case 'otheruser':
      return { otherUser1msg, otherUser2msg, otherUser3msg }

    case 'week':
      return { playerMsg, adminMsg, successMsg, failureMsg }

    case 'standings':
      return {
        tableNameMsg,
        tableAllMsg,
        tableCorrectMsg,
        tablePSOne,
        tablePSTwo,
        tableClearBtn,
        tableBuddiesMsg,
        tableAllUsersMsg,
        tableOnlyWeekMsg,
        tableAllSeasonMsg,
        tableHeaderhMsg,
        tableSearchMsg,
        tableNoGamesMsg,
        tableAnswersMsg
      }

    case 'ticks':
      return {
        countdownMsg,
        gameStartedMsg,
        fiveDaysMsg,
        twoDaysMsg,
        oneDayMsg,
        fiveHoursMsg,
        twoHoursMsg,
        oneHourMsg,
        minutesMsg,
        secondsMsg
      }

    case 'auth':
      return {
        dashboardEnterMsg,
        dashboardAdminMsg,
        profileHeaderMsg,
        profileNameMsg,
        loginMsg,
        loginIntro,
        regMsg,
        regIntro,
        forgotMsg,
        regNameMsg,
        regNameAlert,
        regEmailAlert,
        regPasswordAlert,
        emailMsg,
        passwordMsg,
        emailExistsMsg,
        emailWrongMsg,
        passwordWrongMsg
      }

    case 'buttons':
      return {
        buttonChangesMsg,
        buttonCancelMsg,
        buttonSaveMsg,
        buttonLogoutMsg,
        buttonProfileMsg,
        buttonDetailsMsg,
        buttonDeleteWeekMsg,
        buttonRegisterMsg,
        buttonRegisterGoogleMsg,
        buttonLoginMsg,
        buttonLoginGoogleMsg,
        buttonRecoverMsg,
        buttonDeleteYesMsg,
        buttonDeleteNoMsg
      }

    default:
      return
  }
}
