import './App.css';
import { useState, useEffect } from "react";
import * as Papa from 'papaparse';

function App() {

  const [data, setData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('New Zealand');


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data.csv');
      const responseText = await response.text();

      var file = Papa.parse(responseText, {
        header: true
      });
      setData(file.data);
    };

    fetchData();
  }, []);

  const handleFilterData = () => {
    const filteredData = data.filter(e =>
      (selectedCountry === 'all' || e.country === selectedCountry)
    );

    return (
      <div>
      {filteredData.map((e, index) => (
        <section key={`${e.fname} ${e.lname}`}>
          <h3>{e.lname}, {e.fname}</h3>
          <dl>
            <dt>Location: </dt>
            <dd>{e.city && `${e.city}, `}{e.country}</dd>

            {e.sex && <dt>Gender: </dt>}
            {e.sex && <dd>{e.sex}</dd>}

            {e.tribe_affiliation && <dt>Tribal Affiliation: </dt>}
            {e.tribe_affiliation && <dd>{e.tribe_affiliation}</dd>}

            {e.expertise && <dt>Area of Expertise: </dt>}
            {e.expertise && <dd>{e.expertise}</dd>}

            {e.phone && <dt>Phone: </dt>}
            {e.phone && e.phone.split(', ').map((f) => (
              <dd key={f}><a href={`tel:${f}`}>{f}</a></dd>))}

            {e.email && <dt>Email: </dt>}
            {e.email && e.email.split(', ').map((f) => (
              <dd key={f}><a href={`mailto:${f}`}>{f}</a></dd>))}

            {e.website && <dt>Website: </dt>}
            {e.website && e.website.split(', ').map((f) => (
              <dd key={f}><a href={f} target='_blank' rel="noreferrer">{f}</a></dd>))}
          </dl>
        </section>
      ))}
      </div>
    )
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const countryListSet = new Set()
  data?.map(e => countryListSet.add(e.country))

  return (
    <div className="App">
      <main>
        <div>
          <label htmlFor='Country'>Country:</label>
          <select name='Country' id='Country' onChange={handleCountryChange} value={selectedCountry}>
            <option key="all" value='all'>All</option>
            {[...countryListSet].sort().map( country => 
              <option key={country} value={country}>{country}</option>
            )}
          </select>
        </div>

        {data && handleFilterData()}
      </main>
    </div>
  );
}

export default App;