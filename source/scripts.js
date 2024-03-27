function correctPolaroid(img) {
	const width = img.naturalWidth;
	const height = img.naturalHeight;

	if (height > width) {
		console.log("Correcting Polaroid aspect ratio");
		img.style.height = "";
		img.style.width = "100%";
	}
}

let swiper;
function loadGallery() {
	const imageDirectory = "assets/img/gallery";
	const imagePaths = [
		"assets/img/gallery/team-photo_temp.jpg",
		"assets/img/gallery/team-photo_temp copy 2.jpg",
		"assets/img/gallery/team-photo_temp copy 3.jpg",
		"assets/img/gallery/team-photo_temp copy.jpg",
		"assets/img/gallery/team-photo_temp copy 4.jpg",
	];

	const carousel = document.querySelector(".gallery__carousel");
	const imageList = carousel.querySelector(".carousel__slider");

	swiper = new Swiper(".gallery__carousel", {
		// cssMode: true,
		lazy: true,
		rewind: true,
		// spaceBetween: 5,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		pagination: {
			el: ".swiper-pagination",
			type: "bullets",
			clickable: true,
		},
		slidesPerView: 3,
		effect: "coverflow",
		coverflowEffect: {
			rotate: 25,
			depth: 80,
			// scale: 0.8,
		},
		speed: 500,
		centeredSlides: true,
		keyboard: {
			enabled: true,
			onlyInViewport: true,
		},
		autoplay: {
			delay: 3000,
			pauseOnMouseEnter: true,
		},
	});

	// Create a slide element for each image
	const slides = imagePaths.map((imagePath) => {
		const imageCaption = "Placeholder Caption";
		const imageItem = document.createElement("div");
		imageItem.classList.add("slider__slide", "swiper-slide");
		imageItem.innerHTML = `
			<div class="polaroid">
				<div class="polaroid__photo">
					<img src="${imagePath}" alt="Gallery Photo onload="correctPolaroid(this)" />
				</div>
				<div class="polaroid__caption">
					<p>${imageCaption}</p>
				</div>
			</div>
		`;
		return imageItem;
	});
	swiper.appendSlide(slides);
	swiper.appendSlide(slides);
	swiper.update();
}
