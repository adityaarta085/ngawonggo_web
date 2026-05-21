import handler from './api/generate-ai-image.js';

const req = {
  method: 'POST',
  body: { prompt: 'cat' }
};

const res = {
  setHeader: () => {},
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log("Response:", this.statusCode, data);
  },
  end: () => {}
};

handler(req, res);
