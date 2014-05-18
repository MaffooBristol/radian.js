//noprotect;
var _radian;

_radian = function(window, Raphael) {
  var dataURL, element, output, r, scale, segments, xhr;
  output = [];
  segments = [];
  scale = 400;
  dataURL = 'http://mysite.com/api/data.json';
  element = document.getElementById('wrapper');
  console.log(element);
  r = Raphael(element, element.offsetHeight, element.offsetWidth);
  r.customAttributes.arc = function(xloc, yloc, value, total, R) {
    var a, alpha, path, x, y;
    alpha = 360 / total * value;
    a = (90 - alpha) * Math.PI / 180;
    x = xloc + R * Math.cos(a);
    y = yloc - R * Math.sin(a);
    if (total === value) {
      path = [["M", xloc, yloc - R], ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]];
    } else {
      path = [["M", xloc, yloc - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
    }
    return {
      path: path
    };
  };
  xhr = new XMLHttpRequest();
  return $.get(dataURL, null, function(data) {
    var endNodeCount, endNodeDegrees, recurse, ring, ringIndex, ringThickness, segment, segmentIndex, _i, _results;
    data = data[0];
    endNodeCount = 0;
    (recurse = function(data, depth) {
      var child, x, _i, _len, _ref, _results;
      data._depth = depth;
      output[depth] = output[depth] || [];
      output[depth].push(data);
      if (data.children && (data.children != null) && data.children.length > 0) {
        _ref = data.children;
        _results = [];
        for (x = _i = 0, _len = _ref.length; _i < _len; x = ++_i) {
          child = _ref[x];
          _results.push(recurse(child, data._depth + 1));
        }
        return _results;
      } else {
        return endNodeCount++;
      }
    })(data, 0);
    endNodeDegrees = 360 / endNodeCount;
    ringThickness = (scale - (scale / output.length)) / output.length;
    _results = [];
    for (ringIndex = _i = output.length - 1; _i >= 0; ringIndex = _i += -1) {
      ring = output[ringIndex];
      segments[ringIndex] = segments[ringIndex] || [];
      _results.push((function() {
        var _j, _len, _results1;
        _results1 = [];
        for (segmentIndex = _j = 0, _len = ring.length; _j < _len; segmentIndex = ++_j) {
          segment = ring[segmentIndex];
          segments[ringIndex][segmentIndex] = r.path().attr({
            "stroke": '#' + ('000000' + ((0x999999 + Math.random() * 0x666666) << 0).toString(16)).slice(-6),
            "stroke-width": ringThickness,
            arc: [scale, scale, endNodeDegrees, 360, ringThickness + (ringThickness * ringIndex)]
          });
          _results1.push(segments[ringIndex][segmentIndex].rotate(segmentIndex * endNodeDegrees, scale, scale));
        }
        return _results1;
      })());
    }
    return _results;
  });
};

(function(glob, factory) {
  if (typeof define === 'function' && define.amd) {
    return define(['Raphael'], function(Raphael) {
      return factory(glob, Raphael);
    });
  } else {
    return factory(glob, glob.Raphael);
  }
})(this, _radian);

/*
//@ sourceMappingURL=radian.map
*/
