import { set_User, pw_Check } from "./code_hashing.js";
let message = document.querySelector(".message");

// 클래스 제거
function resetClass(element, classname) {
    element.classList.remove(classname);
}

// 회원가입 버튼 클릭 시
document.getElementsByClassName("show-signup")[0].addEventListener("click", function () {
    let form = document.getElementsByClassName("form")[0];
    resetClass(form, "signin");
    form.classList.add("signup");
    document.getElementById("submit-btn").innerText = "회원 가입";
});

// 로그인 버튼 클릭 시
document.getElementsByClassName("show-signin")[0].addEventListener("click", function () {
    let form = document.getElementsByClassName("form")[0];
    resetClass(form, "signup");
    form.classList.add("signin");
    document.getElementById("submit-btn").innerText = "로그인";
});

// 페이지 로딩 시 로그인 폼으로 설정
window.onload = function () {
    let form = document.getElementsByClassName("form")[0];
    resetClass(form, "signup");
    form.classList.add("signin");
    document.getElementById("submit-btn").innerText = "로그인";
}

// 엔터키로 로그인
document.getElementById("password").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        let form = document.getElementsByClassName("form")[0];
        if (form.classList.contains("signin")) {
            document.getElementById("submit-btn").click();
        }
    }
});

// 엔터키로 회원가입
document.getElementById("password2").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        let form = document.getElementsByClassName("form")[0];
        if (form.classList.contains("signup")) {
            document.getElementById("submit-btn").click();
        }
    }
});




// 로그인, 회원가입 버튼 클릭 시
document.getElementById("submit-btn").addEventListener("click", function () {
    let form = document.getElementsByClassName("form")[0];
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;
    let name = document.getElementById("name").value;

    let data;

    if (form.classList.contains("signup")) {
        if (password !== password2) {
            message.innerText = "비밀번호가 일치하지 않습니다.";
            return;
        }

        if (email === "" || password === "" || name === "") {
            message.innerText = "모든 항목을 입력해주세요.";
            return;
        }

        let passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,20}$/;
        if (!passwordRegExp.test(password)) {
            message.innerText = "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상 20자 이하로 입력해주세요.";
            return;
        }

        data = {
            email: email,
            password: password,
            name: name,
            salt: ""
        };

        data = set_User(data);

        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data.result === "success") {
                message.innerText = data.message;
                window.close();
            }
            else if (data.result === "signup") {
                message.innerText = data.message;

                let form = document.getElementsByClassName("form")[0];
                resetClass(form, "signup");
                form.classList.add("signin");
                document.getElementById("submit-btn").innerText = "로그인";
            }
            else {
                message.innerText = data.message;
            }
        });
    }

    if (form.classList.contains("signin")) {
        if (email === "") {
            message.innerText = "이메일을 입력해주세요.";
            return;
        }

        if (password === "") {
            message.innerText = "비밀번호를 입력해주세요.";
            return;
        }

        // fetch로 salt값을 받아오는 코드
        fetch("/get_salt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        }).then(function (response) {
            return response.json();
        }).then(function (datas) {
            if (datas.salt) {
                data = {
                    email: email,
                    password: pw_Check(password, datas.salt)
                };

                let url = "/user_login";
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    if (data.result === "success") {
                        message.innerText = data.message;
                        window.close();
                    }
                    else {
                        message.innerText = data.message;
                    }
                });
            }
            else {
                message.innerText = "존재하지 않는 이메일입니다.";
            }
        });
    }
});