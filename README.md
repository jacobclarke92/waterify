# React WebGL Image Editing

Creates a water-like effect using displacement maps.  
Under the hood I use Pixi.js and jQuery  

I'll publish to an npm module soon.

View demo at [http://waterify.bigfish.tv](http://waterify.bigfish.tv)

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


Canvas matches image size attributes (if provided, e.g. `width="300" height="200"`)  
If image has responsive styles (e.g. `width: 100%; height: auto;`) canvas will resize appropriately on window resize