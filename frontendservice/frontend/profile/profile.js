export class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.firstName = data.first_name;
        this.lastName = data.last_name;
        this.email = data.email;
        this.avatar = data.avatar;
        this.isOnline = data.is_online;
        this.winCount = data.win_count;
        this.lossCount = data.loss_count;
    }
}

export async function loadUserInfo() {
    try {
        //localde user bilgileri var ise istek atmadan localden user bilgilerini al
        /*const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userr = JSON.parse(storedUser);

            //bu arada html sayfası yüklenmesi lazım çünkü html sayfası yüklenmeden elementler tanımlanamaz

            document.getElementById('username').textContent = userr.username;
            document.getElementById('user-role').textContent = userr.first_name;
            document.getElementById('user-location').textContent = userr.email;
            //loadingMessage.style.display = 'none'; // Yükleniyor mesajını gizle
            return;
        }*/

        const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1]; // Token'ı al
        const user_id = localStorage.getItem('user_id'); // User id'yi al
        console.log('loaduserinfouserid:', user_id);
        const response = await fetch('http://localhost:8007/users/username/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Kullanıcının token'ını ekle
                'id': user_id, // Kullanıcının id'sini ekle
            },
        });

        if (response.ok) {
            const user = await response.json();
            
            document.getElementById('username').textContent = user.username; // Kullanıcı adını güncelle
            document.getElementById('user-role').textContent = user.first_name; // Kullanıcı rolünü güncelle
            document.getElementById('user-location').textContent = user.email; // Kullanıcı konumunu güncelle
            
            document.getElementById('first-name').value = user.first_name; // Kullanıcı emailini güncelle
            document.getElementById('last-name').value = user.last_name; // Kullanıcı telefonunu güncelle
            document.getElementById('email').value = user.email; // Kullanıcı emailini güncelle
            document.getElementById('userrname').value = user.username; // Kullanıcı username'ini güncelle
            document.getElementById('avatar-img').src = `.${user.avatar}`; // Kullanıcı profil resmini güncelle

            const usernameElem = document.getElementById('username');
            if (usernameElem) {
                usernameElem.textContent = user.username;
            } else {
                console.error('Username öğesi bulunamadı.');
            }

            localStorage.setItem('user', JSON.stringify(user)); // Kullanıcı bilgilerini local storage'a kaydet

        } else {
            console.error('Kullanıcı bilgileri yüklenemedi.');
        }
    } catch (error) {
        return; // token olmadığında console.error hatası vermesin diye return ekledim	
        console.error('Hata:', error);
    }
}

export async function loadFriendList() {
    const friendListContainer = document.getElementById('friend-list');
    const matchHistoryList = document.getElementById('match-history-list');
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const friendListUrl = `http://localhost:8007/friend/friend-list/?user_id=${userId}`;
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];

    let users;
    try {
        // İlk fetch işlemi
        const usersResponse = await fetch('http://localhost:8007/users/list/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'id': userId
            }
        });
        const usersData = await usersResponse.json();
        users = usersData.map(user => new User(user));
        console.log('All users:', users);

        // İkinci fetch işlemi
        const friendResponse = await fetch(friendListUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id': userId
            },
        });

        if (friendResponse.ok) {
            const friendList = await friendResponse.json();
            console.log('Friend list:', friendList);

            friendList.forEach(friend => {
                const friendUser = users.find(user => user.id === friend.second_user_id);
                console.log('Friend user:', friendUser);

                const friendListItem = document.createElement('li');
                friendListItem.classList.add('list-group-item', 'd-flex', 'align-items-center', 'friend-item');

                const avatar = document.createElement('img');
                avatar.src = friendUser.avatar; // User sınıfından gelen avatar URL'si
                avatar.className = 'rounded-circle me-3';
                avatar.style.width = '40px';
                avatar.style.height = '40px';


                const usernameSpan = document.createElement('span');
                usernameSpan.classList.add('fw-bold', 'ml-2');
                usernameSpan.textContent = friendUser.username;

                //kullanıcıların online durumunu belirten işareti ekle
                const onlineStatus = document.createElement('span');
                onlineStatus.className = friendUser.isOnline ? 'badge bg-success ms-auto' : 'badge bg-secondary ms-auto';
                onlineStatus.textContent = friendUser.isOnline ? 'Online' : 'Offline';


                friendListItem.appendChild(avatar);
                friendListItem.appendChild(usernameSpan);
                friendListItem.appendChild(onlineStatus);
                friendListContainer.appendChild(friendListItem);
            }
            );
        } else {
            console.error('Failed to fetch friend list:', friendResponse.status);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

export async function fetchMatchHistory() {
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1]; // Token'ı al
    const userId = JSON.parse(localStorage.getItem('user')).username; // User id'yi al

    try {
        const response = await fetch(`http://127.0.0.1:8005/game/list/?user_name=${userId}`);
        const matchHistory = await response.json();

        const matchHistoryList = document.getElementById('match-history-list');
        matchHistoryList.innerHTML = ''; // Önceki içeriği temizle

        matchHistory.forEach(match => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.style.marginTop = '4px';
            listItem.style.marginBottom = '2px';
            listItem.style.borderRadius = '20px'; // Köşeleri yuvarla
            listItem.style.backgroundColor = '#2c3e50'; // Arka plan rengini ayarla
            listItem.style.border = '1px solid #34495e'; // Kenarlık rengini ayarla
            const matchInfo = document.createElement('span');
            const userColor = match.player_one_score > match.player_two_score ? 'green' : 'red';
            const opponentColor = match.player_one_score > match.player_two_score ? 'red' : 'green';
            matchInfo.innerHTML = `<strong style="color: ${match.player_one_score > match.player_two_score ? 'green' : 'red'};">${userId}</strong>: ${match.player_one_score},  -  ${match.player_two_score}, düşman <strong style="color: ${match.player_two_score > match.player_one_score ? 'green' : 'red'};">${match.user_two_name}</strong>`;

            const matchDate = document.createElement('span');
            matchDate.textContent = new Date(match.match_date).toLocaleString();
            matchDate.style.fontSize = '0.8em'; // Yazı boyutunu küçült
            matchDate.style.color = 'white'; // Metin rengini ayarla

            listItem.appendChild(matchInfo);
            listItem.appendChild(matchDate);
            matchHistoryList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching match history:', error);
    }
}

// Sayfa yüklendiğinde maç geçmişini getir
window.onload = fetchMatchHistory;


document.addEventListener('DOMContentLoaded', loadUserInfo);
