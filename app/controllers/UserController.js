const model = require('../../app/models/index');
const userModel = model.users;

const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');


const UserController = {
    index: async(req,res,next) => {
		try {
			const users = await userModel.findAll({});
			return res.status(200).json({
				'status': 'OK',
				'messages': '',
				'data': users
			})
		} catch (err) {
			next(err)
		}
	},
	create : (req,res,next) => {
		const userData = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		};
		userModel.findOne({
			where: {
			  email: req.body.email
			}
		})
		.then(user => {
			if (!user) {
				userModel.create(userData)
				.then(user => {
					// Redirect 
					// res.redirect(307, '/login');
					res.json({ status: user.email + ' Registered!' })
				})
				.catch(err => {
					res.send('error: ' + err)
				})
			} else {
			res.json({ error: 'User already exists' })
			}
		})
		.catch(err => {
			res.status(404).send('error: ' + err)
		})
		
	},
	update : async(req,res,next) => {
		try {
			return res.status(200).json({
				'status': 'OK',
				'messages': '',
			})
		} catch (err) {
			next(err)
		}
	},
	show : async(req,res,next) => {
		try {
			return res.status(200).json({
				'status': 'OK',
				'messages': '',
			})
		} catch (err) {
			next(err)
		}
	},
	destroy : async(req,res,next) => {
		try {
			const userId = req.params.id;
			const user = await userModel.destroy({ 
				where: {
					id: userId
				},
				returning : true
			});

			return res.status(200).json({
				'status': 'OK',
				'messages': '',
			})
		} catch (err) {
			next(err)
		}
	},
	authenticate: async(req, res, next) => {
		try {
			const userInfo = await userModel.findOne({ where: {email:req.body.email} });
			if (!userInfo) {
				next();
			} else {
				if(bcrypt.compareSync(req.body.password, userInfo.password)) {
					const token = jwt.sign({
						id: userInfo.id,
						email: userInfo.email
					}, process.env.JWT_KEY, { expiresIn: '1h' });
					return res.json({status:"success", message: "user found!!!", data:{user: userInfo, token:token}});
				}else{
					return res.json({status:"error", message: "Invalid email/password!!!", data:null});
				}
			}
		} catch (err) {
			return res.status(400).json({
				'status': 'ERROR',
				'messages': err.message,
			})
		}
	},
  }
  
  module.exports = UserController;