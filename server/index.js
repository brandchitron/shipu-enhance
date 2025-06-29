const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upscale', upload.single('image'), (req, res) => {
  const inputPath = path.resolve(req.file.path);
  const filename = path.parse(req.file.originalname).name;
  const outputPath = `results/${filename}_out.png`;

  const cmd = `python3 ./realesrgan/inference_realesrgan.py -n RealESRGAN_x4plus -i ${inputPath} -o results/`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) return res.status(500).send('Upscaling failed');
    res.download(outputPath, `${filename}_upscaled.png`);
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
