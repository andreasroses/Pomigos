import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { CiCirclePlus } from "react-icons/ci";
import { IconContext } from "react-icons";
import "./index.css";
import axios from "axios";
import LoadBoards from "./components/BoardTasks";
import PomodoroTimer from "./components/PomodoroTimer";
import RoomManager from "./components/RoomManager";

const apiCall = () => {
  axios.get("http://localhost:8080").then((data) => {
    //this console.log will be in our frontend console
    console.log(data);
  });
};
function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [roomID, setRoomID] = useState(null);
  const [userID, setUserID] = useState(3);

  useEffect(() => {
    // Get the room ID from the URL
    const urlRoomID = new URL(window.location.href).pathname.split('/').pop();
    setRoomID(urlRoomID !== 'App' ? urlRoomID : null);
  }, []);

  const addNewBoard = async (isShared) => {
    await addBoard(isShared);
};
  return (
    <Router>
      <main>
        <RoomManager />
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
        <Routes>
          <Route path="/join_room/:roomID" element={<JoinRoom />} />
        </Routes>
      </main>
    </Router>
  );
}
const addBoard = async (isShared) => {
  const response = await fetch('/add_board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board_name: 'New Board', user_id: '${userID}'})
  });
  const newBoard = await response.json();
  setIsAdding(true);
};
export default App;
