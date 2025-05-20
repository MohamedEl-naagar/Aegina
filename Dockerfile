FROM node:20.19.2

WORKDIR /Aegina


COPY . /Aegina/
EXPOSE 3000
RUN npm install


CMD npm start