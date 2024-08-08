import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomManager = ({ roomID, setRoomID }) => {
    const [newRoomID, setNewRoomID] = useState(null);
    const [roomURL, setRoomURL] = useState('');

    useEffect(() => {
        // If a roomID is provided via props, use it
        if (roomID) {
            setRoomURL(`${window.location.origin}/join_room/${roomID}`);
        } else {
            // Check localStorage for an existing room ID
            const storedRoomID = localStorage.getItem('roomID');
            if (storedRoomID) {
                setRoomID(storedRoomID);
                setRoomURL(`${window.location.origin}/join_room/${storedRoomID}`);
            } else {
                // No room ID in localStorage, create a new room
                const fetchRoomID = async () => {
                    try {
                        const response = await axios.post('http://localhost:5000/add_room');
                        const fetchedRoomID = response.data.room_id;
                        setNewRoomID(fetchedRoomID);
                        localStorage.setItem('roomID', fetchedRoomID);
                        setRoomURL(`${window.location.origin}/join_room/${fetchedRoomID}`);
                        setRoomID(fetchedRoomID);
                    } catch (error) {
                        console.error('Error creating room:', error);
                    }
                };

                fetchRoomID();
            }
        }
    }, [roomID, setRoomID]);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(roomURL);
        alert('Room URL copied to clipboard!');
    };

    return (
        <div className='mx-4'>
            {roomID || newRoomID ? (
                <div>
                    <p className='underline'>Room ID: {roomID || newRoomID}</p>
                    <button onClick={handleCopyClick} className='btn btn-sm btn-secondary'>
                        Copy Room URL
                    </button>
                </div>
            ) : (
                <p>Creating room...</p>
            )}
        </div>
    );
};

export default RoomManager;
