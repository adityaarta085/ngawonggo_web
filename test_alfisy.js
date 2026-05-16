async function test() {
    const res = await fetch("https://ai.alfisy.my.id/api/txt2img", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "cat", model: "Flux1schnell" })
    });
    const text = await res.text();
    console.log(res.status, text);
}
test();
