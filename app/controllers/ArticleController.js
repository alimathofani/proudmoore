const model = require('../../app/models/index');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const indicative = require('indicative');
const articleModel = model.articles;

const ArticleController = {
    index: async(req,res,next) => {
		try {
			const articles = await articleModel.findAll({
				attributes: [
					'id',
					'author',
					'body',
					'image',
					[Sequelize.fn('CONCAT', req.protocol + '://' + req.get('host') + '/' ,  Sequelize.col('image')), 'imageSrc']
				],
			});
			if (articles.length !== 0) {
				res.status(200).json({
				  'status': 'OK',
				  'messages': '',
				  'data': articles
				})
			  } else {
				res.status(200).json({
				  'status': 'OK',
				  'messages': 'EMPTY',
				  'data': {}
				})
			}
		} catch (err) {
			res.status(400).json({
				'status': 'ERROR',
				'messages': err.message
			})
		}
	},

	create: async(req,res,next) => {
		try {
			const {
				title,
				author,
				body
			} = req.body;
			const rules = {
				title: 'required',
				author: 'required',
				body: 'required'
			};
			const messages = {
				required: 'The field is required'
			};
			const data = {
				title : title,
				author : author,
				body : body
			};
			await indicative.validateAll(data, rules, messages);

			let createData = {};
			var image = req.file;
			if (image){
				createData = {
					title : title,
					author : author,
					body : body,
					image : image.path
				}
			}else{
				createData = {
					title : title,
					author : author,
					body : body
				}
			}
			const article = await articleModel.create(createData);
			if (article) {
				return res.status(201).json({
					'status': 'OK',
					'messages': 'Article berhasil ditambahkan',
					'data': article,
				})
			}
		} catch (err) {
			return res.status(400).json({
				'status': 'ERROR',
				'messages': err
			})
		}
	},
	
	update: async(req,res,next) => {
		try {
			const articleId = req.params.id;
			const articleCheck =  await articleModel.findByPk(articleId);
			if(!articleCheck) return next();
			const oldImage = articleCheck.image;
			
			const {
				title,
				author,
				body
			} = req.body;

			const rules = {
				title: 'required',
				author: 'required',
				body: 'required'
			};
			const messages = {
				required: 'The field is required'
			}

			const data = {
				title : title,
				author : author,
				body : body
			}

			await indicative.validateAll(data, rules, messages);

			let createData = {};
			var image = req.file;
			if (image){
				createData = {
					title : title,
					author : author,
					body : body,
					image : image.path
				}
			}else{
				createData = {
					title : title,
					author : author,
					body : body
				}
			}

			const article = await articleModel.update(createData, {
				where: {id: articleId}
			});
			
			if (article) {
				if (image){
					const filePath = await path.join(process.env.PWD,oldImage);
					fs.unlink(filePath, function(err) {
						if (err) throw err;
						console.log('file deleted');
					});
				}
				const returnArticle =  await articleModel.findByPk(articleId)
				res.json({
					'status': 'OK',
					'messages': 'Article berhasil diupdate',
					'data': returnArticle,
				})
			}else{
				res.json({
					'status': 'OK',
					'messages': 'Article Cant Update',
				})
			}
		  } catch (err) {
			res.status(400).json({
			  'status': 'ERROR',
			  'messages': err.message
			})
		  }
	},

	show: async(req,res,next) => {
		try {
			const articleId = req.params.id;
			const article = await articleModel.findByPk(articleId);
			if (article) {
				res.status(200).json({
				  'status': 'OK',
				  'messages': '',
				  'data': article
				})
			  } else {
				res.status(200).json({
				  'status': 'OK',
				  'messages': 'NO RESULT'
				})
			}
		} catch (err) {
			res.status(400).json({
				'status': 'ERROR',
				'messages': err.message
			})
		}
	},
	
	destroy: async(req,res,next) => {
		try {
			const articleId = req.params.id;
			const article = await articleModel.destroy({ 
				where: {
					id: articleId
				},
				returning : true
			});
			res.json({data:article});
			if (article) {
				// const filePath = await path.join(process.env.PWD,oldImage);
				// fs.unlink(filePath, function(err) {
				// 	if (err) throw err;
				// 	console.log('file deleted');
				// });
				res.json({
					'status': 'OK',
					'messages': 'User berhasil dihapus',
					'data': article,
				})
			}else{
				res.json({
					'status': 'OK',
					'messages': 'Article Not Found',
				  })
			}
		} catch (err) {
			res.status(400).json({
				'status': 'ERROR',
				'messages': err.message
			})
		}
	},
  }
  
  module.exports = ArticleController;