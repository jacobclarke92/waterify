// import 'babel-polyfill'
import $ from 'jquery'
import PIXI, { Container, Sprite, BaseTexture, Texture } from 'pixi.js'
import displacementImageUrl from './displacementImage'
import _throttle from 'lodash.throttle'

let animating = false;

const elements = [];
const displacementImage = new Image();
let displacementTexture = null;
displacementImage.onload = function() {
	displacementTexture = new Texture(new BaseTexture(displacementImage));
	init();
}
displacementImage.src = displacementImageUrl;

function init() {
	$(document).ready(function() {
		$('[data-waterify]').each(function() {
			createCanvas(this);
		});
		if(!animating) {
			animating = true;
			animate();
		}
	});
	$(document).on('resize', handleResize);
}

function createCanvas(elem) {

	const $elem = $(elem);
	const width = $elem.width();
	const height = $elem.height();
	const resolution = window.devicePixelRatio || 1;

	const displacementUrl = $elem.data('waterify-displacement-url');
	const maskUrl = $elem.data('waterify-mask-url');
	let displacementImageLoaded = false;
	let maskImageLoaded = false;

	const renderer = new PIXI.autoDetectRenderer(width, height, {resolution, transparent: true});

	const canvas = renderer.view;

	const stage = new Container();
	const imageContainer = new Container();

	let _displacementTexture = displacementTexture;
	let _maskTexture = null;

	const image = new Image();
	image.onload = function() {

		const _imageRef = this;
		const speed = typeof $elem.data('waterify-speed') == 'number' ? $elem.data('waterify-speed') : 1;
		const speedX = typeof $elem.data('waterify-speed-x') == 'number' ? $elem.data('waterify-speed-x') : null;
		const speedY = typeof $elem.data('waterify-speed-y') == 'number' ? $elem.data('waterify-speed-y') : null;
		const startScale = $elem.data('waterify-start-amount') || 0;
		// const displacementScale = $elem.data('waterify-displacement-scale') || 1;

		// _displacementTexture.width *= displacementScale;
		// _displacementTexture.height *= displacementScale;
		// console.log(_displacementTexture);

		const displacementSprite = new Sprite(_displacementTexture, 1);
		const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
		displacementFilter.scale.x = startScale;
		displacementFilter.scale.y = startScale;

		const texture = new Texture(new BaseTexture(this));
		const sprite = new Sprite(texture);
		sprite.width = width;
		sprite.height = height;
		imageContainer.addChild(sprite);

		sprite.filters = [displacementFilter];

		if(maskUrl) {
			const maskSprite = new Sprite(_maskTexture, 1);
			maskSprite.anchor.set(0.5);
			maskSprite.position.set(width/2, height/2);

			// scale mask to fit image
			maskSprite.scale.set(Math.min(
				width / maskSprite.width,
				height / maskSprite.height
			));

			imageContainer.mask = maskSprite;
			imageContainer.addChild(maskSprite);

			// create another image to go underneath masked image
			const underlaySprite = new Sprite(texture);
			underlaySprite.width = width;
			underlaySprite.height = height;
			stage.addChild(underlaySprite);
		}

		stage.addChild(imageContainer);

		const attributes = $elem.prop('attributes');
		$.each(attributes, function() {
			// instead of using image width/height tags on the canvas we use css
			if(this.name == 'width' && parseFloat(this.value) != _imageRef.width) {
				$(canvas).css('width', this.value+'px');
			}else if(this.name == 'height' && parseFloat(this.value) != _imageRef.height) {
				$(canvas).css('height', this.value+'px');
			}else {
				$(canvas).attr(this.name, this.value);
			}
		});

		elements.push({
			original: $elem.clone(),
			canvas,
			renderer, 
			stage,
			sprite,
			width, 
			height,
			displacementFilter,
			displacementSprite,
			ease: $elem.data('waterify-ease') || 100,
			scale: $elem.data('waterify-amount') || 20,
			speedX: speedX || (speedY ? 0 : speed),
			speedY: speedY || (speedX ? 0 : speed),
		});

		$elem.replaceWith(canvas);

	}

	if(maskUrl) {
		const maskImage = new Image();
		maskImage.onload = function() {
			maskImageLoaded = true;
			_maskTexture = new Texture(new BaseTexture(this));
			if(!displacementUrl || (displacementUrl && displacementImageLoaded)) image.src = $elem.attr('src');
		}
		maskImage.src = maskUrl;
	}else{
		if(!displacementUrl || (displacementUrl && displacementImageLoaded)) image.src = $elem.attr('src');
	}

	if(displacementUrl) {
		const _displacementImage = new Image();
		_displacementImage.onload = function() {
			displacementImageLoaded = true;
			_displacementTexture = new Texture(new BaseTexture(this));
			if(!maskUrl || (maskUrl && maskImageLoaded)) image.src = $elem.attr('src');
		}
		_displacementImage.src = displacementUrl;
	}else{
		if(!maskUrl || (maskUrl && maskImageLoaded)) image.src = $elem.attr('src');
	}

}

function animate() {
	for(let element of elements) {
		element.displacementSprite.anchor.x += element.speedX/1000;
		element.displacementSprite.anchor.y += element.speedY/1000;
		element.displacementFilter.scale.x += (element.scale - element.displacementFilter.scale.x)/element.ease;
		element.displacementFilter.scale.y = element.displacementFilter.scale.x;
		element.renderer.render(element.stage);
	}
	if(animating) window.requestAnimationFrame(animate);
}

function _handleResize() {
	for(let element of elements) {
		const width = $(element.canvas).width();
		const height = $(element.canvas).width();
		if(width != element.width || height != element.height) {
			element.renderer.resize(width, height);
			element.width = width;
			element.height = height;
		}
	}
}
const handleResize = _throttle(_handleResize, 1000/60);