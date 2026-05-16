async function testFetch() {
    try {
        const url = "https://api-faa.my.id/faa/ai-text2img-pro?prompt=cat";
        console.log("Fetching", url);
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });
        console.log("Status:", res.status);
        const headers = res.headers;
        console.log("Content-Type:", headers.get('content-type'));

        if (headers.get('content-type').includes('application/json')) {
           const json = await res.json();
           console.log("JSON response:", json);
        } else {
           const blob = await res.blob();
           console.log("Blob size:", blob.size);
        }
    } catch(e) {
        console.error(e);
    }
}
testFetch();
