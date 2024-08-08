import React, { useState } from 'react';

function JoinRoom({ onJoinRoom }) {
    const [inputRoomId, setInputRoomId] = useState('');

    const handleInputChange = (e) => {
        setInputRoomId(e.target.value);
    };

    const handleJoinClick = async () => {
        // Call the join room backend function
        try {
            await fetch('http://localhost:5000/join_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_id: inputRoomId })
            });
            onJoinRoom(inputRoomId); // Call parent function to handle the room join
        } catch (error) {
            console.error('Failed to join room:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputRoomId}
                onChange={handleInputChange}
                placeholder="Enter Room ID"
            />
            <button onClick={handleJoinClick}>Join Room</button>
        </div>
    );
}

export default JoinRoom;