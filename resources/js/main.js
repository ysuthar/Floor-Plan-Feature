var i,
  targetElem = document.getElementsByClassName('TrackElem'),
  ChangeScale;

/* Scripting for ustom Interaction Starts */
for (i = 0; i < targetElem.length; i++) {
  /* Element Mouseover Event */
  targetElem[i].onmouseover = function displayDetails(evt) {
    var ElemDimension = this.getBoundingClientRect(); // get the bounding rectangle
    var CheckTransform = this.hasAttribute('transform'); // Check if Element Has Transform Attribute
    var ElemRotation = (CheckTransform ? this.getAttribute('transform').includes('rotate') : ''); // Check Element Rotation

    /* Meta Info Starts */
    document.getElementById('MetaInfo').style.display = "block"
    document.getElementById('MetaInfo').innerHTML =
      "<strong>" + this.getAttribute('data-name') +
      "</strong><br> Dimensions: " +
      (ElemRotation ? ChangeScale(ElemDimension.height) : ChangeScale(ElemDimension.width)) +
      " x " +
      (ElemRotation ? ChangeScale(ElemDimension.width) : ChangeScale(ElemDimension.height)) +
      "<br> Top: " + Math.floor(ElemDimension.top) + "<br> Left: " + Math.floor(ElemDimension.left)
    /* Meta Info Ends */
  }

  /* Element Mouseout Event */
  targetElem[i].onmouseout = function hideDetails() {
    document.getElementById('MetaInfo').style.display = "none"
  }

  /* Element Click Event */
  targetElem[i].onclick = function zoomTo(evt) {
    var ElemPos = this.getBoundingClientRect(); // get the bounding rectangle;
    var viewPort = document.getElementsByClassName("svg-pan-zoom_viewport")[0]; // Viewport for animation
    var ScreenPos = (screen.width - document.getElementById("OfficeLayout").getBoundingClientRect().width) // get blank value if viewport is greater than the floor plan width

    /* Positioning for Mobiles / Handheld devices */
    if (typeof window.orientation !== 'undefined') {
      var props = this.getBoundingClientRect();
      var obj = {};
      for (var prop in props) {
        obj[prop] = props[prop]
      };

      viewPort.style.transition = "all " + 100 / 1000 + "s ease";
      if (panZoomInstance.getZoom() != 1) {
        panZoomInstance.panBy({
          x: obj.width / 2 - (obj.left),
          y: obj.height - (obj.top / 2)
        }, 700);
      } else {
        panZoomInstance.zoomBy(2);
        panZoomInstance.pan({
          x: obj.width / 2 - (obj.left * 2),
          y: obj.height - (obj.top / 2)
        });
      }
    }
    /* Positioning for Desktop PC */
    else {
      viewPort.style.transition = "all " + 300 / 1000 + "s ease";
      /* Check if already in Zoom state */
      if (panZoomInstance.getZoom() != 1) {
        if (ElemPos.height < window.innerHeight) {
          panZoomInstance.panBy({
            x: -(ElemPos.left + ElemPos.width / 2 - (screen.width / 2)),
            y: -(ElemPos.top + ElemPos.height / 2 - (window.innerHeight / 2))
          });
        } else {
          panZoomInstance.panBy({
            x: 50 - (ElemPos.left),
            y: 50 - (ElemPos.top)
          });
        }
      } else {
        /* If not in Zoom state */
        panZoomInstance.zoomBy(2);
        if (ElemPos.height < window.innerHeight) {
          panZoomInstance.pan({
            x: -(ElemPos.left * 2 - ScreenPos + ElemPos.width - (screen.width / 2)),
            y: -(ElemPos.top * 2 + ElemPos.height - (window.innerHeight / 2))
          });
        } else {
          panZoomInstance.pan({
            x: 50 - (ElemPos.left * 2 - ScreenPos),
            y: 50 - (ElemPos.top * 2)
          });
        }
      }
    }
  }
}

/* Change Scale*/
ChangeScale  = function (val) {
  var CurrentZoom = panZoomInstance.getZoom();
  var realFeet = ((val * 0.393700) / 12) / CurrentZoom;
  var feet = Math.floor(realFeet);
  var inches = Math.round((realFeet - feet) * 12);
  return Math.floor(feet) + "'" + Math.floor(inches) + '\"';
}
/* Scripting for ustom Interaction Ends */

$(function () {
  /* SVG Pan Zoom Function */
  panZoomInstance = svgPanZoom('#floorMap', {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    minZoom: 1,
    beforePan: beforePan,
    customEventsHandler: {
      // Halt all touch events
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
      init: function (options) {
        var instance = options.instance,
          initialScale = 1,
          pannedX = 0,
          pannedY = 0

        // Init Hammer
        // Listen only for pointer and touch events
        this.hammer = Hammer(options.svgElement, {
          inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
        })

        // Enable pinch
        this.hammer.get('pinch').set({
          enable: true
        })

        // Handle double tap
        this.hammer.on('doubletap', function (ev) {
          instance.zoomIn()
        })

        // Handle pan
        this.hammer.on('panstart panmove', function (ev) {
          // On pan start reset panned variables
          if (ev.type === 'panstart') {
            pannedX = 0
            pannedY = 0
          }

          // Pan only the difference
          instance.panBy({
            x: ev.deltaX - pannedX,
            y: ev.deltaY - pannedY
          })
          pannedX = ev.deltaX
          pannedY = ev.deltaY
        })

        // Handle pinch
        this.hammer.on('pinchstart pinchmove', function (ev) {
          // On pinch start remember initial zoom
          if (ev.type === 'pinchstart') {
            initialScale = instance.getZoom()
            instance.zoomAtPoint(initialScale * ev.scale, {
              x: ev.center.x,
              y: ev.center.y
            })
          }
          instance.zoomAtPoint(initialScale * ev.scale, {
            x: ev.center.x,
            y: ev.center.y
          })
        })

        // Prevent moving the page on some devices when panning over SVG
        options.svgElement.addEventListener('touchmove', function (e) {
          e.preventDefault();
        });
      },
      destroy: function () {
        this.hammer.destroy()
      }
    },
    onZoom: function () {
      saveSettings(panZoomInstance);
    },
    onPan: function () {
      saveSettings(panZoomInstance)
    }
  });

  /* SVG Pan Zoom Settings */
  var settings = loadSettings();
  if (settings) {
    panZoomInstance.zoom(settings.zoom);
    panZoomInstance.pan(settings.pan);
  }
})

/* Restrict Pan to remain element in viewport */
var beforePan;
beforePan = function (oldPan, newPan) {
  var stopHorizontal = false,
    stopVertical = false,
    gutterWidth = 200,
    gutterHeight = 200,
    sizes = this.getSizes(),
    leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
    rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom),
    topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
    bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)

  customPan = {}
  customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
  customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));

  return customPan
}
/* Restrict Pan to remain element in viewport */

/* Save Cookies */
function saveSettings(i) {
  var obj = {
    zoom: i.getZoom(),
    pan: i.getPan()
  };
  var d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  document.cookie = 'svgPanZoom=' + JSON.stringify(obj) + ';expires=' + d.toUTCString();
}

/* Load Cookies */
function loadSettings() {
  var match = document.cookie.match(/svgPanZoom\=([^;]+)/);
  try {
    if (match) {
      return JSON.parse(match[1]);
    }
  } catch (e) {}

  return null;
}