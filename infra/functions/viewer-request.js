// CloudFront Function (viewer-request), cloudfront-js-2.0 runtime.
// 1. 301-redirects www.sometimescreekventures.com to the apex domain.
// 2. Rewrites directory-style URLs to the index.html Astro emits
//    (/work -> /work/index.html) so S3 origin lookups resolve.

var APEX = 'sometimescreekventures.com';

function handler(event) {
  var request = event.request;
  var host = request.headers.host && request.headers.host.value;

  if (host === 'www.' + APEX) {
    var qs = '';
    for (var key in request.querystring) {
      var entry = request.querystring[key];
      var values = entry.multiValue
        ? entry.multiValue.map(function (v) {
            return v.value;
          })
        : [entry.value];
      for (var i = 0; i < values.length; i++) {
        qs += (qs === '' ? '?' : '&') + key + '=' + values[i];
      }
    }
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: 'https://' + APEX + request.uri + qs },
      },
    };
  }

  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.split('/').pop().includes('.')) {
    request.uri = uri + '/index.html';
  }

  return request;
}
