/**
 * @param {setup.Trait} race 
 */
setup.Text.Race.region = function (race) {
  return race.text().region
}

setup.Text.Race.REGIONS = {
  city: 'City of Lucgate',
  vale: 'Northern Vales',
  forest: 'Western Forests',
  deep: 'Deep',
  desert: 'Eastern Deserts',
  sea: 'Southern Seas',
  mist: 'Mist',
  heaven: 'Heavens',
}
