import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { socket } from '../socket';
import Tasks from './Tasks';

function LoadBoards({ isAdding, setIsAdding, userID, shared, roomID, onBoardSelect }) {
    const [boards, setBoards] = useState([]);
    const [editableBoardId, setEditableBoardId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null); // Create a ref for the input field
    const fetchBoards = async () => {
        try {
            const response = await axios.get('http://localhost:5000/boards', {
                params: { user_id: userID, shared: shared }
            });
            setBoards(response.data);
        } catch (error) {
            console.error('Failed to fetch boards:', error);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, [roomID, userID, shared]);

    useEffect(() => {
        const handleBoardAdded = (data) => {
            if (data.board.room_id === roomID && data.board.shared === shared) {
                setBoards((prevBoards) => [...prevBoards, data.board]);
            }
        };

        const handleBoardUpdated = () => {
            fetchBoards();
        };

        socket.on('board_added', handleBoardAdded);
        socket.on('board_updated', handleBoardUpdated);

        return () => {
            socket.off('board_added', handleBoardAdded);
            socket.off('board_updated', handleBoardUpdated);
        };
    }, [roomID, userID, shared]);

    useEffect(() => {
        if (isAdding && boards.length > 0) {
            const newBoard = boards[boards.length - 1];
            setEditableBoardId(newBoard.board_id);
            setInputValue(newBoard.board_name);
            setIsAdding(false);
        }
    }, [isAdding, boards, setIsAdding]);

    const handleNameChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = async (e, id) => {
        if (e.key === 'Enter') {
            await updateBoard(id);
            if (inputRef.current) {
                inputRef.current.blur();
            }
            setEditableBoardId(null);
        }
    };

    const updateBoard = async (id) => {
        try {
            const response = await axios.post('http://localhost:5000/update_board', {
                board_id: id,
                board_name: inputValue,
            });
            const updatedBoard = response.data;
            setBoards((prevBoards) =>
                prevBoards.map((board) =>
                    board.board_id === updatedBoard.board_id ? updatedBoard : board
                )
            );
            setIsAdding(false);
        } catch (error) {
            console.error('Failed to update board:', error);
        }
    };

    return (
        <>
            {boards.map((board) => (
                <div className="card card-compact w-96 shadow-xl" key={board.board_id}>
                    <div className="card-body">
                        {editableBoardId === board.board_id ? (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleNameChange}
                                onKeyDown={(e) => handleKeyDown(e, board.board_id)}
                                autoFocus
                                ref={inputRef} // Assign the ref to the input field
                            />
                        ) : (
                            <h2 className="card-title text-xl" onClick={() => {
                                setEditableBoardId(board.board_id);
                                setInputValue(board.board_name);
                            }}>
                                {board.board_name || 'New Board'}
                            </h2>
                        )}
                        <div><Tasks boardID={board.board_id} /></div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default LoadBoards;