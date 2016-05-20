# Waterify - Image Displacement Demo

Creates a water-like effect using displacement maps.  
Under the hood I use Pixi.js and jQuery (peer dependencies)

View demo at [http://waterify.bigfish.tv](http://waterify.bigfish.tv)


`npm i --save waterify pixi.js jquery`

Or if you want a plug'n'play just grab from dist (333kb)


Implementation is straightforward:

```html
<img src="demo/test1.jpg" class="circle" 
	data-waterify 
	data-waterify-speed-x="0.5" 
	data-waterify-speed-y="5" 
	data-waterify-amount="10" 
	data-waterify-start="300" 
	data-waterify-ease="1000"
	data-waterify-mask-url="mask.png"
	data-waterify-displacement-url="displacement_map.jpg" />
```

A note on the speeds:  
There is one more data tag `data-waterify-speed` which applies to both x and y.  
Also if you provide an x speed and no y speed then y will be presumed as 0, and vice versa.

Is optimised for HiDPI screens!  
Canvas matches image size attributes (if provided, e.g. `width="300" height="200"`)  
If image has responsive styles (e.g. `width: 100%; height: auto;`) canvas will resize appropriately on window resize.



### Future plan
I want to ditch the use of Pixi in favour of native WebGL code as I don't really need a bloated library.
That said Pixi makes things like layering and masking extremely easy. 

Considering that this is an alternative for bloated video files I think 0.33mb is reasonable.