async function testFetch() {
    try {
        const url = "https://api-faa.my.id/faa/ai-text2img-pro?prompt=cat";
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
            }
        });
        console.log("Status:", res.status);
    } catch(e) {
        console.error(e);
    }
}
testFetch();
