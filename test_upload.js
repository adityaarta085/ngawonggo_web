async function test() {
    const fs = require('fs');
    const path = require('path');

    // Create a dummy image file
    fs.writeFileSync('dummy.jpg', 'fake image data');
    const blob = new Blob(['fake image data'], { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', blob, 'dummy.jpg');

    const key = "AIzaBj7z2z3xBjsk";
    const uploadResponse = await fetch(`https://c.termai.cc/api/upload?key=${key}`, {
        method: 'POST',
        body: formData,
    });
    console.log(uploadResponse.status);
    const data = await uploadResponse.json();
    console.log(data);
}
test();
