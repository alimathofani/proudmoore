const fs = require('fs');
const path = require('path');
const readChunk  = require('read-chunk');
const fileType  = require('file-type');

const AnyController = {
    index: async(req,res,next) => {
		try {
			if (/^[0-9A-F]{32}$/i.test(req.params.id)) {
				const filePath = path.join(process.env.PWD, '/public/uploads/articles/' , req.params.id);
				const buffer = readChunk.sync(filePath, 0, 4100);
				// Get the stored image type for this image
				const storedMimeType = fileType(buffer);
				await res.setHeader('Content-Type', storedMimeType.mime);
				await fs.createReadStream(filePath).pipe(res);
			} else {
				next(createError(404));
			}
		} catch (err) {
			res.status(400).json({
				'status': 'ERROR',
				'messages': err.message
			})
		}
	}

  }
  
  module.exports = AnyController;