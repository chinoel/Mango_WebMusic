// login.js
import express, { response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/music_youtube_get_url', (req, res) => {

    let link = 'https://www.youtube.com/results?search_query=' + req.body.id;

    axios.get(link)
        .then(response => {
            let data = response.data;
            let index = data.indexOf('videoId":"') + 10;

            const regex = /videoId":"([^"]*)"/g;
            let videoId;
            let match;
            let count = 0;
            let result = [];

            while ((match = regex.exec(data)) !== null) {
                videoId = match[1];
                
                count++;
                if (count == 6) {
                    result[0] = videoId;
                }
                if (count >= 11) {
                    result[1] = videoId;
                    break;
                }
            }

            res.json(result);
        })
        .catch(error => {
            console.log(error);
        });



    // 일일 100회 한도로 기능 변경 <- 특성상 youtube api 사용 불가능

    /*
    var api = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + req.body.id + "&type=video&key="

    // api를 이용해서 검색 결과를 받아옴
    axios.get(api)
        .then(function (response) {
            // 검색 결과를 전달
            res.json(response.data.items[0].id.videoId);
        })
        .catch(function (error) {
            console.log(error);
        });

        */
})

export default router;