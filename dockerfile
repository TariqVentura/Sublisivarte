FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install axios bcrypt body-parser cors dotenv ejs express express-ejs express-ejs-layouts express-session fs jsonwebtoken mongoose morgan multer node-datetime node-localstorage nodemailer nodemon pdf-creator-node session

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]