import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:8080'); // Ensure the socket URL matches your server

function LoadBoards({ isAdding, setIsAdding, userID, shared, roomID }) {
    const [boards, setBoards] = useState([]);
    const [editableBoardId, setEditableBoardId] = useState(null);
    const [inputValue, setInputValue] = useState('');

    // Fetch boards when component mounts or roomID changes
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await axios.get(`/get_boards/${roomID}`);
                setBoards(response.data.boards);
            } catch (error) {
                console.error('Failed to fetch boards:', error);
            }
        };
        
        fetchBoards();
    }, [roomID]);

    // Handle real-time updates with socket
    useEffect(() => {
        const handleBoardAdded = (data) => {
            if (data.board.room_id === roomID) {
                setBoards((prevBoards) => [...prevBoards, data.board]);
            }
        };

        socket.on('board_added', handleBoardAdded);

        return () => {
            socket.off('board_added', handleBoardAdded);
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
            const response = await axios.put(`/update_board/${id}`, {
                board_name: inputValue,
                user_id: userID
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
                            }}>
                                {board.name || 'New Board'}
                            </h2>
                        )}
                        <div></div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default LoadBoards;