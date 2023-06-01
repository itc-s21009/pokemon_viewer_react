import {useEffect, useState} from "react";

function App() {
  const [id, setId] = useState('1')
  const [source, setSource] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState([])
  const [genus, setGenus] = useState([])
  const [error, setError] = useState('')
  const updateSource = (data) => setSource(data["sprites"]["front_default"])
  const updateSpecies = (data) => {
    window.fetch(data['species']['url'])
        .then(r => r.json())
        .then(s => {
          updatePokeName(s)
          updateDescription(s)
          updateGenus(s)
        })
  }
  const findJapanese = (langList) => {
    for (const n of langList) {
      if (n['language']['name'] === 'ja-Hrkt') {
        return n
      }
    }
  }
  const updatePokeName = (species) => {
    const names = species['names']
    const name = findJapanese(names)['name']
    setName(name)
  }
  const updateDescription = (species) => {
    const texts = species['flavor_text_entries']
    const text = findJapanese(texts)['flavor_text']
    setDescription(text.split('\n'))
  }
  const updateGenus = (species) => {
    const genera = species['genera']
    const genus = findJapanese(genera)['genus']
    setGenus(genus)
  }
  const fetchData = () => window.fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
      .then(d => {
        updateSource(d)
        updateSpecies(d)
        setError('')
      })
      .catch(e => setError(`${id}番のポケモンは存在しません`))
  useEffect(() => {
    fetchData()
  }, [])
  const DrawDescription = () => description.map(d => <h6>{d}</h6>)
  return (
      <>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center bg-light p-3 pb-0 border border-3 w-auto mt-3">
                <h1>ポケモン図鑑</h1>
                <input type="number" onChange={(e) => setId(e.target.value)}/>番
                <button className="btn-sm btn-primary ms-2"
                        onClick={fetchData}>検索
                </button>
                <h3 className="text-danger mt-2">{error}</h3>
                <div className="mt-3">
                  <img src={source} alt="" className="border border-2 rounded-circle border-success" width="200"/>
                  <div className="container mt-3 bg-white border border-2 p-2 col-xl-6">
                    <h5 className="">{name}</h5>
                    <h6 className=" text-muted">{genus}</h6>
                    <div className="mt-2">
                      <DrawDescription/>
                    </div>
                  </div>
                </div>
                <p className="text-end">画像提供: <a href="https://pokeapi.co/">PokeAPI.co</a></p>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default App;
