import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../socket';
import Tasks from './Tasks';
function LoadBoards({ isAdding, setIsAdding, userID, shared, roomID, onBoardSelect }) {
    const [boards, setBoards] = useState([]);
    const [editableBoardId, setEditableBoardId] = useState(null);
    const [inputValue, setInputValue] = useState('');

    // Fetch boards when component mounts or roomID changes
    useEffect(() => {
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
    
        fetchBoards();
    }, [roomID]);

    // Handle real-time updates with socket
    useEffect(() => {
        const handleBoardAdded = (data) => {
            if (data.board.room_id === roomID && data.board.shared === shared) {
                setBoards((prevBoards) => [...prevBoards, data.board]);
            }
        };

        socket.on('board_added', handleBoardAdded);

        return () => {
            socket.off('board_added', handleBoardAdded);
        };
    }, [roomID]);
    
    useEffect(() => {
        const handleBoardUpdate = (data) => {
            if (data.board.room_id === roomID && data.board.shared === shared) {
                setBoards((prevBoards) => [...prevBoards, data.board]);
            }
        };

        socket.on('board_updated', handleBoardUpdate);

        return () => {
            socket.off('board_updated', handleBoardUpdate);
        };
    }, [roomID]);

    useEffect(() => {
        if (isAdding && boards.length > 0) {
            const newBoard = boards[boards.length - 1];
            setEditableBoardId(newBoard.id);
            setInputValue(newBoard.name);
            setIsAdding(false);
        }
    }, [isAdding, boards, setIsAdding]);

    const handleNameChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleBlur = async (id) => {
        await updateBoard(id);
        setEditableBoardId(null);
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    const updateBoard = async (id) => {
        try {
            const response = await axios.put(`/update_board`, {
                board_id: id,
                board_name: inputValue,
            });
            const updatedBoard = response.data;
            setBoards((prevBoards) =>
                prevBoards.map((board) =>
                    board.id === updatedBoard.id ? updatedBoard : board
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
                <div className="card card-compact w-96 shadow-xl" key={board.id}>
                    <div className="card-body">
                        {editableBoardId === board.id ? (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleNameChange}
                                onBlur={() => handleBlur(board.id)}
                                onKeyDown={(e) => handleKeyDown(e, board.id)}
                                autoFocus
                            />
                        ) : (
                            <h2 className="card-title text-xl" onClick={() => {
                                setEditableBoardId(board.id);
                                setInputValue(board.name);
                                onBoardSelect(board.id); // Notify parent of selected board
                            }}>
                                {board.name || 'New Board'}
                            </h2>
                        )}
                        <div><Tasks editableBoardId = {board.id}/></div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default LoadBoards;