import axios from 'axios';

async function run() {
    try {
        const response = await axios.get('https://api.jikan.moe/v4/anime/1');
        console.log(response.data);
    } catch (e) {
        console.error(e);
    }
}
run();
