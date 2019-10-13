
# Floor Plan Feature - Sample

## Demo
Checkout below URL on CodePen:
[https://codepen.io/ysuthar/pen/MWWKEGy](https://codepen.io/ysuthar/pen/MWWKEGy)
 
## Description
Hi! This is a sample code for the Floor Plan interaction with below features:
1.  **HTML5, CSS3 & SVG** based Floor Plan Sample.
2. **OnMouseOver**, It captures the meta data like Name, Dimensions, Positions of all the chairs, Tables, Sofa, etc.
3.  **OnReload**, it loads the floor plan based on previously configured state like zoom, pan, etc. through saved cookies in **local storage**.
4.  **Support** for the Touch Screen and Handheld Devices

## Plugins
1. jQuery-1.12.1 - [https://code.jquery.com/jquery/](https://code.jquery.com/jquery/)
2. SVG Pan Zoom - [https://github.com/ariutta/svg-pan-zoom](https://github.com/ariutta/svg-pan-zoom)
3. Hammer.js - [http://hammerjs.github.io/](http://hammerjs.github.io/)

## Code Details
1. SVG Pan Zoom Plugin has been initialized on SVG with id "*floorMap*".
2. For getting the Meta data of the element on the Hover, Touch & Click interaction, I have used class "TrackElem" in the SVG Object.
3. Meta information has been shown in the div with id "*MetaInfo*"
4. In the Meta information, name of the element has been captured from the '*data-name*" attribute of each element in SVG.
5. The used sample SVG has been made in the Adobe XD. During the run time, measurement has been scaled from CM to Feet & Inches through the fucntion "*ChangeScale*" in the "*main.js*" file.

**Note**
```
Localstorage will work when the page is hosted on server or localhost.
```

## Contact Me
- Email - ysuthar.web@gmail.com
- GitHub - https://github.com/ysuthar 
- StackBlitz - https://stackblitz.com/@ysuthar 
- CodePen - https://codepen.io/ysuthar 
- LinkedIn - www.linkedin.com/in/ysuthar
- Skype - y.suthar