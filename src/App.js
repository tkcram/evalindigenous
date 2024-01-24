import './App.css';
import { useState, useEffect } from "react";
import * as Papa from 'papaparse';
import { countryList } from './countrylist'

function App() {

  const [data, setData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('all');

  function compare( a, b ) {
    if ( a.lname < b.lname ){
      return -1;
    }
    if ( a.lname > b.lname ){
      return 1;
    }
    return 0;
  }

  const fetchData = async () => {
    const response = await fetch('/data.csv');
    const responseText = await response.text();

    var file = Papa.parse(responseText, {
      header: true
    });
    setData(file.data.sort(compare));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterData = () => {
    const filteredData = data.filter(e =>
      (selectedCountry === 'all' || e.country === selectedCountry)
    );

    return (
      <div>
      {filteredData.map((e, index) => (
        <section>
          <h3>{e.lname}, {e.fname}</h3>
          <dl>
            <dt>Location: </dt>
            <dd>{e.city}, {e.country}</dd>

            <dt>Gender: </dt>
            <dd>{e.sex}</dd>

            {e.tribe_affiliation && <dt>Tribal Affiliation: </dt>}
            {e.tribe_affiliation && <dd>{e.tribe_affiliation}</dd>}

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
              <dd><a href={f} target='_blank' rel="noreferrer">{f}</a></dd>))}
          </dl>
        </section>
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
        <div>
          <label htmlFor='Country'>Country:</label>
          <select name='Country' id='Country' onChange={handleCountryChange} value={selectedCountry}>
            <option value='all'>All</option>
            {countryList.map( e => 
              <option value = {e}>{e}</option>
            )}
          </select>
        </div>

        {data && handleFilterData()}
      </main>
    </div>
  );
}

export default App;