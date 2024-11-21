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
        loadPage('login');
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
        
        // Yeni token'ı güncelle
        const newToken = result.token;
        document.cookie = `token=${newToken}; path=/; max-age=1500`;

        // Eski kullanıcı bilgilerini localStorage'dan alıp güncelle
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
            ...storedUser,      // Mevcut bilgileri koru
            ...result           // Yalnızca gelen veriyi güncelle
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // HTML elemanlarını güncelle
        document.getElementById('username').textContent = updatedUser.username;
        document.getElementById('user-role').textContent = updatedUser.first_name;
        document.getElementById('user-location').textContent = updatedUser.email;
        document.getElementById('first-name').value = updatedUser.first_name;
        document.getElementById('last-name').value = updatedUser.last_name;
        document.getElementById('email').value = updatedUser.email;
        document.getElementById('userrname').value = updatedUser.username;
        //document.getElementById('avatar-img').src = `.${updatedUser.avatar}`;
        console.log('Stored user after update:', updatedUser);

    } else {
        console.error('Profile update failed.');
    }
}

// Profil resmini güncelleme fonksiyonu
// Profil resmini güncelleme fonksiyonu
export async function updateProfilePicture() {
    console.log('updateProfilePicture function called');

    const fileInput = document.getElementById('file-input');
    
    // Dosya seçildiyse işlemi başlat
    fileInput.click(); // Dosya input'unu tetikle

    // Dosya input'unun değiştiğini kontrol et
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];  // Seçilen dosya
        if (file) {
            const formData = new FormData();
            formData.append('profile_picture', file);  // Dosyayı formData'ya ekle

            // Bearer token (Örnek: localStorage'dan alınıyor)
            const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1]; // Token'ı al
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user.id; // Kullanıcı ID'si

            const url = `http://localhost:8004/users/upload_avatar/?id=${userId}`; // URL'ye user_id ekleyin

            // Fetch ile dosyayı sunucuya gönder
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData, // Sadece formData'yı gönder
                    headers: {
                        'Authorization': `Bearer ${token}`, // Bearer token'ı başlığa ekle
                    },
                });

                if (response.ok) {
                    const data = await response.json(); // Backend'den dönen yanıtı al
                    console.log('Başarıyla yüklendi:', data);
                    // Yeni profil resmini güncelle
                    document.getElementById('avatar-img').src = `./avatars/${data.avatar}`;
                    console.log('Avatar güncellendi:', data.avatar);
                    // Yeni avatarı locale kaydet
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
    // Kullanıcı adı kontrolü
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
        } else {
            console.error('Username check failed:', response.status);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
    // Arkadaş ekleme
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