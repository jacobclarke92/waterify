import $ from 'jquery'
import PIXI, { Container, Sprite, BaseTexture, Texture } from 'pixi.js'
import displacementImageUrl from './displacementImage'

console.log(PIXI);
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

	const renderer = new PIXI.autoDetectRenderer(width, height, {
		resolution: window.devicePixelRatio || 1,
		transparent: true,
	});

	const canvas = renderer.view;

	const stage = new Container();

	let _displacementTexture = displacementTexture;

	const image = new Image();
	image.onload = function() {

		const speed = $elem.data('waterify-speed') || 1;
		const speedX = $elem.data('waterify-speed-x') || null;
		const speedY = $elem.data('waterify-speed-y') || null;
		const startScale = $elem.data('waterify-start-amount') || 0;
		// const displacementScale = $elem.data('waterify-displacement-scale') || 1;
		
		const attributes = $elem.prop('attributes');
		for(let attribute of attributes) {
			$(canvas).attr(attribute.name, attribute.value);
		}

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
		stage.addChild(sprite);

		sprite.filters = [displacementFilter];


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

	const displacementUrl = $elem.data('waterify-displacement-url');
	if(displacementUrl) {
		const _displacementImage = new Image();
		_displacementImage.onload = function() {
			_displacementTexture = new Texture(new BaseTexture(this));
			image.src = $elem.attr('src');
		}
		_displacementImage.src = displacementUrl;
	}else{
		image.src = $elem.attr('src');
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

function handleResize() {
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