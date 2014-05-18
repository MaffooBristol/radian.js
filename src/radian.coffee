`//noprotect` # For JS Bin

_radian = (window, Raphael) ->

  output = []
  segments = []
  scale = 400

  dataURL = 'http://mysite.com/api/data.json'
  element = '#pie'

  r = Raphael element, element.height(), element.width()

  r.customAttributes.arc = (xloc, yloc, value, total, R) ->

    alpha = 360 / total * value
    a = (90 - alpha) * Math.PI / 180
    x = xloc + R * Math.cos(a)
    y = yloc - R * Math.sin(a)

    if total == value
      path = [
        ["M", xloc, yloc - R],
        ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
      ]
    else
      path = [
        ["M", xloc, yloc - R],
        ["A", R, R, 0, +(alpha > 180), 1, x, y]
      ]
    path: path

  $.get dataURL, null, (data) ->

      data = data[0]
      endNodeCount = 0
      do recurse = (data, depth = 0) ->
        data._depth = depth
        output[depth] = output[depth] or []
        output[depth].push data
        if data.children and data.children? and data.children.length > 0
          for child, x in data.children
            recurse child, data._depth + 1
        else
          endNodeCount++

      endNodeDegrees = 360 / endNodeCount
      ringThickness = ((scale - (scale / output.length)) / output.length)

      for ring, ringIndex in output by -1
        segments[ringIndex] = segments[ringIndex] or []
        for segment, segmentIndex in ring
          segments[ringIndex][segmentIndex] = r.path().attr
            "stroke": '#' + ('000000' + ((0x999999 + Math.random() * 0x666666)<<0).toString(16)).slice(-6)
            "stroke-width": ringThickness
            arc: [scale, scale, endNodeDegrees, 360, ringThickness + (ringThickness * ringIndex)]
          segments[ringIndex][segmentIndex].rotate segmentIndex * endNodeDegrees, scale, scale


do (glob = @, factory = _radian) ->
  if typeof define is 'function' and define.amd
    define ['Raphael'], (Raphael) -> factory glob, Raphael
  else
    factory glob, glob.Raphael
