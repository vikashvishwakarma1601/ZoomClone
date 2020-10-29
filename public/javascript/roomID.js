
const handleChange = () => {
    if (event.target.value === 'Join Room') {
        setButtonValue('Join Room');
    }
    else {
        setButtonValue('Create Room')
    }
}

const setButtonValue = (value) => {
    const buttonValue = `<input type="submit" class="btn disabled" value="${value}" disabled>`
    document.querySelector('.button').innerHTML = buttonValue;
}


let roomID;
const handleInput = () => {
    roomID = event.target.value
    userName = event.target.value
    if (roomID.length != 0 && userName.length != 0) {
        document.querySelector('.btn').classList.remove('disabled');
        document.querySelector('.btn').removeAttribute('disabled');
    }
    else {
        console.log("Invalid ID")
    }
}

const handleSubmit = (event) => {
    event.preventDefault()
    const roomType = document.querySelector(".btn").value
    const RoomID = document.querySelector('[name="RoomID"]').value
    const UserName = document.querySelector('[name="UserName"]').value

    if (roomType === 'Join Room') {
        const data = fetch('/join-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ RoomID, UserName })
        }).then((res) => {
            return res.json()
        }).catch((err) => {
            console.error(err)
        })

        data.then((res)=>{
            if(res.status){
                window.location.href = `${res.RoomID}`
            }
            else{
                const errorConatiner = document.querySelector('.errorMessage')
                errorConatiner.style.display = 'block'
                errorConatiner.innerText = res.Error
            }
        })
    }

    if(roomType==='Create Room'){
        const data = fetch('/create-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ RoomID, UserName })
        }).then((res) => {
            return res.json()
        }).catch((err) => {
            console.error(err)
        })

        data.then((res)=>{
            if(res.status){
                window.location.href = `${res.RoomID}`
            }
            else{
                const errorConatiner = document.querySelector('.errorMessage')
                errorConatiner.style.display = 'block'
                errorConatiner.innerText = res.Error
            }
        })
    }


}

