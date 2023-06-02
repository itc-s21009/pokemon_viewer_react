import {useEffect, useState} from "react";

function App() {
  const [id, setId] = useState('1')
  const [source, setSource] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState([])
  const [genus, setGenus] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)
  const updateSource = (data) => setSource(data["sprites"]["front_default"])
  const updateSpecies = (data) => {
    return window.fetch(data['species']['url'])
        .then(r => r.json())
        .then(s => {
          const name = getPokeName(s)
          const description = getDescription(s)
          const genus = getGenus(s)
          setName(name)
          setDescription(description.split('\n'))
          setGenus(genus)
        })
  }
  const findJapanese = (langList) => {
    for (const n of langList) {
      if (n['language']['name'] === 'ja-Hrkt') {
        return n
      }
    }
  }
  const getPokeName = (species) => {
    const names = species['names']
    return findJapanese(names)['name']
  }
  const getDescription = (species) => {
    const texts = species['flavor_text_entries']
    return findJapanese(texts)['flavor_text']
  }
  const getGenus = (species) => {
    const genera = species['genera']
    return findJapanese(genera)['genus']
  }
  const fetchData = () => {
    setLoading(true)
    window.fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(r => r.json())
        .then(d => {
          updateSource(d)
          updateSpecies(d).then(() => {
            setError('')
            setLoading(false)
          })
        })
        .catch(e => {
          setError(`${id}番のポケモンは存在しません`)
          setLoading(false)
        })
  }
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
                <h5 className="text-muted" hidden={!isLoading}>Loading...</h5>
                <p className="text-end">画像提供: <a href="https://pokeapi.co/">PokeAPI.co</a></p>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default App;
