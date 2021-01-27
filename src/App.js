import "./App.css";
import { useState, useEffect } from "react";
import { FormControl, Select, MenuItem ,Card,CardContent} from "@material-ui/core";
import Infobox from './Infobox';
import Map from './Map';

function App() {
  const [countries, setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  useEffect(() => {
    
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {setCountryInfo(data)})
    
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country, //United States, United Kingdom
            value: country.countryInfo.iso2 //USA, UK
          }));
          setCountries(countries);
        });
    };
    
     getCountriesData();
  }, []);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url = 
    countryCode === "worldwide"
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      console.log(data);
      
    })
    
    
    setCountry(countryCode);
  }
                                                         
  return (
    <div className="app">
    <div className="app__right">
    <div className="app__header">
        <h1>Covid-19 Tracker</h1>
        <FormControl>
          <Select variant="outlined" onChange={onCountryChange} value={country}>
          <MenuItem value="worldwide">World Wide</MenuItem>
            {countries.map(country => {
              return <MenuItem value={country.value}>{country.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
        </div>
        <div className="app__stats">
        <Infobox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
        <Infobox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
        <Infobox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>

      <Map/>
    </div>
      <Card className="app__left">
        <CardContent>
          This is app left
        </CardContent>
      </Card>
    </div>
  );
}



export default App;
