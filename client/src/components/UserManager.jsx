import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManager = ({ userID, setUserID, roomID }) => {
    useEffect(() => {
        // If a userID is provided via props, use it
        // Check localStorage for an existing user ID
        const storedUserID = localStorage.getItem('userID');
        if (storedUserID) {
            setUserID(storedUserID);
        } else {
            // No user ID in localStorage, create a new user
            const fetchUserID = async () => {
                try {
                    const response = await axios.post('http://localhost:5000/add_user', {}, {
                        params: { room_id: roomID }
                    });
                    const fetchedUserID = response.data.user_id;
                    localStorage.setItem('userID', fetchedUserID);
                    setUserID(fetchedUserID);
                } catch (error) {
                    console.error('Error creating user:', error);
                }
            };

            fetchUserID();
        }

    }, [userID, setUserID]);
};

export default UserManager;