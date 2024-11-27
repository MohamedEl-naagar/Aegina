FROM node:20.18.1

WORKDIR /Aegina


COPY . /Aegina/
EXPOSE 3000
RUN npm install


CMD npm start