const collection = [
	{ title: 'Shadow Profile', img: './img/img1.jpeg' },
	{ title: 'Crimson Silhouette', img: './img/img2.jpeg' },
	{ title: 'Wavelength', img: './img/img3.jpeg' },
	{ title: 'Noir Figure', img: './img/img4.jpeg' },
	{ title: 'Midnight Gaze', img: './img/img5.jpeg' },
	{ title: 'Cobalt Contrast', img: './img/img6.jpeg' },
	{ title: 'Half-Light', img: './img/img7.jpeg' },
	{ title: 'Scarlet Frame', img: './img/img8.jpeg' },
	{ title: 'Pale Vision', img: './img/img9.jpeg' },
	{ title: 'Spectral Form', img: './img/img10.jpeg' },
	{ title: 'Monochrome Motion', img: './img/img11.jpeg' },
	{ title: 'Platinum Edge', img: './img/img12.jpeg' },
	{ title: 'Electric Shade', img: './img/img13.jpeg' },
	{ title: 'Veiled Light', img: './img/img14.jpeg' },
	{ title: 'Luminous Dark', img: './img/img15.jpeg' },
	{ title: 'Haze Portrait', img: './img/img16.jpeg' },
	{ title: 'Glowing Contour', img: './img/img17.jpeg' },
	{ title: 'Dark Elegance', img: './img/img18.jpeg' },
	{ title: 'Ruby Accent', img: './img/img19.jpeg' },
	{ title: 'Clear Gaze', img: './img/img20.jpeg' },
]

document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(SplitText)

	const gallery = document.querySelector('.gallery')
	const galleryContainer = document.querySelector('.gallery-container')
	const titleContainer = document.querySelector('.title-container')

	const cards = []
	const transformState = []

	let currentTitle = null
	let isPreviewActive = false
	let isTransitioning = false

	const config = {
		imageCount: 25,
		radius: 275,
		sensitivity: 500,
		effectFalloff: 250,
		cardMoveAmount: 50,
		lerpFactor: 0.15,
		isMobile: window.innerWidth < 1000,
	}

	const parallaxState = {
		targetX: 0,
		targetY: 0,
		targetZ: 0,
		currentX: 0,
		currentY: 0,
		currentZ: 0,
	}

	for (let i = 0; i < config.imageCount; i++) {
		const angle = (i / config.imageCount) * Math.PI * 2
		const x = config.radius * Math.cos(angle)
		const y = config.radius * Math.sin(angle)
		const cardIndex = i % 20

		const card = document.createElement('div')
		card.className = 'card'
		card.dataset.index = i
		card.dataset.title = collection[cardIndex].title

		const img = document.createElement('img')
		img.src = collection[cardIndex].img
		card.appendChild(img)

		gsap.set(card, {
			x,
			y,
			rotation: (angle * 180) / Math.PI + 90,
			transformPerspective: 800,
			transformOrigin: 'center center',
		})

		gallery.appendChild(card)
		cards.push(card)
		transformState.push({
			currentRotation: 0,
			targetRotation: 0,
			currentX: 0,
			targetX: 0,
			currentY: 0,
			targetY: 0,
			currentScale: 1,
			targetScale: 1,
			angle,
		})

		card.addEventListener('click', e => {
			if (!isPreviewActive && !isTransitioning) {
				togglePreview(parseInt(card.dataset.index))
				e.stopPropagation()
			}
		})
	}

	function togglePreview(index) {
		isPreviewActive = true
		isTransitioning = true

		const angle = transformState[index].angle
		const targetPosition = (Math.PI * 3) / 2
		let rotationRadians = targetPosition - angle

		if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2
		else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2

		transformState.forEach(state => {
			state.currentRotation = state.targetRotation = 0
			state.currentScale = state.targetScale = 1
			state.currentX = state.targetX = state.currentY = state.targetY = 0
		})

		gsap.to(gallery, {
			onStart: () => {
				cards.forEach((card, i) => {
					gsap.to(card, {
						x: config.radius * Math.cos(transformState[i].angle),
						y: config.radius * Math.sin(transformState[i].angle),
						rotationY: 0,
						scale: 1,
						duration: 1.25,
						ease: 'power4.out',
					})
				})
			},
			scale: 5,
			y: 1300,
			rotation: (rotationRadians * 180) / Math.PI + 360,
			duration: 2,
			ease: 'power4.inOut',
			onComplete: () => (isTransitioning = false),
		})

		gsap.to(parallaxState, {
			currentX: 0,
			currentY: 0,
			currentZ: 0,
			duration: 0.5,
			ease: 'power2.out',
			onUpdate: () => {
				gsap.set(galleryContainer, {
					rotateX: parallaxState.currentX,
					rotateY: parallaxState.currentY,
					rotation: parallaxState.currentZ,
					transformOrigin: 'center center',
				})
			},
		})

		const titleText = cards[index].dataset.title
		const p = document.createElement('p')
		p.textContent = titleText
		titleContainer.appendChild(p)
		currentTitle = p

		const splitText = new SplitText(p, {
			type: 'words',
			wordsClass: 'word',
		})
		const words = splitText.words

		gsap.set(words, { y: '125%' })
		gsap.to(words, {
			y: '0%',
			duration: 0.75,
			delay: 1.25,
			stagger: 0.1,
			ease: 'power4.out',
		})
	}

	function resetGallery() {
		if (isTransitioning) return

		isTransitioning = true

		if (currentTitle) {
			const words = currentTitle.querySelectorAll('.word')
			gsap.to(words, {
				y: '-125%',
				duration: 0.75,
				delay: 0.5,
				stagger: 0.1,
				ease: 'power4.out',
				onComplete: () => {
					currentTitle.remove()
					currentTitle = null
				},
			})
		}

		const viewportWidth = window.innerWidth
		let galleryScale = 1

		if (viewportWidth < 768) {
			galleryScale = 0.6
		} else if (viewportWidth < 1200) {
			galleryScale = 0.8
		}

		gsap.to(gallery, {
			scale: galleryScale,
			y: 0,
			x: 0,
			rotation: 0,
			duration: 2.5,
			ease: 'power4.inOut',
			onComplete: () => {
				isPreviewActive = isTransitioning = false
				Object.assign(parallaxState, {
					targetX: 0,
					targetY: 0,
					targetZ: 0,
					currentX: 0,
					currentY: 0,
					currentZ: 0,
				})
			},
		})
	}

	function handleResize() {
		const viewportWidth = window.innerWidth
		config.isMobile = viewportWidth < 1000

		let galleryScale = 1

		if (viewportWidth < 768) {
			galleryScale = 0.6
		} else if (viewportWidth < 1200) {
			galleryScale = 0.8
		}

		gsap.set(gallery, {
			scale: galleryScale,
		})

		if (!isPreviewActive) {
			parallaxState.targetX = 0
			parallaxState.targetY = 0
			parallaxState.targetZ = 0
			parallaxState.currentX = 0
			parallaxState.currentY = 0
			parallaxState.currentZ = 0

			transformState.forEach(state => {
				state.targetRotation = 0
				state.currentRotation = 0
				state.targetScale = 1
				state.currentScale = 1
				state.targetX = 0
				state.currentX = 0
				state.targetY = 0
				state.currentY = 0
			})
		}
	}

	window.addEventListener('resize', handleResize)
	handleResize()

	document.addEventListener('click', () => {
		if (isPreviewActive && !isTransitioning) resetGallery()
	})

	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && isPreviewActive && !isTransitioning)
			resetGallery()
	})

	document.addEventListener('mousemove', e => {
		if (isPreviewActive || isTransitioning || config.isMobile) return

		const centerX = window.innerWidth / 2
		const centerY = window.innerHeight / 2
		const percentX = (e.clientX - centerX) / centerX
		const percentY = (e.clientY - centerY) / centerY

		parallaxState.targetY = percentX * 15
		parallaxState.targetX = -percentY * 15
		parallaxState.targetZ = (percentX + percentY) * 5

		cards.forEach((card, index) => {
			const rect = card.getBoundingClientRect()
			const dx = e.clientX - (rect.left + rect.width / 2)
			const dy = e.clientY - (rect.top + rect.height / 2)
			const distance = Math.sqrt(dx * dx + dy * dy)

			if (distance < config.sensitivity && !config.isMobile) {
				const flipFactor = Math.max(0, 1 - distance / config.effectFalloff)
				const angle = transformState[index].angle
				const moveAmount = config.cardMoveAmount * flipFactor

				transformState[index].targetRotation = 180 * flipFactor
				transformState[index].targetScale = 1 + 0.3 * flipFactor
				transformState[index].targetX = moveAmount * Math.cos(angle)
				transformState[index].targetY = moveAmount * Math.sin(angle)
			} else {
				transformState[index].targetRotation = 0
				transformState[index].targetScale = 1
				transformState[index].targetX = 0
				transformState[index].targetY = 0
			}
		})
	})

	document.addEventListener('mouseout', e => {
		if (
			(e.relatedTarget === null || e.relatedTarget.nodeName === 'HTML') &&
			!isPreviewActive &&
			!isTransitioning
		) {
			transformState.forEach(state => {
				state.targetRotation = 0
				state.targetScale = 1
				state.targetX = 0
				state.targetY = 0
			})
			parallaxState.targetX = 0
			parallaxState.targetY = 0
			parallaxState.targetZ = 0
		}
	})

	function animate() {
		if (!isPreviewActive && !isTransitioning) {
			parallaxState.currentX +=
				(parallaxState.targetX - parallaxState.currentX) * config.lerpFactor
			parallaxState.currentY +=
				(parallaxState.targetY - parallaxState.currentY) * config.lerpFactor
			parallaxState.currentZ +=
				(parallaxState.targetZ - parallaxState.currentZ) * config.lerpFactor

			gsap.set(galleryContainer, {
				rotateX: parallaxState.currentX,
				rotateY: parallaxState.currentY,
				rotation: parallaxState.currentZ,
				transformOrigin: 'center center',
			})

			cards.forEach((card, index) => {
				const state = transformState[index]

				state.currentRotation +=
					(state.targetRotation - state.currentRotation) * config.lerpFactor
				state.currentScale +=
					(state.targetScale - state.currentScale) * config.lerpFactor
				state.currentX += (state.targetX - state.currentX) * config.lerpFactor
				state.currentY += (state.targetY - state.currentY) * config.lerpFactor

				const angle = state.angle
				const x = config.radius * Math.cos(angle)
				const y = config.radius * Math.sin(angle)

				gsap.set(card, {
					x: x + state.currentX,
					y: y + state.currentY,
					rotationY: state.currentRotation,
					scale: state.currentScale,
					rotation: (angle * 180) / Math.PI + 90,
					transformOrigin: 'center center',
					transformPerspective: 1000,
				})
			})
		}
		requestAnimationFrame(animate)
	}

	animate()
})
