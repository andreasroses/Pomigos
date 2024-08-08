import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { CiCirclePlus } from "react-icons/ci";
import { IconContext } from "react-icons";
import "./index.css";
import axios from "axios";
import LoadBoards from "./components/BoardTasks";
import PomodoroTimer from "./components/PomodoroTimer";
import RoomManager from "./components/RoomManager";
import JoinRoom from "./components/JoinRoom";

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [roomID, setRoomID] = useState(null);
  const [userID, setUserID] = useState(3);

  useEffect(() => {
    // Get the room ID from the URL
    const urlRoomID = new URL(window.location.href).pathname.split('/').pop();
    setRoomID(urlRoomID !== 'App' ? urlRoomID : null);
  }, []);

  const addBoard = async (isShared) => {
    try {
      await axios.post('/add_board', {
        board_name: 'New Board',
        user_id: userID,  // Ensure `userID` is defined in your scope
        is_shared: isShared,
        room_id: roomID   // Pass roomID to associate with the room
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setIsAdding(true);
    } catch (error) {
      console.error('Error adding board:', error);
    }
  };

  const addNewBoard = async (isShared) => {
    await addBoard(isShared);
  };

  return (
    <Router>
      <main>
        <RoomManager />
        {roomID ? (
          <div className="flex columns-2 gap-2 mx-2">
            <div className="flex gap-2">
              <LoadBoards
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                userID={userID}
                shared={true}
                roomID={roomID}
              />
              <LoadBoards
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                userID={userID}
                shared={false}
                roomID={roomID}
              />
              <button className="btn btn-neutral flex" onClick={() => addNewBoard(false)}>
                <IconContext.Provider value={{ size: "30" }}>
                  <CiCirclePlus />
                </IconContext.Provider>
                <p className="text-lg">Add new board</p>
              </button>
              <button className="btn btn-neutral flex" onClick={() => addNewBoard(true)}>
                <IconContext.Provider value={{ size: "30" }}>
                  <CiCirclePlus />
                </IconContext.Provider>
                <p className="text-lg">Add new shared board</p>
              </button>
            </div>
            <div>
              <PomodoroTimer />
            </div>
          </div>
        ) : (
          <JoinRoom />
        )}
        <Routes>
          <Route path="/join_room/:roomID" element={<JoinRoom />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;