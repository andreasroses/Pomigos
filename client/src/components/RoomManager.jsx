import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomManager = () => {
    const [roomID, setRoomID] = useState(null);
    const [roomURL, setRoomURL] = useState('');

    useEffect(() => {
        const fetchRoomID = async () => {
            try {
                const response = await axios.post('/add_room');
                const newRoomID = response.data.room_id;
                setRoomID(newRoomID);
                localStorage.setItem('roomID', newRoomID);
                setRoomURL(`${window.location.origin}/join_room/${newRoomID}`);
            } catch (error) {
                console.error('Error creating room:', error);
            }
        };

        fetchRoomID();
    }, []);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(roomURL);
        alert('Room URL copied to clipboard!');
    };

    return (
        <div>
            {roomID ? (
                <div>
                    <p>Room ID: {roomID}</p>
                    <button onClick={handleCopyClick}>
                        Show Room URL
                    </button>
                    <p>Room URL: {roomURL}</p>
                </div>
            ) : (
                <p>Creating room...</p>
            )}
        </div>
    );
};

export default RoomManager;