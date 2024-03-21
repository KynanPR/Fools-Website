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
		this.readyToMove = true;
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
		this.prevBtn.addEventListener("click", () => this.scroll(), { once: true });
		this.nextBtn.addEventListener("click", () => this.moveNext());

		// setInterval(() => {
		// 	this.moveNext();
		// }, 6000);
	}

	// Internally update the positions of the slide
	async updateSlidePositions(moveDirection) {
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
				case 1:
					return (position + 1) % slideCount;
			}
		});

		// Update positionedSlides
		let waiting = new Promise((resolve) => {
			updatedPositions.forEach((newPosition, index) => {
				this.positionedSlides[index].setPosition(newPosition);
			});

			let slidesCompleted = 0;
			let slideCount = this.positionedSlides.length;
			function checkCompleted() {
				return slidesCompleted === slideCount;
			}
			const currentCarousel = this;
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
				positionedSlide.slide.addEventListener(
					"transitionend",
					(event) => {
						positionedSlide.slide.classList.remove(transitionClassName);
						positionedSlide.setOrder();
						slidesCompleted++;
						checkCompleted() ? resolve() : null;
					},
					{ once: true }
				);
			});
		});
		return waiting.then(() => {
			return new Promise((resolve) => resolve());
		});
	}

	async scroll() {
		while (true) {
			await this.updateSlidePositions(-1);
			await new Promise((resolve) => setTimeout(resolve, 1)); // Short delay to ensure animation finishes
		}
		console.log("Fully scrolled");
	}

	// async scroll() {
	// 	await this.moveNext().then(() => {
	// 		return this.moveNext();
	// 	});
	// 	console.log("Fully scrolled");
	// }

	// async scroll() {
	// 	await this.moveNext();
	// 	this.scroll();
	// }

	async moveNext() {
		await this.updateSlidePositions(-1);
		console.log("fully moved");
	}

	movePrev() {
		this.updateSlidePositions(1);
	}

	zoomPhoto() {
		console.log("zooming photo");
		this.classList.toggle("slide__current--clicked");
	}
}

let galleryCarousel;

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
	const imageList = carousel.querySelector(".carousel__slides");
	// Make the slideList as wide as it needs to be based on the number of slides and the width of those slides as specificed in the CSS
	const imageWidth = getComputedStyle(imageList, "before")
		.content.replaceAll('"', "")
		.replace("vw", "");
	const listWidth = imagePaths.length * imageWidth;
	imageList.style.width = `${listWidth}vw`;

	// Create a slide element for each image
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

	//Create a Carousel object that will control the slideshow
	galleryCarousel = new Carousel(
		carousel,
		imageList,
		carousel.querySelector(".carousel__prev"),
		carousel.querySelector(".carousel__next")
	);
}
async function scrolling() {
	await galleryCarousel.moveNext();
	console.log("moved once");
	await galleryCarousel.moveNext();
	console.log("moved twince");
}
