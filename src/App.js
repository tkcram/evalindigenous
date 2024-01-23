import './App.css';
import { useState, useEffect } from "react";
import * as Papa from 'papaparse';
import { countryList } from './countrylist'

function App() {

  const [data, setData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('all');

  const details = ['fname', 'lname', 'gender', 'tribe_affiliation', 'expertise', 'phone', 'email', 'website']

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/data.csv');
    const responseText = await response.text();

    var file = Papa.parse(responseText, {
      header: true
    });
    setData(file.data);
  };

  const handleFilterData = () => {
    const filteredData = data.filter(e =>
      (selectedCountry === 'all' || e.country === selectedCountry)
    );

    return (
      <div>
      {filteredData.map((e, index) => (
        <dl>
          <dt>Name: </dt>
          <dd>{e.lname}, {e.fname}</dd>

          <dt>Location: </dt>
          <dd>{e.city}, {e.country}</dd>

          <dt>Gender: </dt>
          <dd>{e.sex}</dd>

          {e.tribe_affiliation && <dt>Tribal Affiliation: </dt>}
          <dd>{e.tribe_affiliation}</dd>

          <dt>Area of Expertise: </dt>
          <dd>{e.expertise}</dd>

          {e.phone && <dt>Phone: </dt>}
          {e.phone && e.phone.split(', ').map((f) => (
            <dd><a href={`tel:${f}`}>{f}</a></dd>))}

          {e.email && <dt>Email: </dt>}
          {e.email && e.email.split(', ').map((f) => (
            <dd><a href={`mailto:${f}`}>{f}</a></dd>))}

          {e.website && <dt>Website: </dt>}
          {e.website && e.website.split(', ').map((f) => (
            <dd><a href={f} target='_blank'>{f}</a></dd>))}
        </dl>
      ))}
      </div>
    )
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div className="App">
      <main>
        <label htmlFor='Country'>Country:</label>
        <select name='Country' id='Country' onChange={handleCountryChange} value={selectedCountry}>
          <option value='all'>All</option>
          {countryList.map( e => 
            <option value = {e}>{e}</option>
          )}
        </select>

        {data && handleFilterData()}
      </main>
    </div>
  );
}

export default App;