const mongoose = require('mongoose');
const RoomID = require('../Model/RoomID');

const fetchData = (RoomName) => {

    return RoomID.find({ 'Room': RoomName }).then((data) => {
        return data
    })

}

const saveData = async (RoomName) => {
    let newRoom = new RoomID({ Room: RoomName });
    return await newRoom.save().then((data) => {
        return data;
    })
}

const createRoom = async (RoomName) => {
    let RoomData = await fetchData(RoomName)
    if (RoomData[0]) {
        return false;
    }
    let newRoomData = await saveData(RoomName)
    return newRoomData;
}

module.exports = createRoom; 