function correctPolaroid(img) {
	const width = img.naturalWidth;
	const height = img.naturalHeight;

	if (height > width) {
		console.log("Correcting Polaroid aspect ratio");
		img.style.height = "";
		img.style.width = "100%";
	}
}

class PositionedSlide {
	constructor(slide, position) {
		this.slide = slide;
		this.position = position;
	}
	getSlide() {
		return this.slide;
	}
	getPosition() {
		return this.position;
	}
	setPosition(newPosition) {
		this.position = newPosition;
	}
	setOrder() {
		// Update the flex order property on the slide
		this.slide.style.order = this.position;
	}
}

class Carousel {
	// Only works for gallerys with at least 5 photos
	constructor(carousel, slideList, prevBtn, nextBtn) {
		this.carousel = carousel;
		this.slideList = slideList;
		this.slides = Array.from(this.slideList.children);
		this.positionedSlides = this.slides.map((slide, index) => {
			return new PositionedSlide(slide, index);
		});
		this.prevBtn = prevBtn;
		this.nextBtn = nextBtn;

		// this.currentSlideIndex = 0;
		// this.leftStagedSlide = this.slides.at(-2);
		// this.prevSlide = this.slides.at(-1);
		// this.currentSlide = this.slides.at(0);
		// this.nextSlide = this.slides.at(1);
		// this.rightStagedSlide = this.slides.at(2);

		// this.leftStagedSlide.classList.add("slide__staged-left");
		// this.prevSlide.classList.add("slide__prev");
		// this.currentSlide.classList.add("slide__current");
		// this.nextSlide.classList.add("slide__next");
		// this.rightStagedSlide.classList.add("slide__staged-right");

		// this.currentSlide.addEventListener("click", this.zoomPhoto);
		this.prevBtn.addEventListener("click", () => {
			this.updateSlidePositions(-1);
		});
		this.nextBtn.addEventListener("click", () => this.updateSlidePositions(1));

		// setInterval(() => {
		//     this.nextBtn.click();
		// }, 5000);
	}

	// Internally update the positions of the slide
	updateSlidePositions(moveDirection) {
		// Get the current positions of the slides
		const startPositions = this.positionedSlides.map((positionedSlide) => {
			return positionedSlide.getPosition();
		});
		const slideCount = startPositions.length;

		// Move all the slides one position to the "left" by decrementing all positions by 1 - accounting for wrapping
		const updatedPositions = startPositions.map((position) => {
			// Use remainders to wrap first slide round to the end
			switch (moveDirection) {
				case -1:
					return (position + slideCount - 1) % slideCount; // (x + mod - 1) % mod is essentially (x - 1) % mod but wraps at 0 rather than being -1
					break;
				case 1:
					return (position + 1) % slideCount;
					break;
			}
		});

		// Update positionedSlides
		updatedPositions.forEach((newPosition, index) => {
			this.positionedSlides[index].setPosition(newPosition);
		});

		this.positionedSlides.forEach((positionedSlide) => {
			let transitionClassName;
			switch (moveDirection) {
				case -1:
					transitionClassName = "in-transition--left";
					break;
				case 1:
					transitionClassName = "in-transition--right";
			}
			positionedSlide.slide.classList.add(transitionClassName);
			positionedSlide.slide.addEventListener("transitionend", (event) => {
				positionedSlide.slide.classList.remove(transitionClassName);
				positionedSlide.setOrder();
			});
		});

		// this.setOrder();
	}

	// Push current state to DOM
	setOrder() {
		this.positionedSlides.forEach((positionedSlide) => {
			positionedSlide.setOrder();
		});
	}

	// updateSlidePosition(moveDirection) {
	// 	let newSlideIndex = this.currentSlideIndex + moveDirection;

	// 	// Check and account for wrap
	// 	if (newSlideIndex >= this.slides.length) {
	// 		// Forwards wrap
	// 		newSlideIndex = 0;
	// 	} else if (newSlideIndex < 0) {
	// 		// Backwards wrap
	// 		newSlideIndex = this.slides.length - 1;
	// 	}

	// 	console.log("Moving Slide", moveDirection);
	// 	// Update new found slides
	// 	this.updateSlides(newSlideIndex);
	// 	// this.slideList.style.transform = `translateX(-${newSlideIndex * 100}%)`;
	// }

	// updateSlides(newSlideIndex) {
	// 	console.log(this.currentSlide);
	// 	this.currentSlide.removeEventListener("click", this.zoomPhoto);

	// 	// Remove classes from old slides
	// 	this.leftStagedSlide.classList.remove("slide__staged-left");
	// 	this.prevSlide.classList.remove("slide__prev");
	// 	this.currentSlide.classList.remove("slide__current", "slide__current--clicked");
	// 	this.nextSlide.classList.remove("slide__next");
	// 	this.rightStagedSlide.classList.remove("slide__staged-right");

	// 	// Update slides
	// 	this.currentSlideIndex = newSlideIndex;
	// 	this.currentSlide = this.slides.at(this.currentSlideIndex);
	// 	// Don't need to check for prev slides wrapping because .at() will handle negative indexes
	// 	this.prevSlide = this.slides.at(this.currentSlideIndex - 1);
	// 	this.leftStagedSlide = this.slides.at(this.currentSlideIndex - 2);
	// 	// Account for next slides wrapping
	// 	switch (this.currentSlideIndex) {
	// 		case this.slides.length - 2: // Staged slide will wrap
	// 			this.nextSlide = this.slides.at(this.currentSlideIndex + 1);
	// 			this.rightStagedSlide = this.slides.at(0);
	// 			break;
	// 		case this.slides.length - 1: // Staged and next slide will wrap
	// 			this.nextSlide = this.slides.at(0);
	// 			this.rightStagedSlide = this.slides.at(1);
	// 			break;
	// 		default: // Neither wrap
	// 			this.nextSlide = this.slides.at(this.currentSlideIndex + 1);
	// 			this.rightStagedSlide = this.slides.at(this.currentSlideIndex + 2);
	// 	}

	// 	// Add classes to updated slides
	// 	this.leftStagedSlide.classList.add("slide__staged-left");
	// 	this.prevSlide.classList.add("slide__prev");
	// 	this.currentSlide.classList.add("slide__current");
	// 	this.nextSlide.classList.add("slide__next");
	// 	this.rightStagedSlide.classList.add("slide__staged-right");

	// 	// Add event listener to current slide to allow zooming
	// 	this.currentSlide.addEventListener("click", this.zoomPhoto);
	// }

	zoomPhoto() {
		console.log("zooming photo");
		this.classList.toggle("slide__current--clicked");
	}
}

function loadGallery() {
	const imageDirectory = "assets/img/gallery";
	const imagePaths = [
		"assets/img/gallery/team-photo_temp.jpg",
		"assets/img/gallery/team-photo_temp copy 2.jpg",
		"assets/img/gallery/team-photo_temp copy 3.jpg",
		"assets/img/gallery/team-photo_temp copy.jpg",
		"assets/img/gallery/team-photo_temp copy 4.jpg",
	];
	const imageList = document.querySelector(".carousel__slides");

	imagePaths.forEach((imagePath) => {
		const imageCaption = "Placeholder Caption";
		const imageItem = document.createElement("li");
		imageItem.classList.add("slides__slide");
		imageItem.innerHTML = `
			<div class="polaroid">
				<div class="polaroid__photo">
					<img src="${imagePath}" alt="Gallery Photo" />
				</div>
				<div class="polaroid__caption">
					<p>${imageCaption}</p>
				</div>
			</div>
		`;
		imageList.appendChild(imageItem);
	});

	let carousel = document.querySelector(".gallery__carousel");
	var galleryCarousel = new Carousel(
		document.querySelector(".gallery__carousel"),
		carousel.querySelector(".carousel__slides"),
		carousel.querySelector(".carousel__prev"),
		carousel.querySelector(".carousel__next")
	);
}
