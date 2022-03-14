function handlePaste() {
    const copyText = document.getElementById("paste-content").innerText;
    console.log(copyText)
    navigator.clipboard.writeText(copyText).then(() => {
        document.getElementById("clipboard-button").innerText = "Copied!";
    })
    document.querySelector(".pre").addEventListener("click", () => {
        navigator.clipboard.writeText(copyText).then(r => {});
    });
}