document.getElementById('login-btn').addEventListener('click', function () {

    if (this.textContent === '로그아웃') {
        fetch('/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(data => {
            location.reload();
        });
        return;
    }
    else if (this.textContent === '로그인') {
        const loginWindow = window.open('../html/login.html', 'loginWindow', 'width=400,height=580');

        const timer = setInterval(function () {
            if (loginWindow.closed) {
                // 새로고침
                location.reload();
            }
        }, 1000);
    }
});

var elements = document.getElementsByClassName('select-top');

// 각 요소에 대해 이벤트 리스너를 추가합니다.
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', function () {

        // class readme에 있는 h2와 p 태그의 내용을 수정합니다.
        const readme = document.querySelector('.readme');

        if (this.id === 'k-pop') {
            readme.innerHTML = `
            <h2>Korean POP Chart</h2>
            2024.06.01 Days
            <p>월간 차트 : 멜론 음악서비스의 월간 K-POP 순위입니다.<br>
                Monthly Chart : Monthly K-POP ranking of Melon Music Service.<br><br>
                순위는 1위부터 100위까지 제공됩니다.<br>
                Rankings are provided from 1st to 100th.
            </p>`;
        }
        else if (this.id === 'j-pop') {
            readme.innerHTML = `
            <h2>Japanese POP Chart</h2>
            2024.06.01 Days
            <p>월간 차트 : 멜론 음악서비스의 월간 J-POP 순위입니다.<br>
                Monthly Chart : Monthly J-POP ranking of Melon Music Service.<br><br>
                순위는 1위부터 100위까지 제공됩니다.<br>
                Rankings are provided from 1st to 100th.
            </p>`;
        }
        else if (this.id === 'pop') {
            readme.innerHTML = `
            <h2>Global Pop Chart</h2>
            2024.06.01 Days
            <p>월간 차트 : 멜론 음악서비스의 월간 글로벌 팝 순위입니다.<br>
                Monthly Chart : Monthly Global Pop ranking of Melon Music Service.<br><br>
                순위는 1위부터 100위까지 제공됩니다.<br>
                Rankings are provided from 1st to 100th.
            </p>`;
        }

        const genre = this.id;

        fetch('/load_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ genre }),
        }).then(res => res.json()).then(data => {

            for (let i = 1; i <= 5; i++) {
                const imgBox = document.querySelector(`.top-${i} img`);
                if (imgBox) {
                    imgBox.src = data[i]['2'];
                }
            }





            const top100List = document.getElementById('top100-list');
            top100List.innerHTML = '';
            for (let i = 1; i <= Object.keys(data).length; i++) {
                const div = document.createElement('tr');

                // data[i]['0'] : 노래 제목, data[i]['1'] : 가수, data[i]['2'] : 음악 이미지 URL
                div.innerHTML = `
                            <td class="rank">${i}</td>
                            <td><img src="${data[i]['2']}" alt="${data[i]['0']}" class="img_tt"></td>
                            <td><p class="title">${data[i]['0']}</p><br><p class="artist">${data[i]['1']}</p></td>
                            <td><img src="../img/play_circle.png" alt="재생"></td>
                            `;

                div.addEventListener('click', () => {
                    const songInfo = {
                        genre: genre,
                        rank: i
                    };
                    const music_popup = window.open(
                        `../../private/html/music_popup.html?songInfo=${encodeURIComponent(JSON.stringify(songInfo))}`, 'musicPopupWindow', 'width=1100,height=700');
                });
                top100List.appendChild(div);
            }
        });
    });
}

// Logo Click => Redirect to Main Page
document.getElementById("logo").addEventListener("click", function () {
    location.reload();
});


// Form Load => Get K-POP Chart
window.onload = function () {
    fetch('/get_username', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json()).then(data => {
        const loginBtn = document.getElementById('login-btn');
        const userName = document.getElementById('user-name');

        if (data.username) {
            // 사용자가 로그인한 경우
            loginBtn.textContent = '로그아웃';
            userName.textContent = data.username;
        } else {
            // 사용자가 로그아웃한 경우
            loginBtn.textContent = '로그인';
            userName.textContent = '';
        }
    });

    fetch('/load_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre: 'k-pop' }),
    }).then(res => res.json()).then(data => {


        for (let i = 1; i <= 5; i++) {
            const imgBox = document.querySelector(`.top-${i} img`);
            if (imgBox) {
                imgBox.src = data[i]['2'];
            }
        }
        const top100List = document.getElementById('top100-list');
        top100List.innerHTML = '';
        for (let i = 1; i <= Object.keys(data).length; i++) {
            const div = document.createElement('tr');

            // data[i]['0'] : 노래 제목, data[i]['1'] : 가수, data[i]['2'] : 음악 이미지 URL
            div.innerHTML = `
                            <td class="rank">${i}</td>
                            <td><img src="${data[i]['2']}" alt="${data[i]['0']}" class="img_tt"></td>
                            <td><p class="title">${data[i]['0']}</p><br><p class="artist">${data[i]['1']}</p></td>
                            <td><img src="../img/play_circle.png" alt="재생"></td>
                            `;

            div.addEventListener('click', () => {
                const songInfo = {
                    genre: 'k-pop',
                    rank: i
                };
                const music_popup = window.open(`../../private/html/music_popup.html?songInfo=${encodeURIComponent(JSON.stringify(songInfo))}`, 'musicPopupWindow', 'width=1100,height=700');
            });
            top100List.appendChild(div);
        }
    });
};