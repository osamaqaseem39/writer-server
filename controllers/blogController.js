const { validationResult } = require('express-validator');
const BlogPost = require('../models/BlogPost');

exports.list = async (req, res, next) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { status: 'Published' };
    const posts = await BlogPost.find(query).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.status !== 'Published' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ post });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const post = await BlogPost.create(req.body);
    res.status(201).json({ post });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

