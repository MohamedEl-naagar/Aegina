FROM node:20.13.1

WORKDIR /Aegina


COPY . /Aegina/
EXPOSE 3000
RUN npm install


CMD npm start