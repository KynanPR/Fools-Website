function loadHeader() {
	// Manually perform scroll on nav link click to have it be smooth and account for the header
	const header = document.querySelector("header");
	const navLinks = header.querySelectorAll("nav a");

	navLinks.forEach((link) => {
		link.addEventListener("click", handleNavigationClick);
	});

	function handleNavigationClick(event) {
		event.preventDefault();
		const targetSection = event.target.getAttribute("href");
		scrollToSection(targetSection);
	}

	function scrollToSection(targetSection) {
		const navbarHeight = header.offsetHeight;
		const targetElement = document.querySelector(targetSection);
		const targetPosition = targetElement.offsetTop;

		window.scrollTo({
			top: targetPosition - (navbarHeight + 50),
			behavior: "smooth",
		});
	}
}

function stylePolaroid(polaroidImg) {
	const polaroidContainer = polaroidImg.parentElement.parentElement;
	const polaroidCaption = polaroidContainer.querySelector(".polaroid__caption p");

	// Correct image width/height to fit properly
	correctPolaroid(polaroidImg);

	// Rotate caption a random amount
	const rotateAmount = Math.random() * 10 - 5; // Produces a random number (not int) between -5 (inclusive) & 5 (exclusive)
	console.log("rotating polaroid caption");
	polaroidCaption.style.rotate = `${rotateAmount}deg`;
}
function correctPolaroid(img) {
	const width = img.naturalWidth;
	const height = img.naturalHeight;

	if (height > width) {
		console.log("Correcting Polaroid aspect ratio");
		img.style.height = "";
		img.style.width = "100%";
	}
}

let aboutSwiper;
function loadAboutMedia() {
	aboutSwiper = new Swiper("#about-section__cards-swiper", {
		// enabled: false,
		rewind: true,
		grabCursor: true,
		initialSlide: 1,
		effect: "cards",
		cardsEffect: {
			perSlideOffset: 25,
			perSlideRotate: 5,
		},
		speed: 500,
		autoplay: {
			delay: 5000,
			pauseOnMouseEnter: true,
		},
	});
}

let gallerySwiper;
function loadGallery() {
	const imageDirectory = "assets/img/gallery";
	const imagePaths = [
		"assets/img/gallery/team-photo_temp copy 3.jpg",
		"assets/img/gallery/team-photo_temp.jpg",
		"assets/img/gallery/team-photo_temp copy 2.jpg",
		"assets/img/gallery/team-photo_temp copy.jpg",
		"assets/img/gallery/team-photo_temp copy 4.jpg",
	];

	const carousel = document.querySelector(".gallery__carousel");
	const imageList = carousel.querySelector(".carousel__slider");

	gallerySwiper = new Swiper(".gallery__carousel", {
		// enabled: false,
		lazy: true,
		rewind: true,
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
		const imageCaption = imagePath.split("\\").pop().split("/").pop().split(".").splice(0, 1);
		const imageItem = document.createElement("div");
		imageItem.classList.add("slider__slide", "swiper-slide");
		imageItem.innerHTML = `
			<div class="polaroid">
				<div class="polaroid__photo">
					<img src="${imagePath}" alt="Gallery Photo" onload="stylePolaroid(this)"/>
				</div>
				<div class="polaroid__caption">
					<p>${imageCaption}</p>
				</div>
			</div>
		`;
		return imageItem;
	});
	gallerySwiper.appendSlide(slides);
	gallerySwiper.appendSlide(slides);
	gallerySwiper.update();
	imageList.querySelectorAll(".polaroid img").forEach((image) => correctPolaroid(image));
}
