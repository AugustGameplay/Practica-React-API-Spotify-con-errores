import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, CardBody, CardTitle} from 'react-bootstrap'
import { useState, useEffect } from 'react';

const CLIENT_ID= "ef75e96a68ee419eb00c7f0004ac56e6";
const CLIENT_SECRET="84464d8278694cab9803a57b64fbea05";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState ([]);

  useEffect(() => { 
    //API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken (data.access_token))
  }, [])

//Search
async function search() {
    console.log("Search for " + searchInput); //Taylor Swift

//Get request using search to get Artist ID
var searchParameters = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  }
}
var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
.then(response => response.json())
.then(data => { return data.artists.items[0].id })

console.log("Artist ID is" + artistID);
//Get request with artist ID grab all the albums from the artist

var returnedAlbums = await fetch ('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
.then (response => response.json())
.then (data => {
  console.log(data);
  setAlbums(data.items);
});
// Display those album to user
}

console.log(albums);

  return (
    <div className="App">
    <Container>
      <InputGroup className="mb-3" size="lg">
        <FormControl
          placeholder="Search for artist"
          type="input"
          onKeyPress={event => {
            if (event.key == "Enter") {
              console.log("Pressed Enter")
              search();
            }
          }}
          onChange={event => setSearchInput(event.target.value)}
        />
        <button onClick={search}>
          Search
        </button>
      </InputGroup>
    </Container>
    <Container>
      <Row className="mx-2 row row-cols-4">
      {albums.map( (album, i) => {
        console.log(album);
        return (
          <Card>
          <Card.Img src={album.images[0]} />
          <CardBody>
            <CardTitle>{album.na}</CardTitle>
          </CardBody>
        </Card>
        )
      })}
      </Row>
    </Container>
      
    </div>
  );
}

export default App;
