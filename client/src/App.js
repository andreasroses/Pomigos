import { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { IconContext } from 'react-icons';
import './index.css';
import axios from 'axios';
import LoadBoards from './components/BoardTasks';
import PomodoroTimer from './components/PomodoroTimer';

const apiCall = () => {
  axios.get('http://localhost:8080').then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}
function App() {
  const [isAdding, setIsAdding] = useState(false);

  const addNewBoard = async () => {
    const newBoardName = ''; // Omit the id since it's auto-generated
    // await db.boards.add(newBoard);
    setIsAdding(true);
  };
  return (
    <main>
      <div className="flex columns-2 gap-2 mx-2">
        <div className='flex gap-2'>
          <LoadBoards isAdding={isAdding} setIsAdding={setIsAdding} />
          <button className="btn btn-neutral flex" onClick={addNewBoard}>
            <IconContext.Provider value={{ size: '30' }}>
              <CiCirclePlus />
            </IconContext.Provider>
            <p className="text-lg">Add new board</p>
          </button>
        </div>
        <div>
          <PomodoroTimer />
        </div>
      </div>
    </main>
  );
}

export default App;
