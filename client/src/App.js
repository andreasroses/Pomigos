import { useState, useEffect } from "react";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";
import { IconContext } from "react-icons";
import "./index.css";
import LoadBoards from "./components/BoardTasks";
import PomodoroTimer from "./components/PomodoroTimer";
import RoomManager from "./components/RoomManager";
import JoinRoom from "./components/JoinRoom";
import UserManager from "./components/UserManager";

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [roomID, setRoomID] = useState(null);
  const [userID, setUserID] = useState(3);

  useEffect(() => {
    const urlRoomID = new URL(window.location.href).pathname.split("/").pop();
    if (urlRoomID !== "App" && urlRoomID !== "") {
      setRoomID(urlRoomID);
    } else {
      // Optionally retrieve stored roomID
      const storedRoomID = localStorage.getItem("roomID");
      if (storedRoomID) {
        setRoomID(storedRoomID);
      }
    }
  }, []);
  useEffect(() => {
    // Optionally retrieve stored userID
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  const addBoard = async (isShared) => {
    try {
      await axios.post(
        "http://localhost:5000/add_board",
        {
          board_name: "New Board",
          user_id: userID,
          is_shared: isShared,
          room_id: roomID,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setIsAdding(true);
    } catch (error) {
      console.error("Error adding board:", error);
    }
  };

  const addNewBoard = async (isShared) => {
    await addBoard(isShared);
  };

  return (
    <main>
      <RoomManager roomID={roomID} setRoomID={setRoomID} />
      <br />
      {roomID ? (
        <>
          <UserManager userID={userID} setUserID={setUserID} roomID={roomID} />
          <div className="grid grid-cols-3 gap-10 mx-2">
            <div className="col-span-1 flex flex-col gap-4">
              <LoadBoards
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                userID={userID}
                shared={true}
                roomID={roomID}
              />
              <button
                className="btn btn-neutral flex"
                onClick={() => addNewBoard(false)}
              >
                <IconContext.Provider value={{ size: "30" }}>
                  <CiCirclePlus />
                </IconContext.Provider>
                <p className="text-lg">Add new board</p>
              </button>
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <LoadBoards
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                userID={userID}
                shared={false}
                roomID={roomID}
              />
              <button
                className="btn btn-neutral flex"
                onClick={() => addNewBoard(true)}
              >
                <IconContext.Provider value={{ size: "30" }}>
                  <CiCirclePlus />
                </IconContext.Provider>
                <p className="text-lg">Add new shared board</p>
              </button>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              <PomodoroTimer />
            </div>
          </div>
        </>
      ) : (
        <JoinRoom />
      )}
    </main>
  );
}

export default App;
