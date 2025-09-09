FROM node:20.19.5

WORKDIR /Aegina


COPY . /Aegina/
EXPOSE 3000
RUN npm install


CMD npm start