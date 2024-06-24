// Enter => addComment() 호출
document.getElementById("comment").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        addComment();
    }
});

// review Add
function addComment() {
    fetch('/get_username', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json()).then(data => {
        var commentInput = document.getElementById("comment");
        var commentText = commentInput.value.trim();

        fetch('/review_update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                review: { 0: data.username, 1: commentText },
                name: document.getElementsByClassName("name")[0].textContent,
            }),
        });

        if (commentText !== "") {
            var commentBody = document.getElementsByClassName("comment-list-wrapper");
            var newComment = document.createElement("div");
            newComment.innerHTML = `
                <div class="comment">
                    <div>
                        <img class="comment-image" src="../img/user.png" alt="">
                    </div>
                    <div class="comment-info">
                        <div class="comment-nickname">${data.username}</div>
                        <div class="comment-text">${commentText}</div>
                    </div>
                </div>
            `;

            commentBody[0].appendChild(newComment);

            commentBody[0].scrollTop = commentBody[0].scrollHeight;
            commentInput.value = "";

            updateCommentCount();
        }   
    });
}

// review Count Update
function updateCommentCount() {
    var commentListWrapper = document.getElementsByClassName("comment-list-wrapper")[0];
    var commentCount = Array.prototype.filter.call(commentListWrapper.children, function (child) {
        return child.tagName.toLowerCase() === 'div';
    }).length;
    var chatCount = document.getElementsByClassName("chat-count")[0];
    chatCount.textContent = "이 음악에는 " + commentCount + "개의 댓글이 있습니다.";
}