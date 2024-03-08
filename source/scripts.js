function correctPolaroid(img) {
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    if (height > width) {
        console.log("Correcting Polaroid aspect ratio");
        img.style.height = "";
        img.style.width = "100%";
    }
}