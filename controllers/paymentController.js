const axios = require('axios');
const qs = require('querystring');

const BASE_URL = process.env.PAYFAST_BASE_URL || process.env.PAYMENT_BASE_URL || '';

function buildAuthHeader(req) {
  const auth = req.headers && req.headers.authorization ? req.headers.authorization : '';
  return auth ? { Authorization: auth } : {};
}

function ensureBaseUrl() {
  if (!BASE_URL) {
    throw new Error('Payment BASE_URL is not configured. Set PAYFAST_BASE_URL in environment.');
  }
}

function asForm(data) {
  return qs.stringify(data || {});
}

// POST /token
exports.getToken = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/token`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      withCredentials: true,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /refreshtoken
exports.refreshToken = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/refreshtoken`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /list/banks
exports.listBanks = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/list/banks`;
    const { data } = await axios.get(url, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        ...buildAuthHeader(req),
      },
      params: req.query,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /list/instruments
exports.listInstruments = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/list/instruments`;
    const { data } = await axios.get(url, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        ...buildAuthHeader(req),
      },
      params: req.query,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /list/instrumentbanks
exports.listInstrumentBanks = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/list/instrumentbanks`;
    const { data } = await axios.get(url, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        ...buildAuthHeader(req),
      },
      params: req.query,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /customer/validate
exports.customerValidate = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/customer/validate`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /transaction
exports.initiateTransaction = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/transaction`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /transaction/token
exports.tempTransactionToken = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/transaction/token`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /transaction/tokenized
exports.tokenizedTransaction = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/transaction/tokenized`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /transaction/recurring/otp
exports.recurringOtp = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/transaction/recurring/otp`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /transaction/recurring
exports.recurringTransaction = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/transaction/recurring`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /user/instruments
exports.fetchUserInstruments = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/user/instruments`;
    const { data } = await axios.get(url, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
      params: req.query,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// DELETE /user/instruments
exports.deleteInstrument = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/user/instruments`;
    const form = asForm(req.body);
    const { data } = await axios.delete(url, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
      data: form,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /user/instruments
exports.addPermanentInstrument = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/user/instruments`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /transaction/refund/:transaction_id
exports.refundTransaction = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/transaction/refund/${encodeURIComponent(req.params.transaction_id)}`;
    const form = asForm(req.body);
    const { data } = await axios.post(url, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /transaction/:transaction_id
exports.getTransactionStatusById = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/transaction/${encodeURIComponent(req.params.transaction_id)}`;
    const { data } = await axios.get(url, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
      params: req.query,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /transaction/basket_id/:basket_id
exports.getTransactionStatusByBasketId = async (req, res, next) => {
  try {
    ensureBaseUrl();
    const url = `${BASE_URL}/transaction/basket_id/${encodeURIComponent(req.params.basket_id)}`;
    const { data } = await axios.get(url, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        ...buildAuthHeader(req),
      },
      params: req.query,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

