import React, { useState, useEffect } from 'react';

function LoadBoards({ isAdding, setIsAdding }) {
    const boards = [];
    const [editableBoardId, setEditableBoardId] = useState(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isAdding && boards && boards.length > 0) {
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
        //await db.boards.update(id, { name: inputValue });
        setEditableBoardId(null);
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <>
            {boards?.map((board) => (
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
                        <div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default LoadBoards;