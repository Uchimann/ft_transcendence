export async function updateUserInfo() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('userrname').value;
    const currentUserName = JSON.parse(localStorage.getItem('user')).username;
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    if(!userId){
        alert('Kullanıcı bulunamadı, lütfen tekrar giriş yapın.');
        loadPage('login',true);
        return;
    }
    const response = await fetch('http://localhost:8007/users/update/', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'id': userId
        },
        body: JSON.stringify({
            current_username: currentUserName,
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: username,
        }),
    });
    
    if (response.ok) {
        const result = await response.json();
        console.log('Profile updated:', result);
        

        const newToken = result.token;
        document.cookie = `token=${newToken}; path=/; max-age=1500`;


        const storedUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
            ...storedUser,      
            ...result           
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));

  
        document.getElementById('username').textContent = updatedUser.username;
        document.getElementById('user-role').textContent = updatedUser.first_name;
        document.getElementById('user-location').textContent = updatedUser.email;
        document.getElementById('first-name').value = updatedUser.first_name;
        document.getElementById('last-name').value = updatedUser.last_name;
        document.getElementById('email').value = updatedUser.email;
        document.getElementById('userrname').value = updatedUser.username;
        console.log('Stored user after update:', updatedUser);

    } else {
        console.error('Profile update failed.');
    }
}


export async function updateProfilePicture() {
    console.log('updateProfilePicture function called');

    const fileInput = document.getElementById('file-input');
    

    fileInput.click(); 


    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profile_picture', file); 


            const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user.id;

            const url = `http://localhost:8004/users/upload_avatar/?id=${userId}`;


            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Başarıyla yüklendi:', data);

                    document.getElementById('avatar-img').src = `./avatars/${data.avatar}`;
                    console.log('Avatar güncellendi:', data.avatar);

                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    storedUser.avatar = `./avatars/${data.avatar}`;
                    localStorage.setItem('user', JSON.stringify(storedUser));
                } else 
                {
                    console.error('Yükleme başarisiz:', response.status);
                }
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    });
}

export async function addFriend() {
    console.log('addFriend function called');
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    const friendName = document.getElementById('friend-username').value;
    if(friendName === user.username){
        alert('Kendini arkadaş olarak ekleyemezsin!!!!!.');
        return;
    }

    const checkUsernameUrl = `http://localhost:8007/users/check_username/?username=${friendName}`;
    let friendId = null;
    try {
        const response = await fetch(checkUsernameUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id': userId,
            },
        });

        if (response.ok) {
            const data = await response.json();
            friendId = data.id;
            console.log('Friend ID:', friendId);
            alert(`${friendName} başarıyla eklendi`);
        } else {
            alert('Kullanıcı adı bulunamadı.');
            console.error('Username check failed:', response.status);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }

    const addFriendUrl = `http://localhost:8007/friend/add/?id=${friendId}`;
    try {
        const addFriendResponse = await fetch(addFriendUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id': userId,
            },
            body: JSON.stringify({
                user_id: userId,
                second_user_id: friendId,
            }),
        });

        if (addFriendResponse.ok) {
            console.log('Friend added successfully');
        } else {
            console.error('Failed to add friend:', addFriendResponse.status);
        }
    } catch (error) {
        console.error('Error occurred while adding friend:', error);
    }

}