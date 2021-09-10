import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import './app.css';
import axios from 'axios';
import Modal from 'react-modal';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
import Notification from './components/Notification';
import ListItem from './components/ListItem';

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem('user')
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 34.0489,
    longitude: -111.0937,
    zoom: 4,
  });

  // Modal Styles
  const customStyles = {
    content: {
      width: '16rem',
      height: '16rem',
      padding: '1.5rem 3rem',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      overflow: 'hidden',
      borderRadius: '20px',
      overflowY: 'scroll',
    },
    modalHeading: {
      textAlign: 'center',
    },
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat: lat,
      long: long,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post('/pins', newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (currentUsername) {
        await axios.delete(`/pins/${id}`);
        setPins(
          pins.filter((pin) => {
            return pin._id !== id;
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem('user');
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        onDblClick={handleAddClick}
        transitionDuration="200"
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/tuttongchan/cksy4dn0m44z918pein6miohk"
      >
        <Notification />
        {pins.map((p) => (
          <>
            <Marker
              key={p._id}
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              {/* --- Material UI Marker --- */}
              <Room
                key={p._id}
                style={{
                  fontSize: viewport.zoom * 7,
                  color:
                    p.username === currentUsername ? 'tomato' : 'slateblue',
                  cursor: 'pointer',
                  zIndex: '100',
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="top"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="card">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {/* .fill - Takes the length of the Array fills it that amount of times */}
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete Post
                  </button>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  className="popup-input"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUsername ? (
          <>
            <div className="buttons">
              <button
                className="button all-pins"
                onClick={() => setModalIsOpen(true)}
              >
                All Pins
              </button>
              <button className="button logout" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </>
        ) : (
          <div className="buttons">
            <button className="button login">Guest</button>
            <button
              className="button login"
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Login
            </button>
            <button
              className="button register"
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              Register
            </button>
          </div>
        )}
        {modalIsOpen ? (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Signout Modal"
            style={customStyles}
          >
            <div className="modal-container">
              <div className="top-modal-container">
                <div className="all-pins-logo">ALL PINS</div>
                <input
                  className="modal-input"
                  type="text"
                  placeholder="Search Place..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {pins
                .filter((pin) => {
                  if (searchTerm === '') {
                    return pin;
                  } else if (
                    pin.title.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return pin;
                  }
                })
                .map((pin, i) => (
                  <ListItem key={pin.id} pin={pin} pins={pins} i={i} />
                ))}
            </div>
          </Modal>
        ) : null}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUsername={setCurrentUsername}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
